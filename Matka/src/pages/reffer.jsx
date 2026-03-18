// src/pages/ReferralPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Copy, Users, Gift, ArrowLeft, Check, Share2, Loader2, Sparkles } from "lucide-react";
import { API_URL } from "../config";

export default function ReferralPage() {
  const [user, setUser] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [reffAmount, setReffAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("accessToken");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    try {
      const [userRes, settingsRes, referralRes] = await Promise.all([
        axios.get(`${API_URL}/user/me`, { headers }),
        axios.get(`${API_URL}/settings/get`),
        axios.get(`${API_URL}/user/my-referrals`, { headers })
      ]);
      
      setUser(userRes.data);
      setReffAmount(settingsRes.data?.referral_bonus || 0);
      setReferrals(referralRes.data || []);
    } catch (err) {
      console.error("Error fetching referral data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex flex-col justify-center items-center">
        <Loader2 className="animate-spin text-[#005d54]" size={40} />
      </div>
    );

  const referralLink = `${window.location.origin}/signup?ref=${user?.referral_code}`;

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
              Refer & Earn
            </h2>
            <div className="w-10"></div>
          </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-6 relative z-30">
        {/* REWARD HIGHLIGHT CARD */}
        <div className="bg-white rounded-[2.5rem] p-6 mb-6 shadow-sm border border-gray-100 text-center relative overflow-hidden">
            <div className="relative z-10">
                <div className="bg-yellow-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 text-yellow-600 shadow-inner">
                    <Gift size={32} />
                </div>
                <h3 className="font-black text-gray-800 uppercase tracking-tight text-sm">Earn Cash Rewards</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 italic leading-relaxed">
                    Invite friends and get up to <span className="text-[#005d54] font-black italic">₹{reffAmount}</span> bonus on every signup
                </p>
            </div>
            <Sparkles className="absolute -right-4 -top-4 text-teal-50 w-24 h-24" />
        </div>

        {/* REFERRAL CODE SECTION */}
        <div className="bg-white rounded-[2rem] p-5 mb-4 shadow-sm border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Your Referral Code</p>
            <div className="flex items-center gap-3">
                <div className="flex-1 bg-teal-50/50 border-2 border-dashed border-teal-100 rounded-2xl py-3 px-4 flex items-center justify-center">
                    <span className="text-xl font-black text-[#005d54] tracking-[4px]">{user?.referral_code}</span>
                </div>
                <button 
                    onClick={() => copyToClipboard(user?.referral_code, 'code')}
                    className={`p-4 rounded-2xl transition-all shadow-md active:scale-90 ${copied ? 'bg-green-500 text-white' : 'bg-[#005d54] text-white'}`}
                >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
            </div>
        </div>

        {/* REFERRAL LINK SECTION */}
        <div className="bg-white rounded-[2rem] p-5 mb-6 shadow-sm border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Share Referral Link</p>
            <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 overflow-hidden">
                    <p className="text-[11px] font-bold text-gray-400 truncate tracking-tight uppercase italic">{referralLink}</p>
                </div>
                <button 
                    onClick={() => copyToClipboard(referralLink, 'link')}
                    className={`p-4 rounded-2xl transition-all shadow-md active:scale-90 ${copiedLink ? 'bg-green-500 text-white' : 'bg-white text-[#005d54] border border-gray-100'}`}
                >
                    {copiedLink ? <Check size={20} /> : <Share2 size={20} />}
                </button>
            </div>
        </div>

        {/* STEPS INFO */}
        <div className="bg-[#005d54]/5 rounded-[2.5rem] p-6 border border-[#005d54]/10">
            <h4 className="text-[10px] font-black text-[#005d54] uppercase tracking-[2px] mb-4 text-center">How it works?</h4>
            <div className="space-y-4">
                {[
                    { step: "01", text: "Copy your code or link" },
                    { step: "02", text: "Send it to your friends" },
                    { step: "03", text: "Get bonus on their signup" }
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <span className="text-xs font-black text-teal-200">{item.step}</span>
                        <p className="text-[11px] font-black text-gray-600 uppercase italic tracking-tight">{item.text}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* TOAST NOTIFICATION */}
        {(copied || copiedLink) && (
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-bounce">
                <div className="bg-gray-800 text-white px-6 py-3 rounded-2xl shadow-2xl border-2 border-white/20">
                    <p className="text-[10px] font-black uppercase tracking-widest italic">Copied to Clipboard!</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}