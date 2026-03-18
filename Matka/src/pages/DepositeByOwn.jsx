import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, IndianRupee, Wallet, CheckCircle2 } from "lucide-react";
import { API_URL } from "../config";

export default function DepositeByOwn({ onRequestCreated }) {
  const [loading, setLoading] = useState(false);
  const [siteData, setSiteData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [amount, setAmount] = useState(() => localStorage.getItem("add_amount") || "");

  useEffect(() => {
    localStorage.setItem("add_amount", amount);
  }, [amount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) < settings?.min_deposit) {
      alert(`Minimum deposit is ₹${settings?.min_deposit}`);
      return;
    }

    setLoading(true);
    try {
      const user_id = localStorage.getItem("userId");
      const token = localStorage.getItem("accessToken");

      const res = await axios.post(
        `${API_URL}/payment/create-order`,
        { user_id, amount: parseFloat(amount) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { order_id, key, amount: razorAmount } = res.data;

      const options = {
        key: key,
        amount: razorAmount,
        currency: "INR",
        name: "Kalyan Ratan",
        description: "Wallet Points Deposit",
        order_id: order_id,
        handler: function (response) {
          alert("✅ Payment Successful! Points will be added soon.");
          setAmount("");
          onRequestCreated();
        },
        prefill: { contact: "", email: "" },
        theme: { color: "#005d54" } // Theme Match with Header
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => alert("❌ Payment Failed"));
      rzp.open();
    } catch (error) {
      console.log(error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get(`${API_URL}/settings/get`);
        const sited = await axios.get(`${API_URL}/sitedata/get`);
        setSiteData(sited?.data);
        setSettings(res?.data);
      } catch (error) {
        console.log("Settings API Error:", error);
      }
    }
    load();
  }, []);

  return (
    <div className="w-full animate-in fade-in duration-500 px-2">
      <form onSubmit={handleSubmit} className="p-2 pt-4">
        {/* INPUT LABEL SECTION */}
        <div className="flex items-center gap-2 mb-4 px-2">
          <div className="bg-teal-50 p-2 rounded-lg text-[#005d54]">
            <Wallet size={18} />
          </div>
          <div>
            <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">Enter Points</h2>
            <p className="text-[10px] font-bold text-teal-600 italic">Fast & Secure Deposit</p>
          </div>
        </div>

        {/* AMOUNT INPUT */}
        <div className="relative mb-6">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</div>
          <input
            type="number"
            placeholder={`Min ₹${settings?.min_deposit || '...'}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-gray-50 text-gray-800 font-black text-lg py-4 pl-8 pr-4 rounded-2xl border border-gray-100 focus:border-[#005d54] focus:ring-2 focus:ring-teal-500/10 outline-none transition-all placeholder:text-gray-300"
          />
        </div>

        {/* QUICK SELECT BUTTONS */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[300, 500, 1000, 2000, 5000, 10000].map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setAmount(amt)}
              className={`py-2.5 rounded-xl font-black text-xs transition-all border ${
                Number(amount) === amt
                  ? "bg-[#005d54] text-white border-[#005d54] shadow-md shadow-teal-900/20 scale-[1.05]"
                  : "bg-white text-gray-500 border-gray-100 hover:border-teal-200"
              }`}
            >
              ₹{amt}
            </button>
          ))}
        </div>

        {/* PROCEED BUTTON */}
        <button
          disabled={loading || !settings?.min_deposit || Number(amount) < settings?.min_deposit}
          className={`group w-full relative overflow-hidden bg-[#005d54] text-white font-black uppercase tracking-widest py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-teal-900/20 ${
            (loading || Number(amount) < settings?.min_deposit) ? "opacity-40 grayscale pointer-events-none" : ""
          }`}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <span>Add Points Now</span>
              <CheckCircle2 size={18} className="opacity-50" />
            </>
          )}
        </button>
      </form>

      {/* DYNAMIC HTML CONTENT */}
      {siteData?.add_money_html && (
        <div className="mt-4 mx-4 p-4 bg-gray-50 rounded-[2rem] border border-gray-100">
          <div
            className="text-gray-500 text-[11px] font-bold leading-relaxed prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: siteData?.add_money_html }}
          />
        </div>
      )}
    </div>
  );
}