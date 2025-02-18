import { useEffect, useState } from "react";
import axios from "axios";
import { Data } from "../models/models";

export const usePulseData = () => {
  const [pulseData, setPulseData] = useState<Data[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8800/data"); // URL del backend
        const jsonData = response.data.data; // Extraer la propiedad data del objeto

        console.log("Fetched data:", jsonData); // Log the fetched data

        let lastPulse = 0;
        const extractedData = jsonData.flatMap((entry: any) => {
          const jsonContentArray = JSON.parse(entry.json);
          return jsonContentArray.flatMap((jsonContent: any) => {
            const { uplink_message, end_device_ids } = jsonContent;

            if (!uplink_message?.decoded_payload) return [];

            const difference =
              lastPulse === 0 ? 0 : uplink_message.decoded_payload.pulse - lastPulse;
            lastPulse = uplink_message.decoded_payload.pulse;

            return {
              pulse: uplink_message.decoded_payload.pulse,
              DevUI: end_device_ids?.dev_eui ?? "N/A",
              battery: uplink_message.decoded_payload.battery ?? "N/A",
              humidity: uplink_message.decoded_payload.humidity ?? "N/A",
              temperature: uplink_message.decoded_payload.temperature ?? "N/A",
              time: uplink_message.received_at 
              ? new Date(uplink_message.received_at) 
              : "Fecha desconocida",
              difference,
              count: difference !== 0 ? 1 : 0, // Mismo conteo de pulsos por hora
            };
          });
        });

        console.log("Extracted data:", extractedData); // Log the extracted data

        setPulseData(extractedData); // Actualizar el estado con los datos extraídos
      } catch (error) {
        setError("Error al obtener datos del backend.");
        console.error("Error al obtener datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { pulseData, loading, error };
};
