import { CheckCircle, HelpCircle, AlertTriangle } from "lucide-react"
import { ProgressDemo } from "@/components/progress-demo"

export function PatientInsights() {
  const insights = [
    {
      patient: "Thomas Harris",
      symptoms: "Chest Pain, Shortness of Breath",
      suggestion: "Possible Myocardial Infarction",
      confidence: 95,
      severity: "high",
    },
    {
      patient: "Emily Johnson",
      symptoms: "Recurring Headache, Blurred Vision",
      suggestion: "Possible Migraine",
      confidence: 82,
      severity: "medium",
    },
    {
      patient: "Robert Brown",
      symptoms: "Persistent Headache, Light Sensitivity",
      suggestion: "Tension Headache vs. Migraine",
      confidence: 65,
      severity: "low",
    },
  ]

  return (
    <div className="space-y-6">
      {insights.map((insight, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-medium">{insight.patient}</div>
            {insight.severity === "high" ? (
              <div className="flex items-center text-xs font-medium text-red-600">
                <AlertTriangle className="mr-1 h-3 w-3" />
                High Priority
              </div>
            ) : insight.severity === "medium" ? (
              <div className="flex items-center text-xs font-medium text-amber-600">
                <HelpCircle className="mr-1 h-3 w-3" />
                Medium Priority
              </div>
            ) : (
              <div className="flex items-center text-xs font-medium text-emerald-600">
                <CheckCircle className="mr-1 h-3 w-3" />
                Low Priority
              </div>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Symptoms:</span> {insight.symptoms}
          </div>
          <div className="text-sm">
            <span className="font-medium">AI Suggestion:</span> {insight.suggestion}
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span>Confidence</span>
              <span
                className={
                  insight.confidence > 90
                    ? "text-emerald-600"
                    : insight.confidence > 75
                      ? "text-amber-600"
                      : "text-muted-foreground"
                }
              >
                {insight.confidence}%
              </span>
            </div>
            <ProgressDemo
              value={insight.confidence}
              className={insight.confidence > 90 ? "text-emerald-600" : insight.confidence > 75 ? "text-amber-600" : ""}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

