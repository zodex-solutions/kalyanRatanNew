import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Pencil, Save, User2, Phone, Calendar, CheckCircle2 } from "lucide-react";
import { API_URL } from "../config";

const API_BASE = `${API_URL}/user`;

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const token = localStorage.getItem("accessToken");

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE}/profile2`, authHeader);
      setUser(res?.data);
      setUsername(res?.data?.username || "");
      setMobile(res?.data?.mobile || "");
    } catch (err) {
      console.log("Profile load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateProfile = async () => {
    setMsg("");
    if (!username.trim() || !mobile.trim()) {
      setMsg("All fields are required!");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("mobile", mobile);
      await axios.put(`${API_BASE}/profile`, formData, authHeader);
      setMsg("Profile Updated Successfully ✔");
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      setMsg("Update failed!");
    }
  };

  if (loading) {
    return (
      <div className="bg-[#f3f4f6] min-h-screen flex flex-col justify-center items-center">
        <div className="animate-spin h-10 w-10 border-4 border-[#005d54] border-t-transparent rounded-full mb-4"></div>
        <p className="text-[#005d54] font-bold uppercase text-sm tracking-widest">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans text-gray-800 pb-20">
      {/* THEME HEADER */}
      <div className="bg-[#005d54] max-w-md mx-auto text-white p-4 pb-16 rounded-b-[40px] shadow-lg sticky top-0 z-20">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button onClick={() => window.history.back()} className="p-2 bg-white/10 rounded-full active:scale-90 transition">
            <ArrowLeft size={22} />
          </button>
          <h2 className="text-lg font-black uppercase tracking-widest italic">My Profile</h2>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-12 relative z-30">
        {/* PROFILE AVATAR CARD */}
        <div className="bg-white rounded-[35px] shadow-xl p-8 flex flex-col items-center border border-gray-100">
          <div className="relative mb-6">
            <div className="w-28 h-28 bg-gradient-to-tr from-[#005d54] to-[#00897b] rounded-full flex items-center justify-center text-4xl font-black text-white shadow-2xl border-4 border-white">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <button 
              onClick={() => (editMode ? updateProfile() : setEditMode(true))}
              className="absolute bottom-0 right-0 bg-yellow-500 text-black p-2.5 rounded-full border-4 border-white shadow-lg active:scale-90 transition"
            >
              {editMode ? <Save size={18} /> : <Pencil size={18} />}
            </button>
          </div>

          {msg && (
            <div className="mb-4 bg-green-50 text-green-700 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 border border-green-100">
              <CheckCircle2 size={14} /> {msg}
            </div>
          )}

          {/* FORM FIELDS */}
          <div className="w-full space-y-5">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                <User2 size={12} className="text-teal-600" /> Full Name
              </label>
              {editMode ? (
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white border border-teal-200 p-2 rounded-lg text-sm font-bold outline-none focus:ring-2 ring-teal-500/20"
                />
              ) : (
                <p className="text-gray-800 font-black text-base">{user.username}</p>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                <Phone size={12} className="text-teal-600" /> Mobile Number
              </label>
              {editMode ? (
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full bg-white border border-teal-200 p-2 rounded-lg text-sm font-bold outline-none"
                />
              ) : (
                <p className="text-gray-800 font-black text-base">+91 {user.mobile}</p>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 opacity-80">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                <Calendar size={12} className="text-teal-600" /> Registration Date
              </label>
              <p className="text-gray-600 font-bold text-sm italic">
                {new Date(user.created_at?.$date ?? user.created_at).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {editMode && (
            <button 
              onClick={updateProfile}
              className="mt-8 w-full bg-[#005d54] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg shadow-teal-900/20 active:scale-95 transition"
            >
              Update Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
}