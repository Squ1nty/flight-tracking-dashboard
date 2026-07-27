"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  callsign: string;
  airlineName: string | null;
  originCountry: string | null;
  departureIata: string | null;
  arrivalIata: string | null;
  isAuthenticated: boolean;
  initiallySaved: boolean;
};

export default function SaveFlightButton({
  callsign,
  airlineName,
  originCountry,
  departureIata,
  arrivalIata,
  isAuthenticated,
  initiallySaved,
}: Props) {
  const router = useRouter();
  const [saved, setSaved] = useState(initiallySaved);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!isAuthenticated) {
      router.push(`/login?callbackUrl=/flight/${callsign}`);
      return;
    }

    setLoading(true);
    try {
      if (saved) {
        const res = await fetch(
          `/api/saved-flights?callsign=${encodeURIComponent(callsign)}`,
          { method: "DELETE" }
        );
        if (res.ok) setSaved(false);
      } else {
        const res = await fetch("/api/saved-flights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            callsign,
            airlineName,
            originCountry,
            departureIata,
            arrivalIata,
          }),
        });
        if (res.ok || res.status === 409) setSaved(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      aria-pressed={saved}
      className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-sm opacity-80 hover:opacity-100 disabled:opacity-40"
    >
      {saved ? "★ Saved" : "☆ Save flight"}
    </button>
  );
}