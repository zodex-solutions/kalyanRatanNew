// src/pages/Admin/Qr/AddMoneyQrTab.jsx
import { Copy, Check, Upload, QrCode, Smartphone, Info, Loader2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../config";

const API_BASE = `${API_URL}/user-deposit-withdrawal`;

const AddMoneyQrTab = () => {
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("accessToken");

  const [currentQR, setCurrentQR] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [amount, setAmount] = useState(() => localStorage.getItem("add_amount") || "");
  const [copied, setCopied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [siteData, setSiteData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [uploading, setUploading] = useState(false);

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

  const fetchCurrentQR = async () => {
    try {
      const res = await axios.get(`${API_URL}/image/get`);
      if (res.data?.image_url) {
        setCurrentQR(`${API_URL}${res.data.image_url}?t=${new Date().getTime()}`);
      }
    } catch (error) {
      console.log("QR FETCH ERROR:", error);
    }
  };

  useEffect(() => {
    fetchCurrentQR();
  }, []);

  const openPicker = () => fileInputRef.current?.click();

  const onSelect = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setSelectedFile(f);
    setPreviewImage(URL.createObjectURL(f));
  };

  const uploadNow = async () => {
    const currentAmount = localStorage.getItem("add_amount") || amount;
    if (!currentAmount || Number(currentAmount) < settings?.min_deposit) {
      alert(`Please enter minimum amount: ₹${settings?.min_deposit}`);
      return;
    }
    if (!selectedFile) {
      alert("Please upload a screenshot");
      return;
    }

    setUploading(true);
    const fd = new FormData();
    fd.append("image", selectedFile);
    fd.append("amount", currentAmount);
    fd.append("method", "QR_CODE");

    try {
      await axios.post(`${API_BASE}/upload`, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("add_amount");
      setPreviewImage(null);
      setSelectedFile(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.log("UPLOAD ERROR:", err);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full animate-in fade-in duration-500 px-2 pb-6">
      {/* -------------------- UPI ID SECTION -------------------- */}
      <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 mb-6 relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-[10px] font-black text-teal-700 uppercase tracking-widest mb-1">Official UPI ID</p>
            <p className="text-sm font-black text-gray-800 tracking-tight">{siteData?.upi_id || "Loading..."}</p>
          </div>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(siteData?.upi_id);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className={`p-3 rounded-xl transition-all ${copied ? 'bg-green-500 text-white' : 'bg-white text-[#005d54] shadow-sm'}`}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>
        <Smartphone className="absolute -right-4 -bottom-4 text-teal-200/40 w-20 h-20 rotate-12" />
      </div>

      {/* -------------------- QR CARD -------------------- */}
      <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 shadow-sm mb-6 text-center relative">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-50 px-4 py-1 rounded-full border border-gray-100">
           <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Scan to Pay</p>
        </div>
        <div className="mt-6 p-3 bg-gray-50 inline-block rounded-3xl border border-gray-100 shadow-inner">
           <img
            src={currentQR || "/assets/logo.png"}
            className="w-44 h-44 rounded-2xl mx-auto object-cover"
            alt="UPI QR"
          />
        </div>
        <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Active QR Scanner</p>
        </div>
      </div>

      {/* -------------------- AMOUNT INPUT -------------------- */}
      <div className="px-2">
        <div className="relative mb-4">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</div>
            <input
                type="number"
                placeholder={`Enter Amount (Min ₹${settings?.min_deposit})`}
                value={amount}
                onChange={(e) => {
                    setAmount(e.target.value);
                    localStorage.setItem("add_amount", e.target.value);
                }}
                className="w-full bg-white text-gray-800 font-black text-lg py-4 pl-8 pr-4 rounded-2xl border border-gray-100 focus:border-[#005d54] focus:ring-2 focus:ring-teal-500/10 outline-none transition-all placeholder:text-gray-300 shadow-sm"
            />
        </div>

        {/* QUICK AMOUNTS */}
        <div className="grid grid-cols-3 gap-2 mb-6">
            {[300, 500, 1000, 2000, 5000, 10000].map((amt) => (
                <button
                    key={amt}
                    type="button"
                    onClick={() => {
                        setAmount(amt);
                        localStorage.setItem("add_amount", amt);
                    }}
                    className={`py-2 rounded-xl font-black text-[10px] transition-all border ${
                        Number(amount) === amt
                        ? "bg-[#005d54] text-white border-[#005d54] shadow-md"
                        : "bg-white text-gray-500 border-gray-100"
                    }`}
                >
                    ₹{amt}
                </button>
            ))}
        </div>

        {/* -------------------- INSTRUCTIONS -------------------- */}
        <div className="bg-yellow-50/50 border border-yellow-100 rounded-2xl p-4 mb-6 flex gap-3 items-start">
            <Info className="text-yellow-600 shrink-0 mt-0.5" size={16} />
            <div className="text-[10px] font-bold text-gray-600 leading-relaxed uppercase italic">
                {siteData?.withdraw_money_html ? (
                    <div dangerouslySetInnerHTML={{ __html: siteData?.withdraw_money_html }} />
                ) : (
                    <p>Pay on UPI and upload screenshot. Points will be added within 2 minutes.</p>
                )}
            </div>
        </div>

        {/* UPLOAD BUTTON */}
        <input type="file" ref={fileInputRef} onChange={onSelect} className="hidden" />
        <button
            onClick={openPicker}
            disabled={!amount || Number(amount) < (settings?.min_deposit || 0)}
            className={`w-full bg-[#005d54] text-white font-black uppercase tracking-widest py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-teal-900/20 ${
                (!amount || Number(amount) < (settings?.min_deposit || 0)) ? "opacity-40 grayscale pointer-events-none" : ""
            }`}
        >
            <Upload size={18} />
            <span>Upload Screenshot</span>
        </button>
      </div>

      {/* ---------------- SUCCESS / COPY TOASTS ---------------- */}
      {(showSuccess || copied) && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-bounce">
            <div className={`${showSuccess ? 'bg-green-600' : 'bg-gray-800'} text-white px-6 py-3 rounded-2xl shadow-2xl border-2 border-white/20 text-center`}>
                <p className="text-xs font-black uppercase tracking-widest italic">
                    {showSuccess ? "✅ Uploaded Successfully!" : "📋 UPI ID Copied!"}
                </p>
            </div>
        </div>
      )}

      {/* ---------------- PREVIEW MODAL ---------------- */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
          <div className="bg-white rounded-[2.5rem] p-6 w-full max-w-xs animate-in zoom-in duration-300 shadow-2xl">
            <div className="flex items-center gap-2 mb-4 text-[#005d54]">
                <QrCode size={20} />
                <h3 className="font-black uppercase italic text-sm">Payment Proof</h3>
            </div>
            <img src={previewImage} className="w-full aspect-square object-cover rounded-3xl border-4 border-gray-50 mb-6 shadow-md" alt="Preview" />
            <div className="flex gap-3">
              <button
                className="flex-1 py-4 bg-gray-100 text-gray-500 font-black uppercase text-[10px] rounded-2xl active:scale-95 transition"
                onClick={() => { setPreviewImage(null); setSelectedFile(null); }}
              >
                Cancel
              </button>
              <button
                disabled={uploading}
                className="flex-1 py-4 bg-[#005d54] text-white font-black uppercase text-[10px] rounded-2xl shadow-lg active:scale-95 transition flex items-center justify-center gap-2"
                onClick={uploadNow}
              >
                {uploading ? <Loader2 className="animate-spin" size={14} /> : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMoneyQrTab;