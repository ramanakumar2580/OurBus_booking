"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Phone,
  CheckCircle,
  Users,
  ArrowUpDown,
  Bus,
  RotateCcw,
  Home,
  MapPin,
  User,
  Clock,
} from "lucide-react";
import { Booking, updateBoardingStatus } from "@/utils/storage";

const getRowFromSeat = (seatId: string) => {
  return parseInt(seatId.replace(/[A-Z]/g, ""));
};

interface AdminBooking extends Booking {
  minRow: number;
  maxRow: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [filteredDate, setFilteredDate] = useState("");

  const loadData = useCallback(() => {
    if (typeof window === "undefined") return;

    const allRawBookings: Booking[] = JSON.parse(
      localStorage.getItem("ourbus_bookings") || "[]",
    );

    const activeBookings = allRawBookings.filter(
      (b) => b.status === "BOOKED" && b.date === filteredDate,
    );

    const enhancedBookings = activeBookings.map((b) => {
      const rows = b.seats.map(getRowFromSeat);
      return {
        ...b,
        minRow: Math.min(...rows),
        maxRow: Math.max(...rows),
        boarded: b.boarded || false,
      };
    });

    enhancedBookings.sort((a, b) => b.minRow - a.minRow);

    setBookings(enhancedBookings);
  }, [filteredDate]);

  useEffect(() => {
    if (!filteredDate) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFilteredDate(new Date().toISOString().split("T")[0]);
    } else {
      loadData();
    }
  }, [filteredDate, loadData]);

  const toggleBoarding = (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    updateBoardingStatus(id, newStatus);
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, boarded: newStatus } : b)),
    );
  };

  const handleResetSystem = () => {
    if (confirm("DANGER: This will wipe all bookings and seats. Continue?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
          <div
            onClick={() => router.push("/")}
            className="cursor-pointer group flex flex-col items-center md:items-start"
          >
            <h1 className="text-3xl font-extrabold text-red-600 flex items-center gap-3 group-hover:opacity-80 transition">
              <Bus size={32} /> OurBus{" "}
              <span className="text-gray-800 dark:text-white">Operator</span>
            </h1>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
              Smart Conductor Dashboard
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-center bg-white dark:bg-gray-900 p-2 rounded-xl shadow-sm border dark:border-gray-800">
            <div className="flex flex-col justify-center px-2 border-r dark:border-gray-800">
              <label className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">
                Travel Date
              </label>
              <input
                type="date"
                className="outline-none font-bold text-gray-800 dark:text-white bg-transparent text-sm h-5 w-32 cursor-pointer dark:[color-scheme:dark]"
                value={filteredDate}
                onChange={(e) => setFilteredDate(e.target.value)}
              />
            </div>

            <button
              onClick={() => router.push("/")}
              className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
              title="Go Home"
            >
              <Home size={20} />
            </button>

            <button
              onClick={handleResetSystem}
              className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
              title="Reset System"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-start mb-2">
              <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Passengers
              </div>
              <Users size={16} className="text-blue-500" />
            </div>
            <div className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {bookings.reduce((acc, b) => acc + b.passengers.length, 0)}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-start mb-2">
              <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Bookings
              </div>
              <MapPin size={16} className="text-purple-500" />
            </div>
            <div className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {bookings.length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-start mb-2">
              <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Boarded
              </div>
              <CheckCircle size={16} className="text-green-500" />
            </div>
            <div className="text-3xl font-extrabold text-green-600 dark:text-green-400">
              {bookings.filter((b) => b.boarded).length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-start mb-2">
              <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Pending
              </div>
              <Clock size={16} className="text-orange-500" />
            </div>
            <div className="text-3xl font-extrabold text-orange-600 dark:text-orange-400">
              {bookings.filter((b) => !b.boarded).length}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              <ArrowUpDown
                size={18}
                className="text-blue-600 dark:text-blue-400"
              />
              Boarding Sequence
            </h2>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full border border-blue-100 dark:border-blue-900/50">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-xs font-mono font-bold uppercase">
                Algorithm: Back-to-Front (Row 15 → 1)
              </span>
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center justify-center">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
                <Users size={32} className="text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                No Passengers Found
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                There are no active bookings for {filteredDate}.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                    <th className="px-6 py-4 font-bold text-center w-16">
                      Seq
                    </th>
                    <th className="px-6 py-4 font-bold">Booking ID / Name</th>
                    <th className="px-6 py-4 font-bold">Seats</th>
                    <th className="px-6 py-4 font-bold w-40">Rows</th>
                    <th className="px-6 py-4 font-bold w-48">Contact</th>
                    <th className="px-6 py-4 font-bold text-center w-32">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {bookings.map((b, index) => (
                    <tr
                      key={b.id}
                      className={`group transition-colors duration-200 ${
                        b.boarded
                          ? "bg-green-50/50 dark:bg-green-900/10 hover:bg-green-100/50"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      }`}
                    >
                      <td className="px-6 py-4 align-top text-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mx-auto shadow-sm transition-transform group-hover:scale-110
                            ${
                              index === 0
                                ? "bg-green-500 text-white ring-4 ring-green-100 dark:ring-green-900"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                            }`}
                        >
                          {index + 1}
                        </div>
                      </td>

                      <td className="px-6 py-4 align-top">
                        <div className="space-y-3">
                          <div className="text-sm font-extrabold text-blue-600 dark:text-blue-400 tracking-wide font-mono">
                            {b.id}
                          </div>
                          <div className="space-y-2">
                            {b.passengers.map((p, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2"
                              >
                                <User size={14} className="text-gray-400" />
                                <span className="font-bold text-sm text-gray-900 dark:text-white">
                                  {p.name}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                                  {p.age}y
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 align-top">
                        <div className="flex flex-wrap gap-2">
                          {b.seats.map((seatId) => (
                            <span
                              key={seatId}
                              className="flex items-center justify-center w-10 h-8 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs font-mono font-bold text-gray-800 dark:text-gray-200"
                            >
                              {seatId}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-6 py-4 align-top">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                            {b.minRow === b.maxRow
                              ? `Row ${b.minRow}`
                              : `Rows ${b.minRow}-${b.maxRow}`}
                          </span>
                          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{
                                marginLeft: `${(b.minRow / 15) * 100}%`,
                                width: "15%",
                              }}
                            ></div>
                          </div>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500">
                            {15 - b.minRow} rows from back
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 align-top">
                        <a
                          href={`tel:${b.mobile}`}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition text-sm font-medium"
                        >
                          <Phone size={14} />
                          {b.mobile}
                        </a>
                      </td>

                      <td className="px-6 py-4 align-top text-center">
                        <button
                          onClick={() => toggleBoarding(b.id, !!b.boarded)}
                          className={`w-full py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm
                            ${
                              b.boarded
                                ? "bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                                : "bg-gray-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-gray-200"
                            }`}
                        >
                          {b.boarded ? (
                            <CheckCircle size={14} />
                          ) : (
                            <Users size={14} />
                          )}
                          {b.boarded ? "ONBOARD" : "BOARD"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
