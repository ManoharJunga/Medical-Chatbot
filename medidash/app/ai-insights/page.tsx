import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChevronDown,
  Heart,
  Stethoscope,
  Activity,
  Brain,
  PillIcon as Pills,
  AlertTriangle,
  HelpCircle,
  TableIcon,
  LineChart,
  BarChart4,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProgressDemo } from "@/components/progress-demo"

export default function AIInsightsPage() {
  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
          <p className="text-muted-foreground">Smart diagnostic assistance and medical trends</p>
        </div>
      </div>

      <Tabs defaultValue="diagnoses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="diagnoses">
            <Stethoscope className="mr-2 h-4 w-4" />
            AI Diagnoses
          </TabsTrigger>
          <TabsTrigger value="treatments">
            <Pills className="mr-2 h-4 w-4" />
            Treatment Plans
          </TabsTrigger>
          <TabsTrigger value="trends">
            <LineChart className="mr-2 h-4 w-4" />
            Health Trends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="diagnoses" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <AIDiagnosisCard
              patientName="Thomas Harris"
              symptoms="Chest Pain, Shortness of Breath"
              recommendation="Possible Myocardial Infarction"
              confidence={95}
              icon={Heart}
              severity="high"
            />

            <AIDiagnosisCard
              patientName="Emily Johnson"
              symptoms="Recurring Headache, Blurred Vision"
              recommendation="Possible Migraine"
              confidence={82}
              icon={Brain}
              severity="medium"
            />

            <AIDiagnosisCard
              patientName="Robert Brown"
              symptoms="Persistent Headache, Light Sensitivity"
              recommendation="Tension Headache vs. Migraine"
              confidence={65}
              icon={Brain}
              severity="low"
            />

            <AIDiagnosisCard
              patientName="Lisa Garcia"
              symptoms="Severe Abdominal Pain, Nausea, Fever"
              recommendation="Possible Appendicitis"
              confidence={78}
              icon={Activity}
              severity="medium"
            />

            <AIDiagnosisCard
              patientName="James Williams"
              symptoms="Slurred Speech, Facial Drooping, Arm Weakness"
              recommendation="Possible Stroke"
              confidence={92}
              icon={Brain}
              severity="high"
            />

            <AIDiagnosisCard
              patientName="Sarah Wilson"
              symptoms="Shoulder Pain, Limited Range of Motion"
              recommendation="Rotator Cuff Injury"
              confidence={88}
              icon={Activity}
              severity="medium"
            />
          </div>
        </TabsContent>

        <TabsContent value="treatments" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">Thomas Harris</CardTitle>
                  <Heart className="h-5 w-5 text-red-500" />
                </div>
                <CardDescription>Possible Myocardial Infarction</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="font-medium">Recommended Treatment Plan:</div>
                  <ul className="ml-6 list-disc [&>li]:mt-2">
                    <li>Emergency cardiac evaluation</li>
                    <li>Aspirin 325mg chewed immediately</li>
                    <li>Nitroglycerin 0.4mg sublingual every 5 min as needed</li>
                    <li>ECG monitoring and cardiac enzyme tests</li>
                    <li>Consult with cardiology for possible angiography</li>
                  </ul>
                  <div className="pt-2">
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High Priority</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">Emily Johnson</CardTitle>
                  <Brain className="h-5 w-5 text-blue-500" />
                </div>
                <CardDescription>Possible Migraine</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="font-medium">Recommended Treatment Plan:</div>
                  <ul className="ml-6 list-disc [&>li]:mt-2">
                    <li>Sumatriptan 50mg at onset of migraine</li>
                    <li>Ibuprofen 600mg for pain management</li>
                    <li>Metoclopramide 10mg for associated nausea</li>
                    <li>Rest in dark, quiet environment</li>
                    <li>Preventive therapy consideration: Propranolol</li>
                  </ul>
                  <div className="pt-2">
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Medium Priority</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">James Williams</CardTitle>
                  <Brain className="h-5 w-5 text-red-500" />
                </div>
                <CardDescription>Possible Stroke</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="font-medium">Recommended Treatment Plan:</div>
                  <ul className="ml-6 list-disc [&>li]:mt-2">
                    <li>Immediate emergency referral</li>
                    <li>Time-critical assessment for thrombolysis</li>
                    <li>Neuroimaging (CT/MRI) immediately</li>
                    <li>Blood pressure management</li>
                    <li>Multidisciplinary stroke team evaluation</li>
                  </ul>
                  <div className="pt-2">
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High Priority</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Common Symptoms Reported</CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Headache</span>
                      <span className="font-medium">42%</span>
                    </div>
                    <ProgressDemo value={42} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Fever</span>
                      <span className="font-medium">28%</span>
                    </div>
                    <ProgressDemo value={28} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Cough</span>
                      <span className="font-medium">23%</span>
                    </div>
                    <ProgressDemo value={23} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Chest Pain</span>
                      <span className="font-medium">18%</span>
                    </div>
                    <ProgressDemo value={18} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Joint Pain</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <ProgressDemo value={15} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Diagnostic Confidence</CardTitle>
                <CardDescription>Performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Cardiovascular Conditions</span>
                      <span className="font-medium text-emerald-600">94%</span>
                    </div>
                    <ProgressDemo value={94} className="text-emerald-600" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Neurological Conditions</span>
                      <span className="font-medium text-emerald-600">91%</span>
                    </div>
                    <ProgressDemo value={91} className="text-emerald-600" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Respiratory Conditions</span>
                      <span className="font-medium text-amber-600">87%</span>
                    </div>
                    <ProgressDemo value={87} className="text-amber-600" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Gastrointestinal Issues</span>
                      <span className="font-medium text-amber-600">83%</span>
                    </div>
                    <ProgressDemo value={83} className="text-amber-600" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Musculoskeletal Disorders</span>
                      <span className="font-medium">79%</span>
                    </div>
                    <ProgressDemo value={79} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Local Disease Trends</CardTitle>
                <CardDescription>Based on patient reports in your area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TableIcon className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Current Cases</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Seasonal Allergies</span>
                        <Badge>High</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Common Cold</span>
                        <Badge variant="outline">Moderate</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Influenza</span>
                        <Badge variant="outline">Low</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>COVID-19</span>
                        <Badge variant="outline">Moderate</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <LineChart className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Monthly Trends</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Hypertension</span>
                        <Badge className="bg-amber-100 text-amber-800">↑ 8%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Diabetes</span>
                        <Badge className="bg-amber-100 text-amber-800">↑ 5%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Anxiety</span>
                        <Badge className="bg-amber-100 text-amber-800">↑ 15%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Obesity</span>
                        <Badge className="bg-emerald-100 text-emerald-800">↓ 3%</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <BarChart4 className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Demographic Insights</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm mb-1">Age Distribution</div>
                        <div className="text-xs text-muted-foreground">Most affected: 45-65</div>
                      </div>
                      <div>
                        <div className="text-sm mb-1">Gender Distribution</div>
                        <div className="text-xs text-muted-foreground">Males: 48%, Females: 52%</div>
                      </div>
                      <div>
                        <div className="text-sm mb-1">Risk Factors</div>
                        <div className="text-xs text-muted-foreground">Smoking, Sedentary lifestyle</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface AIDiagnosisCardProps {
  patientName: string
  symptoms: string
  recommendation: string
  confidence: number
  icon: React.ElementType
  severity: "low" | "medium" | "high"
}

function AIDiagnosisCard({
  patientName,
  symptoms,
  recommendation,
  confidence,
  icon: Icon,
  severity,
}: AIDiagnosisCardProps) {
  return (
    <Card className={severity === "high" ? "border-red-200" : severity === "medium" ? "border-amber-200" : ""}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">{patientName}</CardTitle>
          <Icon
            className={`h-5 w-5 ${
              severity === "high" ? "text-red-500" : severity === "medium" ? "text-amber-500" : "text-primary"
            }`}
          />
        </div>
        <CardDescription>Symptoms: {symptoms}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <div className="font-medium">AI Recommendation:</div>
            <div className="text-sm">{recommendation}</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span>Confidence</span>
              <span
                className={
                  confidence > 90 ? "text-emerald-600" : confidence > 75 ? "text-amber-600" : "text-muted-foreground"
                }
              >
                {confidence}%
              </span>
            </div>
            <ProgressDemo
              value={confidence}
              className={confidence > 90 ? "text-emerald-600" : confidence > 75 ? "text-amber-600" : ""}
            />
          </div>

          <div className="pt-1">
            {severity === "high" ? (
              <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                <AlertTriangle className="mr-1 h-3 w-3" />
                High Priority
              </Badge>
            ) : severity === "medium" ? (
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                <HelpCircle className="mr-1 h-3 w-3" />
                Medium Priority
              </Badge>
            ) : (
              <Badge variant="outline">Low Priority</Badge>
            )}
          </div>

          <div className="pt-2">
            <Button variant="outline" size="sm" className="w-full">
              View Details
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

