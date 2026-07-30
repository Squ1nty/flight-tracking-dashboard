"use client";

import { useState } from "react";
import Link from "next/link";
import { useOpenSkyFlight } from "@/lib/useOpenSkyFlight";
import { resolveStatus } from "@/lib/flightstatus";
import FlightStatusPill from "../FlightStatusPill";

type Props = {
  id: string;
  callsign: string;
  airlineName: string | null;
  nickname: string | null;
  departureIata?: string | null;
  arrivalIata?: string | null;
  onRemoved: (id: string) => void;
  onRenamed: (id: string, nickname: string | null) => void;
};

export default function SavedFlightRow({
  id,
  callsign,
  airlineName,
  nickname,
  departureIata,
  arrivalIata,
  onRemoved,
  onRenamed,
}: Props) {
  const flight = useOpenSkyFlight(callsign, null);
  const status = resolveStatus(flight, departureIata, arrivalIata);

  const [removing, setRemoving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draftNickname, setDraftNickname] = useState(nickname ?? "");
  const [saving, setSaving] = useState(false);

  async function handleRemove() {
    setRemoving(true);
    try {
      const res = await fetch(`/api/saved-flights?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        onRemoved(id);
      } else {
        setRemoving(false);
      }
    } catch {
      setRemoving(false);
    }
  }

  async function handleSaveNickname() {
    setSaving(true);
    try {
      const res = await fetch("/api/saved-flights", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, nickname: draftNickname.trim() || null }),
      });
      if (res.ok) {
        onRenamed(id, draftNickname.trim() || null);
        setEditing(false);
      }
    } finally {
      setSaving(false);
    }
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1 rounded-lg border border-white/10 px-2 py-2">
        <input
          autoFocus
          value={draftNickname}
          onChange={(e) => setDraftNickname(e.target.value)}
          placeholder="Nickname"
          className="w-full min-w-0 rounded border border-white/20 bg-transparent px-2 py-1 text-xs"
        />
        <button
          onClick={handleSaveNickname}
          disabled={saving}
          className="shrink-0 text-xs opacity-60 hover:opacity-100"
        >
          {saving ? "..." : "Save"}
        </button>
        <button
          onClick={() => {
            setEditing(false);
            setDraftNickname(nickname ?? "");
          }}
          className="shrink-0 text-xs opacity-60 hover:opacity-100"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div className="group flex items-center justify-between gap-2 rounded-lg border border-white/10 px-2 py-2">
      <Link href={`/flight/${callsign}`} className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{nickname || callsign}</p>
        <p className="truncate text-xs opacity-60">
          {nickname ? callsign : airlineName || "Unknown airline"}
        </p>
      </Link>

      <div className="flex shrink-0 items-center gap-2">
        <FlightStatusPill status={status} />

        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => setEditing(true)}
            className="text-xs opacity-60 hover:opacity-100"
            aria-label="Rename"
          >
            ✎
          </button>
          <button
            onClick={handleRemove}
            disabled={removing}
            className="text-xs opacity-60 hover:text-red-400 hover:opacity-100"
            aria-label="Remove"
          >
            {removing ? "..." : "✕"}
          </button>
        </div>
      </div>
    </div>
  );
}