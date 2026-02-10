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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 font-sans p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div
            onClick={() => router.push("/")}
            className="cursor-pointer group flex flex-col items-center md:items-start"
          >
            <h1 className="text-3xl font-extrabold text-red-600 flex items-center gap-3 group-hover:opacity-80 transition">
              <Bus size={32} /> OurBus{" "}
              <span className="text-gray-800 dark:text-white">Operator</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Optimal Boarding Sequence Dashboard
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-center">
            <div className="bg-white dark:bg-gray-900 p-2 rounded-lg shadow-sm border dark:border-gray-800 flex flex-col h-[50px] justify-center w-full md:w-auto">
              <label className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">
                Filter Date
              </label>
              <input
                type="date"
                className="outline-none font-bold text-gray-700 dark:text-gray-200 bg-transparent text-sm h-5 w-full cursor-pointer"
                value={filteredDate}
                onChange={(e) => setFilteredDate(e.target.value)}
              />
            </div>

            <button
              onClick={() => router.push("/")}
              className="bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 h-[50px] w-[50px] flex items-center justify-center rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition shadow-sm shrink-0"
              title="Go to Booking Page"
            >
              <Home size={20} />
            </button>

            <button
              onClick={handleResetSystem}
              className="bg-white dark:bg-gray-900 text-red-500 dark:text-red-400 border border-red-200 dark:border-red-900 h-[50px] w-[50px] flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition shadow-sm shrink-0"
              title="Reset Database"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border-l-4 border-blue-500 dark:border-blue-600">
            <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">
              Total Passengers
            </div>
            <div className="text-3xl font-bold text-gray-800 dark:text-white">
              {bookings.reduce((acc, b) => acc + b.passengers.length, 0)}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border-l-4 border-purple-500 dark:border-purple-600">
            <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">
              Groups
            </div>
            <div className="text-3xl font-bold text-gray-800 dark:text-white">
              {bookings.length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border-l-4 border-green-500 dark:border-green-600">
            <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">
              Boarded
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {bookings.filter((b) => b.boarded).length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border-l-4 border-orange-500 dark:border-orange-600">
            <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">
              Pending
            </div>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {bookings.filter((b) => !b.boarded).length}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
          <div className="p-6 border-b bg-gray-50 dark:bg-gray-800/50 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              <ArrowUpDown
                size={20}
                className="text-blue-600 dark:text-blue-400"
              />
              Boarding Sequence
            </h2>
            <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800 font-bold text-center">
              ALGORITHM: BACK-TO-FRONT (Row 15 First)
            </span>
          </div>

          {bookings.length === 0 ? (
            <div className="p-16 text-center text-gray-400 dark:text-gray-500 flex flex-col items-center">
              <Users size={48} className="mb-4 opacity-20" />
              <p>No bookings found for {filteredDate}</p>
              <p className="text-sm mt-2">
                Try changing the date or make a booking first.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-4 w-20 text-center">Seq #</th>
                    <th className="p-4">Booking ID / Name</th>
                    <th className="p-4">Seats</th>
                    <th className="p-4">Rows</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {bookings.map((b, index) => (
                    <tr
                      key={b.id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition ${
                        b.boarded ? "bg-green-50/40 dark:bg-green-900/10" : ""
                      }`}
                    >
                      <td className="p-4 text-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mx-auto
                                            ${
                                              index === 0
                                                ? "bg-green-600 text-white shadow-lg scale-110"
                                                : "bg-gray-800 dark:bg-gray-700 text-white"
                                            }`}
                        >
                          {index + 1}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-mono font-bold text-gray-800 dark:text-gray-200">
                          {b.id}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {b.passengers[0]?.name}{" "}
                          {b.passengers.length > 1 &&
                            `+ ${b.passengers.length - 1} others`}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex gap-1 flex-wrap max-w-[150px]">
                          {b.seats.map((s) => (
                            <span
                              key={s}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-bold border dark:border-gray-700 text-gray-700 dark:text-gray-300"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {b.minRow === b.maxRow
                            ? `Row ${b.minRow}`
                            : `Rows ${b.minRow}-${b.maxRow}`}
                        </div>
                        <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 relative">
                          <div
                            className="absolute h-full bg-blue-500 rounded-full opacity-70"
                            style={{
                              left: `${(b.minRow / 15) * 100}%`,
                              width: "8px",
                            }}
                          ></div>
                        </div>
                        <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                          Front &rarr; Back
                        </div>
                      </td>
                      <td className="p-4">
                        <a
                          href={`tel:${b.mobile}`}
                          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm"
                        >
                          <Phone size={14} /> {b.mobile}
                        </a>
                      </td>

                      <td className="p-4 text-center">
                        <button
                          onClick={() => toggleBoarding(b.id, !!b.boarded)}
                          className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 mx-auto transition-all shadow-sm w-32 justify-center
                                                ${
                                                  b.boarded
                                                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 border border-green-200 dark:border-green-800"
                                                    : "bg-gray-800 dark:bg-gray-700 text-white hover:bg-black dark:hover:bg-gray-600 shadow-md"
                                                }`}
                        >
                          {b.boarded ? (
                            <CheckCircle size={14} />
                          ) : (
                            <Users size={14} />
                          )}
                          {b.boarded ? "Boarded" : "Board psgr"}
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
