"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bus,
  Calendar,
  ArrowRightLeft,
  Percent,
  Headset,
  UserCircle2,
  LogOut,
  History,
  Ticket,
  CreditCard,
  Sun,
  Repeat,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { getBookings, cancelBooking, Booking } from "@/utils/storage";
import { useUser } from "./context/UserContext";
import CityInput from "./components/CityInput";
import LoginModal from "./components/LoginModal";

const CITIES = [
  "Hyderabad",
  "Bangalore",
  "Chennai",
  "Vijayawada",
  "Delhi",
  "Thiruvananthapuram",
  "Warangal",
  "Vizag",
  "Mumbai",
  "Pune",
  "Kochi",
];

export default function Home() {
  const router = useRouter();
  const { user, login, logout } = useUser();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [date, setDate] = useState("");
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMyBookings(getBookings(user.phone));
    }
  }, [user, showHistory]);

  const handleSearch = () => {
    if (!fromCity || !toCity || !date) {
      alert("Please fill in From, To, and Date fields.");
      return;
    }
    if (!user) {
      setIsLoginOpen(true);
    } else {
      router.push(`/booking?from=${fromCity}&to=${toCity}&date=${date}`);
    }
  };

  const handleSwap = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const handleCancel = (bookingId: string) => {
    if (confirm("Are you sure you want to cancel this ticket?")) {
      cancelBooking(bookingId);
      if (user) setMyBookings(getBookings(user.phone));
    }
  };

  const handleLoginSubmit = (name: string, phone: string) => {
    login(name, phone);
    setIsLoginOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans flex flex-col transition-colors duration-300">
      <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 transition-all border-b dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <Bus className="text-red-600" size={28} />
            <span className="text-3xl font-extrabold text-red-600 tracking-tighter">
              Our<span className="text-gray-800 dark:text-white">Bus</span>
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
            <div className="hidden md:flex items-center gap-2 hover:text-red-600 dark:hover:text-red-400 cursor-pointer transition-colors">
              <Percent size={16} /> Offers
            </div>
            <div className="hidden md:flex items-center gap-2 hover:text-red-600 dark:hover:text-red-400 cursor-pointer transition-colors">
              <Headset size={16} /> Help
            </div>

            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-800 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700">
                  <UserCircle2 size={20} className="text-red-600" />
                  <span className="font-bold">Hi, {user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2 rounded-full hover:bg-black dark:hover:bg-gray-200 transition shadow-lg"
              >
                <UserCircle2 size={18} /> Login
              </button>
            )}
          </div>
        </div>
      </nav>

      <div
        className="relative min-h-[600px] w-full bg-cover bg-center transition-all duration-500"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1570125909232-eb2bee3b463c?q=80&w=2070&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/20 dark:from-black/80 dark:via-black/60 dark:to-gray-950"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center items-center pt-20 pb-20">
          <div
            className={`text-center mb-8 transition-all duration-500 ${
              showHistory ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
            }`}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-3 drop-shadow-lg tracking-tight">
              Travel Smart. <span className="text-red-500">Travel Safe.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 font-medium max-w-2xl mx-auto">
              India&apos;s most trusted booking platform. Over 50,000+ routes
              waiting for you.
            </p>
          </div>

          {user && (
            <div className="w-full max-w-5xl mb-6 flex justify-end">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`${
                  showHistory
                    ? "bg-red-600 text-white"
                    : "bg-white/20 text-white hover:bg-white/30"
                } backdrop-blur-md px-5 py-2.5 rounded-full font-bold flex items-center gap-2 border border-white/30 transition-all shadow-lg active:scale-95`}
              >
                {showHistory ? <XCircle size={18} /> : <History size={18} />}
                {showHistory ? "Close History" : "My Bookings"}
              </button>
            </div>
          )}

          {showHistory && user && (
            <div className="w-full max-w-3xl mx-auto mb-8 animate-[fadeIn_0.3s_ease-out]">
              <div className="bg-white/90 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 dark:border-gray-700 overflow-hidden ring-1 ring-black/5">
                <div className="bg-white/50 dark:bg-gray-800/50 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 backdrop-blur-md z-10">
                  <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 text-lg">
                    <span className="bg-red-100 dark:bg-red-900/30 p-1.5 rounded-lg">
                      <Ticket
                        className="text-red-600 dark:text-red-400"
                        size={20}
                      />
                    </span>
                    My Trips
                  </h3>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                    {myBookings.length} Total
                  </span>
                </div>

                <div className="max-h-[400px] overflow-y-auto p-4 space-y-4 custom-scrollbar">
                  {myBookings.length === 0 ? (
                    <div className="text-center py-16 flex flex-col items-center">
                      <div className="bg-gray-100 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                        <Bus
                          className="text-gray-400 dark:text-gray-500"
                          size={40}
                        />
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 font-bold text-lg">
                        No bookings yet.
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                        Your next adventure is just a click away!
                      </p>
                    </div>
                  ) : (
                    myBookings.map((b) => (
                      <div
                        key={b.id}
                        className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row shadow-sm"
                      >
                        <div
                          className={`w-1.5 md:w-2 h-full absolute left-0 top-0 bottom-0 ${
                            b.status === "CANCELLED"
                              ? "bg-gray-400 dark:bg-gray-600"
                              : "bg-green-500"
                          }`}
                        ></div>
                        <div className="flex-1 p-5 pl-7 flex flex-col justify-center">
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wide">
                            <Calendar size={12} /> {b.date}
                            <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                            <span>ID: {b.id}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-white mb-2">
                            {b.from}{" "}
                            <ArrowRight
                              size={18}
                              className="text-gray-300 dark:text-gray-600"
                            />{" "}
                            {b.to}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded text-xs font-bold border border-blue-100 dark:border-blue-800">
                              {b.seats.length} Seats
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                              {b.seats.join(", ")}
                            </span>
                          </div>
                        </div>
                        <div className="border-t md:border-t-0 md:border-l border-dashed border-gray-200 dark:border-gray-700 p-5 flex flex-row md:flex-col justify-between items-center md:items-end gap-3 bg-gray-50/50 dark:bg-gray-900/50 min-w-[150px]">
                          <div className="text-2xl font-extrabold text-gray-900 dark:text-white">
                            ₹{b.totalAmount}
                          </div>
                          {b.status === "BOOKED" ? (
                            <button
                              onClick={() => handleCancel(b.id)}
                              className="text-xs font-bold text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-600 dark:hover:bg-red-500 hover:text-white dark:hover:text-white px-4 py-2 rounded-lg border border-red-200 dark:border-red-900 transition-all shadow-sm w-full md:w-auto"
                            >
                              Cancel Ticket
                            </button>
                          ) : (
                            <span className="text-[10px] font-extrabold bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-inner">
                              Cancelled
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {!showHistory && (
            <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-[2rem] shadow-2xl w-full max-w-5xl backdrop-blur-md bg-white/95 dark:bg-gray-900/95 animate-[zoomIn_0.5s_ease-out] border dark:border-gray-800">
              <div className="flex gap-8 border-b dark:border-gray-800 pb-4 mb-6">
                <div className="flex items-center gap-2 text-red-600 font-bold border-b-4 border-red-600 pb-1 text-lg px-2 cursor-pointer">
                  <Bus size={24} /> Buses
                </div>
                <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 font-medium pb-1 text-lg px-2 cursor-not-allowed">
                  Trains
                </div>
                <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 font-medium pb-1 text-lg px-2 cursor-not-allowed">
                  Flights
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-center relative z-20">
                <CityInput
                  label="Leaving From"
                  value={fromCity}
                  onChange={setFromCity}
                  cities={CITIES}
                />

                <div
                  onClick={handleSwap}
                  className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full border dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition cursor-pointer active:rotate-180 duration-300 z-10 text-gray-600 dark:text-gray-400"
                >
                  <ArrowRightLeft size={20} />
                </div>

                <CityInput
                  label="Going To"
                  value={toCity}
                  onChange={setToCity}
                  cities={CITIES}
                />

                <div className="flex-1 relative w-full group">
                  <Calendar
                    size={20}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                      date ? "text-red-500" : "text-gray-400 dark:text-gray-500"
                    }`}
                  />
                  <input
                    type="date"
                    className="w-full p-4 pl-12 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 dark:focus:ring-red-500/20 font-medium text-lg text-gray-600 dark:text-gray-200 transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 dark:[color-scheme:dark]"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <button
                  onClick={handleSearch}
                  className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-bold text-xl px-12 py-4 rounded-xl shadow-xl shadow-red-200 dark:shadow-red-900/20 transition-transform active:scale-95"
                >
                  Search
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 flex-grow w-full">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-red-600 rounded-full"></div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Exclusive Offers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-6 rounded-2xl border border-red-100 dark:border-red-900/50 flex flex-col justify-between hover:shadow-lg transition duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm group-hover:scale-110 transition">
                <Ticket className="text-red-500" size={24} />
              </div>
              <span className="text-xs font-bold bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300 px-2 py-1 rounded">
                NEW USER
              </span>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                50% Off
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                On your first booking
              </p>
              <div className="bg-white dark:bg-gray-800 border-dashed border-2 border-red-300 dark:border-red-700 px-3 py-1.5 rounded-lg font-mono font-bold text-gray-700 dark:text-gray-300 inline-block text-sm">
                FIRSTBUS
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/50 flex flex-col justify-between hover:shadow-lg transition duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm group-hover:scale-110 transition">
                <CreditCard className="text-blue-500" size={24} />
              </div>
              <span className="text-xs font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 px-2 py-1 rounded">
                HDFC BANK
              </span>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                Flat ₹200 Off
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                Using Credit Cards
              </p>
              <div className="bg-white dark:bg-gray-800 border-dashed border-2 border-blue-300 dark:border-blue-700 px-3 py-1.5 rounded-lg font-mono font-bold text-gray-700 dark:text-gray-300 inline-block text-sm">
                HDFC200
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 p-6 rounded-2xl border border-yellow-100 dark:border-yellow-900/50 flex flex-col justify-between hover:shadow-lg transition duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm group-hover:scale-110 transition">
                <Sun className="text-amber-500" size={24} />
              </div>
              <span className="text-xs font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300 px-2 py-1 rounded">
                SUMMER
              </span>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                Save up to ₹300
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                On AC Sleeper Buses
              </p>
              <div className="bg-white dark:bg-gray-800 border-dashed border-2 border-amber-300 dark:border-amber-700 px-3 py-1.5 rounded-lg font-mono font-bold text-gray-700 dark:text-gray-300 inline-block text-sm">
                SUMMER300
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-2xl border border-green-100 dark:border-green-900/50 flex flex-col justify-between hover:shadow-lg transition duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm group-hover:scale-110 transition">
                <Repeat className="text-green-500" size={24} />
              </div>
              <span className="text-xs font-bold bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300 px-2 py-1 rounded">
                RETURN TRIP
              </span>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                10% Cashback
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                On booking return tickets
              </p>
              <div className="bg-white dark:bg-gray-800 border-dashed border-2 border-green-300 dark:border-green-700 px-3 py-1.5 rounded-lg font-mono font-bold text-gray-700 dark:text-gray-300 inline-block text-sm">
                RETURN10
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 dark:bg-black text-white py-8 mt-auto border-t dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-400">
            &copy; 2026 OurBus Inc. All rights reserved.
          </div>

          <div className="flex gap-6 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-white transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition">
              Terms of Service
            </a>
            <a
              href="/admin"
              className="text-red-400 hover:text-red-300 transition flex items-center gap-1"
            >
              Operator Login &rarr;
            </a>
          </div>
        </div>
      </footer>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLoginSubmit}
      />
    </div>
  );
}
