import React, { useState, useEffect } from "react";
import {
  Loader2,
  User2,
  History,
  ArrowLeft,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Banknote,
} from "lucide-react";
import { API_URL } from "../config";
import axios from "axios";
import { getUserById } from "../components/layout/fetchUser";

const API_BASE_URL = API_URL;
const getAuthToken = () => localStorage.getItem("accessToken");

export default function WithdrawRequest() {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Paytm");
  const [number, setNumber] = useState("");
  const [bankholderName, setBankholderName] = useState("");
  const [account, setAccount] = useState("");
  const [ifsc, setIfsc] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(null);
  const [siteData, setSiteData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [user, setUser] = useState(null);

  const userId = localStorage.getItem("userId");

  // Load Initial Data
  useEffect(() => {
    const loadSiteData = async () => {
      try {
        const res = await axios.get(`${API_URL}/sitedata/get`);
        setSiteData(res.data);
      } catch (err) { console.log(err); }
    };

    const loadSettings = async () => {
      try {
        const res = await axios.get(`${API_URL}/settings/get`);
        setSettings(res.data);
      } catch (err) { console.log(err); }
    };

    loadSiteData();
    loadSettings();
  }, []);

  const fetchBalance = async () => {
    const token = getAuthToken();
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/user/balance`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) setCurrentBalance(data.balance);
    } catch (error) { console.log(error); }
  };

  useEffect(() => {
    fetchBalance();
    async function fetchUser() {
      const { data } = await getUserById(userId);
      if (data) setUser(data);
    }
    fetchUser();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    const token = getAuthToken();
    const minWithdraw = settings?.min_withdraw || 200;

    if (!token) {
      setMessage({ type: "error", text: "Please log in first." });
      return;
    }

    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount < minWithdraw) {
      setMessage({ type: "error", text: `Minimum withdrawal is ₹${minWithdraw}.` });
      return;
    }

    if (withdrawAmount > currentBalance) {
      setMessage({ type: "error", text: "Insufficient balance." });
      return;
    }

    setLoading(true);
    let payload = method === "Bank Transfer" 
      ? { amount: withdrawAmount, method, account_holder_name: bankholderName, account_no: account, ifc_code: ifsc }
      : { amount: withdrawAmount, method, number };

    try {
      const response = await axios.post(
        `${API_URL}/user-deposit-withdrawal/withdraw/request`,
        new URLSearchParams(payload),
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/x-www-form-urlencoded" },
        }
      );
      if (response.data.message === "Withdrawal request submitted") {
        fetchBalance();
        setMessage({ type: "success", text: "Request submitted successfully! Review pending." });
        setAmount("");
        setNumber("");
      }
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.detail || "Request failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans text-gray-800">
      {/* HEADER - Rajan Matka Teal Theme */}
      <div className="bg-[#005d54] max-w-md mx-auto text-white p-4 pb-12 rounded-b-[35px] shadow-lg sticky top-0 z-20">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button onClick={() => window.history.back()} className="p-2 bg-white/10 rounded-full">
            <ArrowLeft size={22} />
          </button>
          <h2 className="text-lg font-bold uppercase tracking-wider">Withdraw Funds</h2>
          <a href="/withdrawal-history" className="p-2 bg-white/10 rounded-full">
            <History size={22} />
          </a>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-8 pb-32">
        {/* BALANCE CARD */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center text-center">
          <div className="bg-teal-50 p-3 rounded-full mb-2">
            <Wallet className="text-[#005d54]" size={28} />
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-tight">Available Balance</p>
          <p className="text-4xl font-black text-[#005d54] my-1">
            ₹{currentBalance?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1 text-[10px] bg-gray-100 px-3 py-1 rounded-full font-bold text-gray-600 uppercase">
             <User2 size={12} /> {user?.username}
          </div>
        </div>

        {/* MESSAGE BOX */}
        {message && (
          <div className={`mt-4 p-4 rounded-2xl flex items-center gap-3 border ${
            message.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"
          }`}>
            {message.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <p className="text-sm font-bold">{message.text}</p>
          </div>
        )}

        {/* WITHDRAWAL FORM */}
        <div className="mt-6 bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-gray-500 block mb-1.5 text-xs font-bold uppercase tracking-tight ml-1">Withdraw Amount</label>
              <div className="relative">
                <input
                  type="number"
                  placeholder={`Min ₹${settings?.min_withdraw || 200}`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all font-bold text-lg"
                  disabled={loading}
                />
                <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-600" size={20} />
              </div>
            </div>

            <div>
              <label className="text-gray-500 block mb-1.5 text-xs font-bold uppercase tracking-tight ml-1">Payment Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all font-bold text-sm"
                disabled={loading}
              >
                {["Paytm", "Google Pay", "PhonePe", "Bank Transfer"].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {method !== "Bank Transfer" ? (
              <div>
                <label className="text-gray-500 block mb-1.5 text-xs font-bold uppercase tracking-tight ml-1">{method} Number / UPI ID</label>
                <input
                  type="text"
                  placeholder={`Enter your ${method} ID`}
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:border-teal-500 outline-none font-medium"
                  required
                  disabled={loading}
                />
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-300">
                <input type="text" placeholder="Bank Holder Name" value={bankholderName} onChange={(e) => setBankholderName(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 outline-none" required />
                <input type="text" placeholder="Account Number" value={account} onChange={(e) => setAccount(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 outline-none" required />
                <input type="text" placeholder="IFSC Code" value={ifsc} onChange={(e) => setIfsc(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 outline-none" required />
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !amount || amount < (settings?.min_withdraw || 200)}
              className="w-full bg-gradient-to-r from-[#00695c] to-[#00897b] text-white font-black py-4 rounded-2xl shadow-lg hover:opacity-95 active:scale-95 transition-all uppercase tracking-widest text-sm disabled:opacity-50 mt-4"
            >
              {loading ? <Loader2 className="animate-spin mx-auto" /> : "Submit Request"}
            </button>
          </form>
        </div>

        {/* TERMS SECTION */}
        <div className="mt-8 bg-teal-50 p-6 rounded-3xl border border-teal-100">
          <h3 className="text-[#005d54] font-black text-sm uppercase mb-3 flex items-center gap-2">
            <AlertCircle size={16} /> Withdrawal Rules
          </h3>
          {siteData?.withdraw_terms_html ? (
            <div className="text-teal-900 text-xs font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: siteData?.withdraw_terms_html }} />
          ) : (
            <ul className="list-disc pl-5 text-teal-900 text-xs font-medium space-y-1">
              <li>Withdrawal time: 9 AM to 6 PM</li>
              <li>Processed within 30 minutes</li>
              <li>UPI ID must be correct and verified</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}