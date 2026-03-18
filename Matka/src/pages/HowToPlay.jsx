// src/pages/HowToPlay.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { ArrowLeft, PlayCircle, BookOpen, Loader2, Youtube } from "lucide-react";

export default function HowToPlay() {
  const [content, setContent] = useState("");
  const [videoId, setVideoId] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await axios.get(`${API_URL}/howtoplay/get`);
      setContent(res.data?.content || "");
      setVideoId(res.data?.video_id || "");
    } catch (err) {
      console.error("Error loading How To Play:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex flex-col justify-center items-center">
        <Loader2 className="animate-spin text-[#005d54]" size={40} />
        <p className="text-[#005d54] font-black uppercase text-[10px] tracking-widest mt-4 italic">Loading Tutorial...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans text-gray-800 pb-20">
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
            How To Play
          </h2>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-6 relative z-30">
        
        {/* VIDEO SECTION CARD */}
        <div className="bg-white rounded-[2.5rem] p-4 mb-6 shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-2 mb-3 px-2">
            <PlayCircle size={18} className="text-[#005d54]" />
            <span className="text-[10px] font-black uppercase tracking-[2px] text-gray-400">Video Tutorial</span>
          </div>

          {videoId ? (
            <div className="rounded-[1.5rem] overflow-hidden shadow-inner bg-black aspect-video relative group border border-gray-100">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0`}
                title="How to Play Video"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="bg-gray-50 rounded-[1.5rem] aspect-video flex flex-col items-center justify-center border-2 border-dashed border-gray-200">
              <Youtube size={40} className="text-gray-200 mb-2" />
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Video Coming Soon</p>
            </div>
          )}
        </div>

        {/* CONTENT SECTION CARD */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-5">
            <BookOpen size={18} className="text-[#005d54]" />
            <span className="text-[10px] font-black uppercase tracking-[2px] text-gray-400">Step-by-Step Guide</span>
          </div>

          {content ? (
            <div
              className="prose prose-sm max-w-none text-gray-600 
                prose-headings:text-[#005d54] prose-headings:font-black prose-headings:uppercase prose-headings:italic
                prose-p:text-xs prose-p:font-bold prose-p:leading-relaxed
                prose-strong:text-teal-600 prose-strong:font-black
                prose-li:text-xs prose-li:font-bold prose-li:marker:text-teal-400"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <div className="text-center py-10">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[2px] italic">Instructions are being updated...</p>
            </div>
          )}
        </div>

        {/* SECURITY FOOTER */}
        <div className="mt-8 text-center px-8 opacity-40">
            <p className="text-[8px] font-black text-gray-500 uppercase tracking-[3px] leading-relaxed">
                Rajan Matka - Trusted Gaming Experience <br/> Since 2026
            </p>
        </div>
      </div>
    </div>
  );
}