import { useEffect, useState } from "react";
import axios from "axios";
import { Data } from "../models/models";

interface GroupedData {
  [devUI: string]: Data[];
}

export const usePulseData = () => {
  const [pulseData, setPulseData] = useState<GroupedData>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener la lista de dispositivos
        const dispositivosResponse = await axios.get("http://localhost:8800/dispositivos");
        const dispositivos = dispositivosResponse.data.data; // Extrae la propiedad data

        console.log("Dispositivos:", dispositivos);

        // Obtener los datos de los sensores
        const dataResponse = await axios.get("http://localhost:8800/data");
        const jsonData = dataResponse.data.data;

        console.log("Fetched data:", jsonData);

        let lastPulses: { [key: string]: number } = {};

        const groupedData: GroupedData = {};

        jsonData.forEach((entry: any) => {
          const jsonContentArray = JSON.parse(entry.json);
          jsonContentArray.forEach((jsonContent: any) => {
            const { uplink_message, end_device_ids } = jsonContent;

            if (!uplink_message?.decoded_payload) return;

            const devUI = end_device_ids?.dev_eui ?? "N/A";

            // Filtrar solo los dispositivos que están en la lista de dispositivos
            if (!dispositivos.some((device: any) => device.dev_ui === devUI)) return;

            const difference =
              lastPulses[devUI] === undefined ? 0 : uplink_message.decoded_payload.pulse - lastPulses[devUI];
            lastPulses[devUI] = uplink_message.decoded_payload.pulse;

            const extractedData: Data = {
              pulse: uplink_message.decoded_payload.pulse,
              DevUI: devUI,
              battery: uplink_message.decoded_payload.battery ?? "N/A",
              humidity: uplink_message.decoded_payload.humidity ?? "N/A",
              temperature: uplink_message.decoded_payload.temperature ?? "N/A",
              time: uplink_message.received_at 
              ? new Date(uplink_message.received_at) 
              : "Fecha desconocida",
              difference,
              count: difference !== 0 ? 1 : 0,
            };

            if (!groupedData[devUI]) {
              groupedData[devUI] = [];
            }
            groupedData[devUI].push(extractedData);
          });
        });

        console.log("Grouped Data:", groupedData);

        setPulseData(groupedData);
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
