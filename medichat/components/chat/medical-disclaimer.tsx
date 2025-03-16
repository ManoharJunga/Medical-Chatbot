"use client"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface MedicalDisclaimerProps {
  onDismiss: () => void
}

export function MedicalDisclaimer({ onDismiss }: MedicalDisclaimerProps) {
  return (
    <div className="bg-amber-50 p-4 flex items-start space-x-3">
      <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm text-amber-800">
          <strong>Medical Disclaimer:</strong> This AI chatbot provides general information only and is not a substitute
          for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other
          qualified health provider with any questions you may have regarding a medical condition.
        </p>
        <Button variant="link" size="sm" className="p-0 h-auto text-amber-800" onClick={onDismiss}>
          Dismiss
        </Button>
      </div>
    </div>
  )
}

