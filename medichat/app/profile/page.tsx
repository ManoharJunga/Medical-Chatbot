"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileTabs } from "@/components/profile/profile-tabs"
import { PersonalInfoForm } from "@/components/profile/personal-info-form"
import { SecuritySettings } from "@/components/profile/security-settings"
import { AccountStatus } from "@/components/profile/account-status"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("personal-info")
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch user data from API
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("http://localhost:5001/api/users/67d23b4d18df04b9f1f3e797")
        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }
        const data = await response.json()

        // Ensure dob is properly parsed
        if (data.dob) {
          data.dob = new Date(data.dob)
        }
        
        setUser(data)
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  const updateUserInfo = async (updatedInfo: Partial<typeof user>) => {
    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:5001/api/users/67d23b4d18df04b9f1f3e797", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedInfo),
      })

      if (!response.ok) {
        throw new Error("Failed to update user data")
      }

      const updatedUser = await response.json()
      setUser(updatedUser)

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating user data:", error)
      toast({
        title: "Update failed",
        description: "There was an error updating your profile.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)

      toast({
        title: "Password changed",
        description: "Your password has been changed successfully.",
      })
    }, 1000)
  }

  const requestVerification = async () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const updatedUser = { ...user, isVerified: true }
      setUser(updatedUser)
      setIsLoading(false)

      toast({
        title: "Verification successful",
        description: "Your account has been verified successfully.",
      })
    }, 1000)
  }

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (!user) {
    return <div className="flex min-h-screen items-center justify-center text-red-500">Failed to load user data.</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-10 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <ProfileHeader user={user} />

          <div className="mt-8">
            <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="mt-6">
              {activeTab === "personal-info" && (
                <PersonalInfoForm user={user} onSubmit={updateUserInfo} isLoading={isLoading} />
              )}

              {activeTab === "security" && <SecuritySettings onChangePassword={changePassword} isLoading={isLoading} />}

              {activeTab === "account" && (
                <AccountStatus user={user} onRequestVerification={requestVerification} isLoading={isLoading} />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
