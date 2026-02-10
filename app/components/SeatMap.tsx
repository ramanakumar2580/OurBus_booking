"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Armchair, User, CheckCircle2, Tag, Users } from "lucide-react";
import { MAX_SEATS_PER_USER } from "@/utils/busConfig";
import {
  getSeats,
  bookSeats,
  getBookings,
  SeatData,
  Passenger,
  Booking,
} from "@/utils/storage";

interface SeatMapProps {
  from: string;
  to: string;
  date: string;
  mobile: string;
}

const TICKET_PRICE = 2000;

export default function SeatMap({ from, to, date, mobile }: SeatMapProps) {
  const [seats, setSeats] = useState<SeatData[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showPassengerForm, setShowPassengerForm] = useState(false);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<Booking | null>(null);

  const loadSeats = useCallback(() => {
    const data = getSeats(date, from, to);
    setSeats(data);
    setLoading(false);
  }, [date, from, to]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSeats();
  }, [loadSeats]);

  const handleSeatClick = (seat: SeatData) => {
    if (seat.status === "booked") return;

    if (selectedIds.includes(seat.id)) {
      setSelectedIds(selectedIds.filter((id) => id !== seat.id));
      setPassengers(passengers.filter((p) => p.seatId !== seat.id));
    } else {
      if (selectedIds.length >= MAX_SEATS_PER_USER) {
        setMessage(`Max ${MAX_SEATS_PER_USER} seats allowed.`);
        return;
      }
      setSelectedIds([...selectedIds, seat.id]);
      setPassengers([...passengers, { seatId: seat.id, name: "", age: "" }]);
    }
  };

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "FIRSTBUS") {
      const history = getBookings(mobile);
      const activeBookings = history.filter((b) => b.status === "BOOKED");

      if (activeBookings.length === 0) {
        setDiscount(selectedIds.length * TICKET_PRICE * 0.5);
        setCouponMessage("Success! 50% Off applied.");
      } else {
        setDiscount(0);
        setCouponMessage("Coupon only valid for first booking.");
      }
    } else {
      setDiscount(0);
      setCouponMessage("Invalid Coupon Code");
    }
  };

  const initiateBooking = () => {
    if (selectedIds.length === 0) {
      setMessage("Please select at least one seat.");
      return;
    }
    setShowPassengerForm(true);
  };

  const handlePassengerChange = (
    index: number,
    field: keyof Passenger,
    value: string,
  ) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const confirmBooking = () => {
    for (const p of passengers) {
      if (!p.name || !p.age) {
        alert(`Please enter details for Seat ${p.seatId}`);
        return;
      }
    }

    setLoading(true);

    const newBooking = {
      id: "BID-" + Math.floor(100000 + Math.random() * 900000),
      mobile,
      date,
      from,
      to,
      seats: selectedIds,
      passengers: passengers,
      totalAmount: selectedIds.length * TICKET_PRICE - discount,
      timestamp: Date.now(),
      status: "BOOKED" as const,
      boarded: false,
    };

    const success = bookSeats(newBooking);

    if (success) {
      setBookingDetails(newBooking);
      setShowPopup(true);
      setShowPassengerForm(false);
      loadSeats();
      setSelectedIds([]);
      setPassengers([]);
    } else {
      setMessage("Booking Failed.");
    }
    setLoading(false);
  };

  const baseTotal = selectedIds.length * TICKET_PRICE;
  const finalTotal = baseTotal - discount;

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start justify-center relative">
      <div className="flex-1 w-full max-w-md mx-auto">
        <div className="bg-gray-100 dark:bg-gray-900 rounded-3xl md:rounded-[3rem] p-4 md:p-6 shadow-2xl border-2 border-gray-200 dark:border-gray-700 relative overflow-hidden transition-colors duration-300">
          <div
            className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(currentColor 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          ></div>
          <div className="mb-8 border-b-2 border-dashed border-gray-300 dark:border-gray-700 pb-4 flex justify-end px-2 md:px-6 relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-blue-50/50 dark:bg-blue-900/20 rounded-b-full blur-md"></div>
            <div className="flex flex-col items-center opacity-60">
              <div className="p-2 border-2 border-gray-400 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 shadow-sm">
                <User size={24} className="text-gray-600 dark:text-gray-400" />
              </div>
              <span className="text-[10px] font-bold mt-1 text-gray-500 dark:text-gray-400 tracking-wider">
                DRIVER
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 relative z-10 px-1 md:px-2">
            {Array.from(new Set(seats.map((s) => s.row))).map((rowNum) => {
              const rowSeats = seats.filter((s) => s.row === rowNum);
              return (
                <div
                  key={rowNum}
                  className="flex justify-between items-center group"
                >
                  <div className="flex gap-2 md:gap-3">
                    {rowSeats.slice(0, 2).map((seat) => (
                      <SeatItem
                        key={seat.id}
                        seat={seat}
                        isSelected={selectedIds.includes(seat.id)}
                        onClick={() => handleSeatClick(seat)}
                      />
                    ))}
                  </div>
                  <div className="w-6 md:w-8 text-center text-xs font-bold text-gray-300 dark:text-gray-600 font-mono select-none group-hover:text-red-300 dark:group-hover:text-red-700 transition-colors">
                    {rowNum}
                  </div>
                  <div className="flex gap-2 md:gap-3">
                    {rowSeats.slice(2, 4).map((seat) => (
                      <SeatItem
                        key={seat.id}
                        seat={seat}
                        isSelected={selectedIds.includes(seat.id)}
                        onClick={() => handleSeatClick(seat)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-96 bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 sticky top-24 transition-colors duration-300">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white border-b dark:border-gray-800 pb-2">
          Trip Summary
        </h2>
        <div className="space-y-4 mb-6">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Route</span>
            <span className="font-bold text-gray-800 dark:text-gray-200 capitalize">
              {from} → {to}
            </span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Date</span>
            <span className="font-bold text-gray-800 dark:text-gray-200">
              {date}
            </span>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30 mb-6">
          <label className="text-xs font-bold text-red-500 dark:text-red-400 uppercase mb-2 flex items-center gap-1">
            <Tag size={12} /> Coupon
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Code"
              className="w-full p-2 text-sm border border-gray-200 dark:border-gray-700 rounded outline-none uppercase bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <button
              onClick={applyCoupon}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-bold transition-colors"
            >
              Apply
            </button>
          </div>
          {couponMessage && (
            <div
              className={`text-xs mt-2 font-bold ${
                couponMessage.includes("Success")
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-500 dark:text-red-400"
              }`}
            >
              {couponMessage}
            </div>
          )}
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            New user? Try <b>FIRSTBUS</b>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Price</span>
            <span>
              ₹{TICKET_PRICE} x {selectedIds.length}
            </span>
          </div>
          <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
            <span>Discount</span>
            <span>- ₹{discount}</span>
          </div>
          <div className="flex justify-between text-xl font-extrabold text-gray-900 dark:text-white border-t dark:border-gray-700 pt-2">
            <span>Total</span>
            <span>₹{finalTotal}</span>
          </div>
        </div>

        {message && (
          <div className="text-red-500 dark:text-red-400 text-sm mb-4 text-center">
            {message}
          </div>
        )}

        <button
          onClick={initiateBooking}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95 disabled:bg-gray-300 dark:disabled:bg-gray-700"
        >
          {loading ? "Processing..." : "Proceed to Book"}
        </button>
      </div>

      {showPassengerForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in border dark:border-gray-800">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <Users className="text-red-600" /> Passenger Details
            </h3>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {passengers.map((p, idx) => (
                <div
                  key={p.seatId}
                  className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700"
                >
                  <div className="font-bold text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Seat {p.seatId}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded text-sm outline-none focus:border-red-500 dark:focus:border-red-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        value={p.name}
                        onChange={(e) =>
                          handlePassengerChange(idx, "name", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Age"
                        className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded text-sm outline-none focus:border-red-500 dark:focus:border-red-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        value={p.age}
                        onChange={(e) =>
                          handlePassengerChange(idx, "age", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => setShowPassengerForm(false)}
                className="flex-1 py-3 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                Back
              </button>
              <button
                onClick={confirmBooking}
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors"
              >
                Confirm & Pay
              </button>
            </div>
          </div>
        </div>
      )}

      {showPopup && bookingDetails && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in border dark:border-gray-800">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
                <CheckCircle2
                  size={48}
                  className="text-green-600 dark:text-green-400"
                />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">
              Booking Confirmed!
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3 text-sm border border-gray-100 dark:border-gray-700 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  Booking ID
                </span>
                <span className="font-mono font-bold text-gray-800 dark:text-gray-200">
                  {bookingDetails.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Route</span>
                <span className="font-bold text-gray-800 dark:text-gray-200 capitalize">
                  {bookingDetails.from} - {bookingDetails.to}
                </span>
              </div>
              <div className="flex justify-between border-t dark:border-gray-700 pt-2">
                <span className="font-bold text-gray-900 dark:text-white">
                  Paid Amount
                </span>
                <span className="font-bold text-green-600 dark:text-green-400">
                  ₹{bookingDetails.totalAmount}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowPopup(false)}
              className="w-full bg-gray-900 dark:bg-black text-white py-3.5 rounded-xl font-bold hover:bg-black dark:hover:bg-gray-800 transition border dark:border-gray-800"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SeatItem({
  seat,
  isSelected,
  onClick,
}: {
  seat: SeatData;
  isSelected: boolean;
  onClick: () => void;
}) {
  const isBooked = seat.status === "booked";
  let containerClass =
    "w-10 h-10 rounded-lg flex items-center justify-center border transition-all duration-200 relative cursor-pointer shadow-sm ";
  let iconClass = "w-6 h-6 transition-all duration-200 ";

  if (isBooked) {
    containerClass +=
      "bg-gray-300 dark:bg-gray-700 border-gray-400 dark:border-gray-600 cursor-not-allowed";
    iconClass += "text-gray-500 dark:text-gray-500";
  } else if (isSelected) {
    containerClass += "bg-red-600 border-red-700 shadow-md scale-105 z-10";
    iconClass += "text-white fill-current";
  } else {
    containerClass +=
      "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-red-400 hover:shadow-md hover:-translate-y-0.5";
    iconClass +=
      "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300";
  }

  const title = isBooked
    ? `Booked by: ${seat.passengerName || "Unknown"} (${seat.passengerAge || "N/A"})`
    : `Seat ${seat.id}`;

  return (
    <div onClick={onClick} className={containerClass} title={title}>
      <div
        className={`absolute -top-1 w-8 h-1.5 rounded-full ${
          isSelected
            ? "bg-red-800"
            : isBooked
              ? "bg-gray-400 dark:bg-gray-600"
              : "bg-gray-200 dark:bg-gray-700"
        }`}
      ></div>
      <Armchair className={iconClass} strokeWidth={2.5} />
    </div>
  );
}
