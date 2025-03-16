"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, ShieldCheck } from "lucide-react"

interface SecuritySettingsProps {
  onChangePassword: (currentPassword: string, newPassword: string) => void
  isLoading: boolean
}

export function SecuritySettings({ onChangePassword, isLoading }: SecuritySettingsProps) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match")
      return
    }

    if (formData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    onChangePassword(formData.currentPassword, formData.newPassword)

    // Reset form after submission
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Use a strong password</h4>
                <p className="text-sm text-gray-500">
                  Create a password that includes uppercase and lowercase letters, numbers, and special characters.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Enable two-factor authentication</h4>
                <p className="text-sm text-gray-500">
                  Add an extra layer of security to your account by enabling two-factor authentication.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Don't reuse passwords</h4>
                <p className="text-sm text-gray-500">
                  Use a unique password for your MediChat account that you don't use on other websites.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

