import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import SavedFlight from "@/models/SavedFlight";

// GET /api/saved-flights — list the signed-in user's saved flights, newest first
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const flights = await SavedFlight.find({ userId: session.user.id }).sort({
    savedAt: -1,
  });

  return NextResponse.json(flights);
}

// POST /api/saved-flights — save a flight for the signed-in user
// body: { callsign, airlineName?, originCountry?, nickname? }
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { callsign, airlineName, originCountry, nickname } = body ?? {};

  if (!callsign) {
    return NextResponse.json({ error: "callsign is required" }, { status: 400 });
  }

  await connectDB();

  const existing = await SavedFlight.findOne({
    userId: session.user.id,
    callsign,
  });
  if (existing) {
    return NextResponse.json({ error: "Flight already saved" }, { status: 409 });
  }

  const saved = await SavedFlight.create({
    userId: session.user.id,
    callsign,
    airlineName,
    originCountry,
    nickname,
    savedAt: new Date(),
  });

  return NextResponse.json(saved, { status: 201 });
}

// PATCH /api/saved-flights — rename (set/clear nickname) a saved flight
// body: { id, nickname }
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, nickname } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  await connectDB();
  const updated = await SavedFlight.findOneAndUpdate(
    { _id: id, userId: session.user.id },
    { nickname: nickname || undefined },
    { new: true }
  );

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

// DELETE /api/saved-flights?id=... (or ?callsign=...) — remove a saved flight
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const callsign = searchParams.get("callsign");

  if (!id && !callsign) {
    return NextResponse.json(
      { error: "id or callsign query param is required" },
      { status: 400 }
    );
  }

  await connectDB();
  const query = id
    ? { _id: id, userId: session.user.id }
    : { callsign, userId: session.user.id };

  const result = await SavedFlight.findOneAndDelete(query);
  if (!result) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}