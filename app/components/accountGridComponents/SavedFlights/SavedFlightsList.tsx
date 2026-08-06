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
    <div className="flex h-full w-full flex-col rounded-xl border border-[var(--text-muted)] bg-[var(--dashboard-tile-bg)] p-4 xl:p-6 xl:row-start-1 xl:row-end-3 xl:col-start-4 xl:col-end-7">
      <div className="mb-3 flex items-center justify-between xl:mb-5">
        <h2 className="text-sm xl:text-4xl font-medium opacity-80">Saved Flights</h2>
        <span className="text-xs xl:text-2xl opacity-50">{flights.length}</span>
      </div>

      {flights.length === 0 ? (
        <p className="xl:text-2xl xl:pt-4=2 opacity-60">
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