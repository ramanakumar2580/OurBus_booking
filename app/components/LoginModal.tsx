"use client";

import React, { useState } from "react";
import { X, User, Smartphone } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (name: string, phone: string) => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  onLogin,
}: LoginModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (name && phone) {
      onLogin(name, phone);
      onClose();
    } else {
      alert("Please enter both Name and Phone Number");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 border dark:border-gray-800">
        <div className="bg-red-600 p-4 flex justify-between items-center">
          <h3 className="text-white font-bold text-lg">Guest Login</h3>
          <button
            onClick={onClose}
            className="text-white hover:bg-red-700 rounded-full p-1 transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center">
            <div className="inline-block p-3 bg-red-50 dark:bg-red-900/20 rounded-full mb-3">
              <User size={32} className="text-red-600 dark:text-red-500" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Log in to manage your bookings easily.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-1">
                Full Name
              </label>
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800 focus-within:ring-2 ring-red-200 dark:ring-red-900 transition">
                <User
                  size={18}
                  className="text-gray-400 dark:text-gray-500 mr-3"
                />
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full bg-transparent outline-none text-gray-900 dark:text-white font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-1">
                Mobile Number
              </label>
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800 focus-within:ring-2 ring-red-200 dark:ring-red-900 transition">
                <Smartphone
                  size={18}
                  className="text-gray-400 dark:text-gray-500 mr-3"
                />
                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  className="w-full bg-transparent outline-none text-gray-900 dark:text-white font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-transform active:scale-95"
          >
            Login as Guest
          </button>
        </div>
      </div>
    </div>
  );
}
