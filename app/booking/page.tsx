"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Bus,
  UserCircle2,
  LogOut,
  Ticket,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ArrowRightLeft,
  X,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { getBookings, cancelBooking, Booking } from "@/utils/storage";
import { useUser } from "../context/UserContext";
import SeatMap from "../components/SeatMap";

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

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout } = useUser();

  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);

  const from = searchParams.get("from") || CITIES[0];
  const to = searchParams.get("to") || CITIES[1];
  const date =
    searchParams.get("date") || new Date().toISOString().split("T")[0];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsPageLoaded(true);
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  useEffect(() => {
    if (user && showHistory) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMyBookings(getBookings(user.phone));
    }
  }, [user, showHistory]);

  const handleCancel = (bookingId: string) => {
    if (confirm("Are you sure you want to cancel this ticket?")) {
      cancelBooking(bookingId);
      if (user) setMyBookings(getBookings(user.phone));
    }
  };

  const updateRoute = (newFrom: string, newTo: string, newDate: string) => {
    router.push(`/booking?from=${newFrom}&to=${newTo}&date=${newDate}`);
  };

  const changeDate = (days: number) => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() + days);
    updateRoute(from, to, currentDate.toISOString().split("T")[0]);
  };

  const handleSwap = () => {
    updateRoute(to, from, date);
  };

  const handleCityChange = (type: "from" | "to", value: string) => {
    if (type === "from") updateRoute(value, to, date);
    else updateRoute(from, value, date);
  };

  if (!isPageLoaded || !user) return null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 font-sans transition-colors duration-300">
      <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 border-b dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-auto md:h-16 flex flex-col md:flex-row justify-between items-center py-3 md:py-0 gap-3 md:gap-4">
          <div className="flex items-center justify-between w-full md:w-auto">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => router.push("/")}
            >
              <Bus className="text-red-600" size={28} />
              <span className="text-2xl font-extrabold text-red-600 tracking-tighter">
                Our<span className="text-gray-800 dark:text-white">Bus</span>
              </span>
            </div>
            <div className="flex md:hidden items-center gap-3">
              <button
                onClick={() => setShowHistory(true)}
                className="text-gray-500 dark:text-gray-400"
              >
                <Ticket size={22} />
              </button>
              <button
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="text-gray-400 hover:text-red-500"
              >
                <LogOut size={22} />
              </button>
            </div>
          </div>
          <div className="w-full md:flex-1 md:max-w-2xl bg-gray-50 dark:bg-gray-800 px-2 md:px-4 py-2 rounded-xl md:rounded-full border border-gray-200 dark:border-gray-700 shadow-inner flex items-center justify-between gap-1">
            <div className="relative group flex-1 min-w-0">
              <select
                value={from}
                onChange={(e) => handleCityChange("from", e.target.value)}
                className="w-full appearance-none bg-transparent font-bold text-gray-700 dark:text-gray-200 text-sm md:text-base py-1 cursor-pointer outline-none md:text-right truncate hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c} className="text-black">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSwap}
              className="p-1.5 hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm rounded-full text-gray-400 transition mx-1 shrink-0"
            >
              <ArrowRightLeft size={14} />
            </button>

            <div className="relative group mr-2 flex-1 min-w-0">
              <select
                value={to}
                onChange={(e) => handleCityChange("to", e.target.value)}
                className="w-full appearance-none bg-transparent font-bold text-gray-700 dark:text-gray-200 text-sm md:text-base py-1 cursor-pointer outline-none truncate hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c} className="text-black">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <span className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 hidden sm:block"></span>

            <div className="flex items-center gap-1 select-none shrink-0">
              <button
                onClick={() => changeDate(-1)}
                className="p-1 hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm rounded-full transition text-gray-500 dark:text-gray-400"
              >
                <ChevronLeft size={16} />
              </button>
              <input
                type="date"
                value={date}
                onChange={(e) => updateRoute(from, to, e.target.value)}
                className="bg-transparent text-sm font-medium text-gray-600 dark:text-gray-300 w-24 outline-none cursor-pointer hover:text-red-600 dark:hover:text-red-400 transition-colors"
              />
              <button
                onClick={() => changeDate(1)}
                className="p-1 hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm rounded-full transition text-gray-500 dark:text-gray-400"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3 min-w-fit">
            <button
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 font-medium text-sm transition-colors"
            >
              <Ticket size={18} />
              <span>My Bookings</span>
            </button>

            <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
              <UserCircle2 size={20} className="text-red-600" />
              <span className="font-bold text-sm">{user.name}</span>
              <div title="Verified Guest">
                <CheckCircle2
                  size={16}
                  className="text-green-500 fill-green-100"
                />
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="text-gray-400 hover:text-red-500"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <SeatMap from={from} to={to} date={date} mobile={user.phone} />
      </div>
      {showHistory && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col border dark:border-gray-800">
            <div className="flex justify-between items-center p-6 border-b dark:border-gray-800">
              <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                <Ticket className="text-red-600" /> My Bookings
              </h2>
              <button
                onClick={() => setShowHistory(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              {myBookings.length === 0 ? (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                  No bookings found.
                </div>
              ) : (
                <div className="space-y-4">
                  {myBookings.map((b) => (
                    <div
                      key={b.id}
                      className="border dark:border-gray-800 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition bg-gray-50 dark:bg-gray-800/50"
                    >
                      <div className="flex-1 w-full">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-1 uppercase">
                          <Calendar size={12} /> {b.date} • ID: {b.id}
                        </div>
                        <div className="flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-white">
                          {b.from}{" "}
                          <ArrowRight
                            size={16}
                            className="text-gray-300 dark:text-gray-600"
                          />{" "}
                          {b.to}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {b.seats.length} Seats:{" "}
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            {b.seats.join(", ")}
                          </span>
                        </div>
                      </div>

                      <div className="text-right w-full md:w-auto min-w-[100px] flex flex-row md:flex-col justify-between items-center md:items-end">
                        <div className="text-xl font-bold text-gray-900 dark:text-white mb-0 md:mb-1">
                          ₹{b.totalAmount}
                        </div>
                        {b.status === "BOOKED" ? (
                          <button
                            onClick={() => handleCancel(b.id)}
                            className="text-xs font-bold text-red-600 border border-red-200 dark:border-red-900 px-3 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                          >
                            Cancel
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            Cancelled
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 text-red-600 font-bold">
          Loading...
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
