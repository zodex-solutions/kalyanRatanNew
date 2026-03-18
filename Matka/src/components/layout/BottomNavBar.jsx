import React from "react";
import {
  Home,
  User,
  History,
  Wallet,
  BookOpen,
} from "lucide-react";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { useLocation } from "react-router-dom"; // अगर आप routing इस्तेमाल कर रहे हैं

export default function BottomNavBar() {
  // एक्टिव लिंक को हाईलाइट करने के लिए (Optional)
  const location = useLocation();
  const isActive = (path) => window.location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-center items-center z-50">
      <div className="relative w-full max-w-md bg-white shadow-[0_-5px_20px_rgba(0,0,0,0.1)] flex justify-between items-center px-2 py-2 rounded-t-[20px]">
        
        {/* LEFT ICONS */}
        <div className="flex w-[40%] justify-around items-center">
          <a href="/bid-history" className="flex flex-col items-center group">
            <History 
              size={22} 
              className={`${isActive('/bid-history') ? 'text-[#007b70]' : 'text-gray-400'} group-hover:text-[#007b70] transition-colors`} 
            />
            <span className={`text-[10px] font-bold mt-1 ${isActive('/bid-history') ? 'text-[#007b70]' : 'text-gray-400'}`}>
              My Bids
            </span>
          </a>

          <a href="/passbook" className="flex flex-col items-center group">
            <BookOpen 
              size={22} 
              className={`${isActive('/passbook') ? 'text-[#007b70]' : 'text-gray-400'} group-hover:text-[#007b70] transition-colors`} 
            />
            <span className={`text-[10px] font-bold mt-1 ${isActive('/passbook') ? 'text-[#007b70]' : 'text-gray-400'}`}>
              Passbook
            </span>
          </a>
        </div>

        {/* CENTER FLOATING HOME BUTTON GAP */}
        <div className="w-[20%] flex justify-center">
           {/* Space for the floating button */}
        </div>

        {/* RIGHT ICONS */}
        <div className="flex w-[40%] justify-around items-center">
          <a href="/withdrawal-request" className="flex flex-col items-center group">
            <MdOutlineCurrencyRupee 
              size={22} 
              className={`${isActive('/withdrawal-request') ? 'text-[#007b70]' : 'text-gray-400'} group-hover:text-[#007b70] transition-colors`} 
            />
            <span className={`text-[10px] font-bold mt-1 ${isActive('/withdrawal-request') ? 'text-[#007b70]' : 'text-gray-400'}`}>
              Withdraw
            </span>
          </a>
          <a href="/profile" className="flex flex-col items-center group">
            <User 
              size={22} 
              className={`${isActive('/profile') ? 'text-[#007b70]' : 'text-gray-400'} group-hover:text-[#007b70] transition-colors`} 
            />
            <span className={`text-[10px] font-bold mt-1 ${isActive('/profile') ? 'text-[#007b70]' : 'text-gray-400'}`}>
              Profile
            </span>
          </a>
        </div>

        {/* FLOATING HOME BUTTON - Styled like Screenshot */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <a href="/" className="relative">
            {/* White outer circle for cut-out effect */}
            <div className="absolute -inset-2 bg-[#f3f4f6] rounded-full"></div>
            
            {/* The Actual Button */}
            <div className="relative bg-[#007b70] p-4 rounded-full shadow-lg border-4 border-white active:scale-90 transition-transform flex items-center justify-center">
              <Home size={26} className="text-white fill-white/20" />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}