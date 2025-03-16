"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, Clock, Loader2, ShieldAlert } from "lucide-react"

interface AccountStatusProps {
  user: {
    isVerified: boolean
    isApproved: boolean
    email: string
    phone: string
  }
  onRequestVerification: () => void
  isLoading: boolean
}

export function AccountStatus({ user, onRequestVerification, isLoading }: AccountStatusProps) {
  // Calculate profile completion percentage
  const getProfileCompletion = () => {
    // This is a simplified example - in a real app, you'd check more fields
    let completed = 0
    const total = 4

    if (user.email) completed++
    if (user.phone) completed++
    if (user.isVerified) completed++
    if (user.isApproved) completed++

    return Math.round((completed / total) * 100)
  }

  const profileCompletion = getProfileCompletion()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Status</CardTitle>
          <CardDescription>View and manage your account verification status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Profile Completion</span>
              <span className="text-sm text-gray-500">{profileCompletion}%</span>
            </div>
            <Progress value={profileCompletion} className="h-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-2">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Email Verification</CardTitle>
                  {user.isVerified ? (
                    <Badge variant="default" className="bg-green-500">
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-amber-500 border-amber-500">
                      Pending
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-gray-500">
                  {user.isVerified
                    ? "Your email has been successfully verified."
                    : "Please verify your email address to access all features."}
                </p>
              </CardContent>
              <CardFooter>
                {!user.isVerified && (
                  <Button variant="outline" size="sm" onClick={onRequestVerification} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Resend Verification"
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>

            <Card className="border-2">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Admin Approval</CardTitle>
                  {user.isApproved ? (
                    <Badge variant="default" className="bg-blue-500">
                      Approved
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-500">
                      Pending
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-gray-500">
                  {user.isApproved
                    ? "Your account has been approved by administrators."
                    : "Your account is pending approval from administrators."}
                </p>
              </CardContent>
              <CardFooter>
                {!user.isApproved && (
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    Typically takes 1-2 business days
                  </div>
                )}
              </CardFooter>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {user.isVerified ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-700">Your account is secure</AlertTitle>
              <AlertDescription className="text-green-600">
                Your account has been verified and all security features are enabled.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertTitle className="text-red-700">Verification required</AlertTitle>
              <AlertDescription className="text-red-600">
                Please verify your email address to secure your account and access all features.
              </AlertDescription>
            </Alert>
          )}

          <div className="rounded-md border p-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Important Security Notice</h4>
                <p className="text-sm text-gray-500 mt-1">
                  MediChat will never ask for your password via email, phone, or text message. Always ensure you're on
                  the official MediChat website before entering your credentials.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

