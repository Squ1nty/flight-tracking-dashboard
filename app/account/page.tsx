'use client'

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import AccountDashboardGrid from "../components/accountGridComponents/AccountDashboardGrid"
import type { SavedFlightData } from "../components/accountGridComponents/SavedFlightsList"

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [flights, setFlights] = useState<SavedFlightData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status === "authenticated") {
      fetch("/api/saved-flights")
        .then((res) => res.json())
        .then((data) => {
          setFlights(
            data.map((f: any) => ({
              id: f._id,
              callsign: f.callsign,
              airlineName: f.airlineName ?? null,
              originCountry: f.originCountry ?? null,
              nickname: f.nickname ?? null,
              savedAt: f.savedAt,
            }))
          )
        })
        .finally(() => setLoading(false))
    }
  }, [status, router])

  return (
    <div className="grid grid-rows-[auto_1fr] w-full h-full py-2">
      <div className="flex flex-col gap-2 py-4 px-8">
        <h1 className="text-4xl font-bold">Account Dashboard</h1>
        <p className="text-lg text-gray-600">
          Welcome{session?.user?.name ? `, ${session.user.name[0].toUpperCase() + session.user.name.slice(1)}` : "Friend"}. Here
          you can manage your account settings, view your activity, and
          access exclusive features.
        </p>
      </div>
      <div className="flex items-center justify-center p-8 w-full h-full">
        {loading ? (
          <p className="text-sm opacity-60">Loading your saved flights...</p>
        ) : (
          <AccountDashboardGrid initialFlights={flights} />
        )}
      </div>
    </div>
  )
}