"use client";

import { useState } from "react";
import SavedFlightRow from "./SavedFlightRow";

export type SavedFlightData = {
  id: string;
  callsign: string;
  airlineName: string | null;
  originCountry: string | null;
  nickname: string | null;
  savedAt: string;
};

export default function SavedFlightsList({
  initialFlights,
}: {
  initialFlights: SavedFlightData[];
}) {
  const [flights, setFlights] = useState(initialFlights);

  function handleRemoved(id: string) {
    setFlights((prev) => prev.filter((f) => f.id !== id));
  }

  function handleRenamed(id: string, nickname: string | null) {
    setFlights((prev) =>
      prev.map((f) => (f.id === id ? { ...f, nickname } : f))
    );
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-[var(--text-muted)] bg-[var(--surface)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium opacity-80">Saved Flights</h2>
        <span className="text-xs opacity-50">{flights.length}</span>
      </div>

      {flights.length === 0 ? (
        <p className="text-sm opacity-60">
          No saved flights yet. To start, pick a flight!
        </p>
      ) : (
        <div className="flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
          {flights.map((f) => (
            <SavedFlightRow
              key={f.id}
              {...f}
              onRemoved={handleRemoved}
              onRenamed={handleRenamed}
            />
          ))}
        </div>
      )}
    </div>
  );
}