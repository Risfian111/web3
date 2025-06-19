import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import LockAbi from './abi/Lock.json';

function App() {
  const [unlockTime, setUnlockTime] = useState(null);
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState(null);

  const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Install Metamask!");
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setError(null);
    } catch (err) {
      console.error("Wallet connect error:", err);
      setError("❌ Gagal menghubungkan wallet.");
    }
  };

  const getUnlockTime = async () => {
    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, LockAbi.abi, signer);

      const time = await contract.unlockTime();

      if (!time) throw new Error("unlockTime kosong");
      setUnlockTime(new Date(Number(time) * 1000).toLocaleString());
      setError(null);
    } catch (err) {
      console.error("Contract fetch error:", err);
      setError("❌ Gagal mengambil data kontrak. Pastikan jaringan dan alamat kontrak valid.");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    try {
      setTxStatus("⏳ Menunggu konfirmasi di MetaMask...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, LockAbi.abi, signer);

      const tx = await contract.withdraw(); // 💸 Ini memicu MetaMask
      setTxStatus("⏳ Transaksi sedang diproses...");
      await tx.wait();
      setTxStatus("✅ Withdraw berhasil!");
    } catch (err) {
      console.error("Withdraw error:", err);
      setTxStatus("❌ Gagal withdraw. Mungkin belum waktunya atau saldo kosong.");
    }
  };

  useEffect(() => {
    if (account) {
      getUnlockTime();
    }
  }, [account]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#6366f1] via-[#8b5cf6] to-[#ec4899] text-white font-sans p-4">
      <div className="backdrop-blur-lg bg-white/10 p-8 rounded-3xl shadow-2xl max-w-md w-full">
        <h1 className="text-3xl font-extrabold text-center mb-6 tracking-tight">🔐 Lock Contract Info</h1>

        <div className="mb-6 text-center">
          <p className="text-sm uppercase tracking-wide text-gray-300">Unlock Time</p>
          <p className="text-xl font-mono mt-1">
            {loading ? "⏳ Memuat..." : unlockTime || 'Belum dimuat'}
          </p>
        </div>

        {account ? (
          <>
            <div className="text-center text-sm mt-4">
              ✅ Wallet terhubung:
              <p className="mt-1 break-all font-mono text-green-300">{account}</p>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={handleWithdraw}
                className="bg-green-400 hover:bg-green-500 text-black font-semibold py-2 px-5 rounded-full transition-all shadow-lg hover:scale-105"
              >
                💸 Withdraw
              </button>
              {txStatus && <p className="text-sm mt-3">{txStatus}</p>}
            </div>
          </>
        ) : (
          <div className="text-center">
            <button
              onClick={connectWallet}
              className="bg-yellow-300 hover:bg-yellow-400 text-black font-semibold py-2 px-5 rounded-full transition-all shadow-lg hover:scale-105"
            >
              🔌 Connect Wallet
            </button>
          </div>
        )}

        {error && <p className="text-red-200 mt-6 text-center text-sm">{error}</p>}
      </div>
    </div>
  );
}

export default App;
