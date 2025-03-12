"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Loader2, AlertCircle, ArrowRight, Check } from "lucide-react"
import Link from "next/link"

export default function SymptomChecker() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [symptoms, setSymptoms] = useState("")
  const [duration, setDuration] = useState("")
  const [severity, setSeverity] = useState("")
  const [result, setResult] = useState<{
    possibleCauses: string[]
    recommendations: string[]
    urgency: "low" | "medium" | "high"
  } | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (step < 3) {
      setStep(step + 1)
      return
    }

    // Process final submission
    setIsLoading(true)

    // Simulate API call to analyze symptoms
    setTimeout(() => {
      // This would be replaced with actual AI analysis
      setResult({
        possibleCauses: ["Common cold", "Seasonal allergies", "Sinus infection"],
        recommendations: [
          "Rest and stay hydrated",
          "Over-the-counter decongestants may help relieve symptoms",
          "Use a humidifier to add moisture to the air",
          "If symptoms worsen or persist beyond 7 days, consult a healthcare provider",
        ],
        urgency: "low",
      })
      setIsLoading(false)
      setStep(4)
    }, 2000)
  }

  const getStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <CardHeader>
              <CardTitle>Step 1: Describe Your Symptoms</CardTitle>
              <CardDescription>Please describe the symptoms you're experiencing in detail</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="symptoms">Symptoms</Label>
                  <Textarea
                    id="symptoms"
                    placeholder="E.g., I have a headache, runny nose, and sore throat"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    rows={5}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </>
        )
      case 2:
        return (
          <>
            <CardHeader>
              <CardTitle>Step 2: Duration of Symptoms</CardTitle>
              <CardDescription>How long have you been experiencing these symptoms?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <RadioGroup value={duration} onValueChange={setDuration} required>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="less-than-day" id="less-than-day" />
                    <Label htmlFor="less-than-day">Less than a day</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1-3-days" id="1-3-days" />
                    <Label htmlFor="1-3-days">1-3 days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="4-7-days" id="4-7-days" />
                    <Label htmlFor="4-7-days">4-7 days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1-2-weeks" id="1-2-weeks" />
                    <Label htmlFor="1-2-weeks">1-2 weeks</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="more-than-2-weeks" id="more-than-2-weeks" />
                    <Label htmlFor="more-than-2-weeks">More than 2 weeks</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </>
        )
      case 3:
        return (
          <>
            <CardHeader>
              <CardTitle>Step 3: Symptom Severity</CardTitle>
              <CardDescription>How would you rate the severity of your symptoms?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <RadioGroup value={severity} onValueChange={setSeverity} required>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mild" id="mild" />
                    <Label htmlFor="mild">Mild - Noticeable but not interfering with daily activities</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate">Moderate - Somewhat interfering with daily activities</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="severe" id="severe" />
                    <Label htmlFor="severe">Severe - Significantly interfering with daily activities</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very-severe" id="very-severe" />
                    <Label htmlFor="very-severe">Very Severe - Unable to perform daily activities</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </>
        )
      case 4:
        return (
          <>
            <CardHeader>
              <CardTitle>Symptom Analysis Results</CardTitle>
              <CardDescription>
                Based on the information you provided, here's our preliminary assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Possible Causes</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    These are potential causes based on your symptoms, not a diagnosis:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    {result?.possibleCauses.map((cause, index) => (
                      <li key={index} className="text-sm">
                        {cause}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Recommendations</h3>
                  <ul className="space-y-2">
                    {result?.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className={`rounded-lg p-4 flex items-center space-x-3 ${
                    result?.urgency === "high"
                      ? "bg-red-50 text-red-800"
                      : result?.urgency === "medium"
                        ? "bg-amber-50 text-amber-800"
                        : "bg-green-50 text-green-800"
                  }`}
                >
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">
                      {result?.urgency === "high"
                        ? "Seek immediate medical attention"
                        : result?.urgency === "medium"
                          ? "Consider consulting a healthcare provider soon"
                          : "Low urgency - Monitor symptoms"}
                    </p>
                    <p className="text-sm">
                      {result?.urgency === "high"
                        ? "Your symptoms may require urgent care."
                        : result?.urgency === "medium"
                          ? "Your symptoms should be evaluated by a healthcare provider."
                          : "Self-care measures may be sufficient, but consult a doctor if symptoms worsen."}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Remember:</strong> This is not a medical diagnosis. Always consult with a healthcare
                    professional for proper evaluation and treatment.
                  </p>
                </div>
              </div>
            </CardContent>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-10 px-4 bg-gray-50">
        <div className="container mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold text-center mb-8">Symptom Checker</h1>

          {/* Progress Indicator */}
          {step < 4 && (
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Step {step} of 3</span>
                <span className="text-sm text-gray-500">{Math.round((step / 3) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(step / 3) * 100}%` }}></div>
              </div>
            </div>
          )}

          <Card>
            <form onSubmit={handleSubmit}>
              {getStepContent()}

              <CardFooter className="flex justify-between">
                {step > 1 && step < 4 ? (
                  <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                    Back
                  </Button>
                ) : (
                  <div></div>
                )}

                {step < 4 ? (
                  <Button
                    type="submit"
                    disabled={
                      (step === 1 && !symptoms) || (step === 2 && !duration) || (step === 3 && !severity) || isLoading
                    }
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : step === 3 ? (
                      <>Analyze Symptoms</>
                    ) : (
                      <>
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="flex space-x-3">
                    <Link href="/chat">
                      <Button variant="outline">Chat with AI</Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button>Back to Dashboard</Button>
                    </Link>
                  </div>
                )}
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

