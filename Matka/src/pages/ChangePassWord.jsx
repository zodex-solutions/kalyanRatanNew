// src/pages/UpdatePasswordPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { Lock, Save, Eye, EyeOff, ArrowLeft, ShieldCheck, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

const API_BASE = `${API_URL}/user`;

export default function UpdatePasswordPage() {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("accessToken");

  const handleSubmit = async () => {
    setMsg("");
    if (!oldPass || !newPass) {
      setMsg("Please fill all fields!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("old_password", oldPass);
      formData.append("new_password", newPass);

      await axios.post(`${API_BASE}/update-password`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMsg("Password Updated Successfully ✔");
      setOldPass("");
      setNewPass("");
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Failed to update password!";
      setMsg(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans text-gray-800 pb-24">
      {/* NEW STANDARD THEME HEADER */}
      <div className="bg-[#005d54] max-w-md mx-auto text-white p-4 pb-12 rounded-b-[35px] shadow-lg sticky top-0 z-20">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className="p-2 bg-white/10 rounded-full active:scale-90 transition"
          >
            <ArrowLeft size={22} />
          </button>
          <h2 className="text-lg font-black uppercase tracking-widest italic text-center flex-1">
            Security
          </h2>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-6 relative z-30">
        {/* ICON & TITLE CARD */}
        <div className="bg-white rounded-[2.5rem] p-6 mb-6 shadow-sm border border-gray-100 text-center">
          <div className="bg-teal-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 text-[#005d54]">
            <ShieldCheck size={32} />
          </div>
          <h3 className="font-black text-gray-800 uppercase tracking-tight text-sm">Update Password</h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 italic">Keep your account secure</p>
        </div>

        {/* FORM CARD */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100">
          {msg && (
            <div className={`flex items-center gap-2 p-3 rounded-2xl mb-4 text-[10px] font-black uppercase tracking-wider italic ${
              msg.includes("✔") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
            }`}>
              {msg.includes("✔") ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {msg}
            </div>
          )}

          {/* OLD PASSWORD */}
          <div className="mb-4 relative">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-1 block">Current Password</label>
            <div className="relative">
              <input
                type={showOld ? "text" : "password"}
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-100 p-4 pr-12 rounded-2xl text-sm font-bold focus:outline-none focus:border-teal-200 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 active:text-teal-600"
              >
                {showOld ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* NEW PASSWORD */}
          <div className="mb-8 relative">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-1 block">New Password</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-100 p-4 pr-12 rounded-2xl text-sm font-bold focus:outline-none focus:border-teal-200 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 active:text-teal-600"
              >
                {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#005d54] text-white py-4 rounded-2xl font-black uppercase tracking-[2px] italic shadow-lg shadow-teal-900/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Save size={18} />
                Update Now
              </>
            )}
          </button>
        </div>

        {/* SECURITY FOOTER */}
        <p className="mt-8 text-center text-[9px] font-bold text-gray-400 uppercase tracking-[3px] leading-relaxed">
          Logged in sessions will remain <br/> active after password change.
        </p>
      </div>
    </div>
  );
}