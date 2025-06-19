import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./abi/SensorContract.json";

const contractAddress = "0xYourContractAddressHere"; // Ganti sesuai alamat kontrak

export default function App() {
  const [sensorData, setSensorData] = useState({
    temperature: null,
    humidity: null,
    timestamp: null,
  });
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) return alert("🔌 Install MetaMask terlebih dahulu!");
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setWalletAddress(accounts[0]);
  };

  const fetchSensorData = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi.abi, signer);

      const [temp, hum, time] = await contract.getMyData();
      setSensorData({
        temperature: Number(temp),
        humidity: Number(hum),
        timestamp: new Date(Number(time) * 1000).toLocaleString(),
      });
    } catch (err) {
      console.error("Gagal mengambil data sensor:", err);
    }
  };

  useEffect(() => {
    connectWallet().then(fetchSensorData);
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📡 Monitoring Data Sensor Blockchain</h1>

      <div style={styles.card}>
        <p><strong>🆔 Wallet:</strong> {walletAddress || "Belum terhubung"}</p>
        <p><strong>🌡️ Suhu:</strong> {sensorData.temperature ?? "--"} °C</p>
        <p><strong>💧 Kelembaban:</strong> {sensorData.humidity ?? "--"} %</p>
        <p><strong>⏱️ Waktu:</strong> {sensorData.timestamp ?? "--"}</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f4f4",
    minHeight: "100vh",
  },
  title: {
    color: "#4caf50",
    textAlign: "center",
    marginBottom: "2rem",
  },
  card: {
    maxWidth: "500px",
    margin: "0 auto",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    padding: "2rem",
    fontSize: "18px",
    lineHeight: "1.6",
  },
};
