import { NextResponse } from "next/server";
import {
  generateSeatLayout,
  Seat,
  MAX_SEATS_PER_USER,
} from "@/utils/busConfig";

interface SeatStatus extends Seat {
  status: "available" | "booked";
  bookingId?: string | null;
  mobile?: string | null;
  travelDate?: string | null;
}

let seatsData: SeatStatus[] = generateSeatLayout().map((seat) => ({
  ...seat,
  status: "available",
  bookingId: null,
  mobile: null,
  travelDate: null,
}));

export async function GET() {
  return NextResponse.json({ seats: seatsData });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { seatIds, mobile, travelDate } = body;

  if (!seatIds || seatIds.length === 0) {
    return NextResponse.json({ message: "No seats selected" }, { status: 400 });
  }
  if (!mobile || !travelDate) {
    return NextResponse.json(
      { message: "Mobile number and Date are required" },
      { status: 400 },
    );
  }

  const isAlreadyBooked = seatIds.some((id: string) => {
    const seat = seatsData.find((s) => s.id === id);
    return seat && seat.status === "booked";
  });

  if (isAlreadyBooked) {
    return NextResponse.json(
      { message: "One or more seats are already taken." },
      { status: 409 },
    );
  }

  const existingBookings = seatsData.filter(
    (s) =>
      s.mobile === mobile &&
      s.travelDate === travelDate &&
      s.status === "booked",
  );

  const currentCount = existingBookings.length;
  const newCount = seatIds.length;
  const totalSeats = currentCount + newCount;

  if (totalSeats > MAX_SEATS_PER_USER) {
    return NextResponse.json(
      {
        message: `Limit Exceeded! You have already booked ${currentCount} seats. You can only book ${MAX_SEATS_PER_USER - currentCount} more.`,
      },
      { status: 400 },
    );
  }

  const bookingId =
    "BID-" + Math.floor(100000 + Math.random() * 900000).toString();

  seatsData = seatsData.map((seat) => {
    if (seatIds.includes(seat.id)) {
      return {
        ...seat,
        status: "booked",
        bookingId,
        mobile,
        travelDate,
      };
    }
    return seat;
  });

  return NextResponse.json({
    message: "Booking Successful",
    bookingId,
    updatedSeats: seatsData,
  });
}

export async function DELETE() {
  seatsData = generateSeatLayout().map((seat) => ({
    ...seat,
    status: "available",
    bookingId: null,
    mobile: null,
    travelDate: null,
  }));
  return NextResponse.json({ message: "All seats reset" });
}
