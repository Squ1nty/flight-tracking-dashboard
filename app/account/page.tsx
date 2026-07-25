'use client'
// Import { getServerSession } from "next-auth/next"
import { useSession } from "next-auth/react"
import AccountDashboardGrid from "../components/AccountDashboardGrid" 

export default function AccountPage() {
  // Init user to be used in the component i.e. name
  const { data: session } = useSession()

  return (
    <div className="grid grid-rows-[auto_1fr] min-h-screen py-2">
      <div className="flex flex-col gap-2 py-4 px-8">
        <h1 className="text-4xl font-bold">Account Dashboard</h1>
        <p className="text-lg text-gray-600">
          Welcome to your account dashboard. Here you can manage your account 
          settings, view your activity, and access exclusive features.
        </p>
      </div>
      <div className="flex items-center justify-center p-8">
        <AccountDashboardGrid />
      </div>
    </div>
  )
}