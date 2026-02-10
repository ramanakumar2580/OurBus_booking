import { generateSeatLayout, Seat } from "./busConfig";

const DB_SEATS_PREFIX = "ourbus_seats_";
const DB_BOOKINGS = "ourbus_bookings";

export interface Passenger {
  seatId: string;
  name: string;
  age: string;
}

export interface Booking {
  id: string;
  mobile: string;
  date: string;
  from: string;
  to: string;
  seats: string[];
  passengers: Passenger[];
  totalAmount: number;
  timestamp: number;
  status: "BOOKED" | "CANCELLED";
  boarded?: boolean;
}

export interface SeatData extends Seat {
  status: "available" | "booked";
  passengerName?: string;
  passengerAge?: string;
  bookingId?: string;
}
export const initializeDB = () => {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(DB_BOOKINGS)) {
    localStorage.setItem(DB_BOOKINGS, JSON.stringify([]));
  }
};
const normalize = (str: string) => str.trim().toLowerCase();

export const getSeats = (
  date: string,
  from: string,
  to: string,
): SeatData[] => {
  if (typeof window === "undefined") return [];
  initializeDB();

  const dateKey = `${DB_SEATS_PREFIX}${date}_${normalize(from)}_${normalize(to)}`;
  const stored = localStorage.getItem(dateKey);

  if (!stored) {
    const initialSeats = generateSeatLayout().map((s) => ({
      ...s,
      status: "available",
    })) as SeatData[];

    localStorage.setItem(dateKey, JSON.stringify(initialSeats));
    return initialSeats;
  }
  return JSON.parse(stored);
};

export const bookSeats = (booking: Booking): boolean => {
  const seats = getSeats(booking.date, booking.from, booking.to);
  const updatedSeats = seats.map((s) => {
    if (booking.seats.includes(s.id)) {
      const passenger = booking.passengers.find((p) => p.seatId === s.id);
      return {
        ...s,
        status: "booked",
        passengerName: passenger?.name || "Unknown",
        passengerAge: passenger?.age || "",
        bookingId: booking.id,
      };
    }
    return s;
  });

  const dateKey = `${DB_SEATS_PREFIX}${booking.date}_${normalize(booking.from)}_${normalize(booking.to)}`;
  localStorage.setItem(dateKey, JSON.stringify(updatedSeats));
  const allBookings = JSON.parse(localStorage.getItem(DB_BOOKINGS) || "[]");
  allBookings.push({ ...booking, boarded: false });
  localStorage.setItem(DB_BOOKINGS, JSON.stringify(allBookings));

  return true;
};

export const updateBoardingStatus = (bookingId: string, status: boolean) => {
  if (typeof window === "undefined") return;
  const allBookings: Booking[] = JSON.parse(
    localStorage.getItem(DB_BOOKINGS) || "[]",
  );

  const updatedBookings = allBookings.map((b) =>
    b.id === bookingId ? { ...b, boarded: status } : b,
  );

  localStorage.setItem(DB_BOOKINGS, JSON.stringify(updatedBookings));
};

export const cancelBooking = (bookingId: string) => {
  const allBookings: Booking[] = JSON.parse(
    localStorage.getItem(DB_BOOKINGS) || "[]",
  );

  const bookingIndex = allBookings.findIndex((b) => b.id === bookingId);
  if (bookingIndex === -1) return false;

  const booking = allBookings[bookingIndex];

  allBookings[bookingIndex].status = "CANCELLED";
  localStorage.setItem(DB_BOOKINGS, JSON.stringify(allBookings));
  const seats = getSeats(booking.date, booking.from, booking.to);
  const updatedSeats = seats.map((s) => {
    if (booking.seats.includes(s.id)) {
      return {
        ...s,
        status: "available",
        passengerName: undefined,
        passengerAge: undefined,
        bookingId: undefined,
      };
    }
    return s;
  });

  const dateKey = `${DB_SEATS_PREFIX}${booking.date}_${normalize(booking.from)}_${normalize(booking.to)}`;
  localStorage.setItem(dateKey, JSON.stringify(updatedSeats));

  return true;
};

export const getBookings = (mobile: string) => {
  if (typeof window === "undefined") return [];
  const all: Booking[] = JSON.parse(localStorage.getItem(DB_BOOKINGS) || "[]");
  return all
    .filter((b) => b.mobile === mobile)
    .sort((a, b) => b.timestamp - a.timestamp);
};
