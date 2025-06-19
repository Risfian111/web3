import { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "../abi/SensorContract.json";

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

export default function SensorBlockchain() {
  const [account, setAccount] = useState("");
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);

  const connectWallet = async () => {
    const [acc] = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(acc);
  };

  const fetchData = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi.abi, signer);
    const [temp, hum] = await contract.getLatestSensorData();
    setTemperature(Number(temp));
    setHumidity(Number(hum));
  };

  useEffect(() => { connectWallet(); }, []);

  return (
    <div>
      <h2>🔗 Sensor (Blockchain)</h2>
      <p>👛 Wallet: {account}</p>
      <button onClick={fetchData}>Ambil Data</button>
      <p>🌡️ Temperature: {temperature ?? "-"}°C</p>
      <p>💧 Humidity: {humidity ?? "-"}%</p>
    </div>
  );
}
