import { useEffect, useState } from "react";
import { Data } from "../models/models";

// Importar dinámicamente todos los archivos JSON en utils
const requireJson = (require as any).context("../utils", false, /\.json$/);
const jsonData = requireJson.keys().map((file) => requireJson(file));

export const usePulseData = () => {
  const [pulseData, setPulseData] = useState<Data[]>([]);

  useEffect(() => {
    let lastPulse = 0;

    const extractedData = jsonData.flatMap((sensorData) =>
      sensorData
        .filter((entry: any) => entry.uplink_message?.decoded_payload)
        .map((entry: any, index: number) => {
          const { uplink_message, end_device_ids } = entry;
          
          const difference =
            lastPulse === 0 ? 0 : uplink_message.decoded_payload.pulse - lastPulse;
          lastPulse = uplink_message.decoded_payload.pulse;

          return {
            id: index + 1,
            pulse: uplink_message.decoded_payload.pulse,
            DevUI: end_device_ids?.dev_eui ?? "N/A",
            battery: uplink_message.decoded_payload.battery ?? "N/A",
            humidity: uplink_message.decoded_payload.humidity ?? "N/A",
            temperature: uplink_message.decoded_payload.temperature ?? "N/A",
            time: uplink_message.rx_metadata?.[0]?.time
              ? new Date(uplink_message.rx_metadata[0].time)
              : "Fecha desconocida",
            difference,
            count: difference !== 0 ? 1 : 0,
          };
        })
    );

    setPulseData(extractedData);
  }, []);

  return pulseData;
};
