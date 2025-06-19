import { useEffect, useState } from "react";

export default function SensorInflux() {
  const [data, setData] = useState({ temperature: null, humidity: null });

  useEffect(() => {
    fetch("http://localhost:3001/sensor")
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error("Gagal ambil data:", err));
  }, []);

  return (
    <div>
      <h2>📡 Sensor (InfluxDB)</h2>
      <p>🌡️ Temperature: {data.temperature ?? "-"}°C</p>
      <p>💧 Humidity: {data.humidity ?? "-"}%</p>
    </div>
  );
}
