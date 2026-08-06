"use client";

import { useState } from "react";
import Link from "next/link";
import { useOpenSkyFlight } from "@/lib/useOpenSkyFlight";
import { resolveStatus } from "@/lib/flightstatus";
import FlightStatusPill from "../../FlightStatusPill";

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
    <div className="group flex items-center justify-between gap-2 rounded-lg border border-white/10 px-2 py-2 xl:px-6 xl:py-4">
      <Link href={`/flight/${callsign}`} className="min-w-0 flex-1">
        <p className="truncate text-sm xl:text-2xl font-medium">{nickname || callsign}</p>
        <p className="truncate text-xs xl:text-lg opacity-60">
          {nickname ? callsign : airlineName || "Unknown airline"}
        </p>
      </Link>

      <div className="flex shrink-0 items-center gap-2 xl:gap-12">
        <FlightStatusPill status={status} />

        <div className="flex items-center justify-end h-full gap-2 xl:gap-4">
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-[var(--text-secondary)] xl:text-xl"
            aria-label="Rename"
          >
            Edit
          </button>
          <button
            onClick={handleRemove}
            disabled={removing}
            className="h-6 w-6 hover:text-red-400"
            aria-label="Remove"
          >
            {
            removing 
            ? 
            "..."
            :
            <svg className='group' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 580">
              <path className='fill-[var(--text-primary)] group-hover:fill-[var(--hover)]' fill='' d="M232.7 69.9C237.1 56.8 249.3 48 263.1 48L377 48C390.8 48 403 56.8 407.4 69.9L416 96L512 96C529.7 96 544 110.3 544 128C544 145.7 529.7 160 512 160L128 160C110.3 160 96 145.7 96 128C96 110.3 110.3 96 128 96L224 96L232.7 69.9zM128 208L512 208L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 208zM216 272C202.7 272 192 282.7 192 296L192 488C192 501.3 202.7 512 216 512C229.3 512 240 501.3 240 488L240 296C240 282.7 229.3 272 216 272zM320 272C306.7 272 296 282.7 296 296L296 488C296 501.3 306.7 512 320 512C333.3 512 344 501.3 344 488L344 296C344 282.7 333.3 272 320 272zM424 272C410.7 272 400 282.7 400 296L400 488C400 501.3 410.7 512 424 512C437.3 512 448 501.3 448 488L448 296C448 282.7 437.3 272 424 272z"/>
            </svg>
            }
          </button>
        </div>
      </div>
    </div>
  );
}