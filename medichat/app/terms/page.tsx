import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FileText, ShieldAlert, Users, AlertTriangle, RefreshCw } from "lucide-react"

export default function Terms() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Please read these terms carefully before using MediChat.
            </p>
            <p className="text-gray-500 mt-2">Last Updated: March 11, 2025</p>
          </div>

          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <FileText className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">Introduction</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-700 mb-4">
                Welcome to MediChat. These Terms of Service ("Terms") govern your use of our website, mobile
                application, and AI chatbot service (collectively, the "Service") operated by MediChat Inc. ("we," "us,"
                or "our").
              </p>
              <p className="text-gray-700 mb-4">
                By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part
                of the Terms, you may not access the Service.
              </p>
              <p className="text-gray-700">
                We may modify these Terms at any time. We will provide notice of any material changes through the
                Service or by other means. Your continued use of the Service after such modifications will constitute
                your acknowledgment and agreement to the modified Terms.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Users className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">Who Can Use the Chatbot</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-700 mb-4">
                You must be at least 18 years old to use the Service. If you are under 18, you may only use the Service
                with the involvement and consent of a parent or legal guardian.
              </p>
              <p className="text-gray-700 mb-4">By using the Service, you represent and warrant that:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>You have the legal capacity to enter into these Terms</li>
                <li>You are not prohibited from using the Service under the laws of your jurisdiction</li>
                <li>You will use the Service only for lawful purposes and in accordance with these Terms</li>
              </ul>
              <p className="text-gray-700 mt-4">
                We reserve the right to refuse service to anyone for any reason at any time.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <ShieldAlert className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">Use of the Chatbot</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-700 mb-4">
                MediChat provides general health information and is not a replacement for professional medical advice,
                diagnosis, or treatment. The Service is designed for informational purposes only.
              </p>
              <p className="text-gray-700 mb-4">When using our Service, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Provide accurate information about your symptoms and health concerns</li>
                <li>Not rely solely on the chatbot for medical decisions</li>
                <li>Seek professional medical advice for serious or persistent health issues</li>
                <li>Not use the Service for emergency medical situations</li>
                <li>Not attempt to diagnose or treat others based solely on information from the Service</li>
              </ul>
              <p className="text-gray-700 mt-4">You understand that the AI chatbot:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Cannot perform physical examinations</li>
                <li>Does not have access to your complete medical history</li>
                <li>May not be aware of all potential drug interactions or contraindications</li>
                <li>Provides general information that may not apply to your specific situation</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <AlertTriangle className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">Prohibited Activities</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-700 mb-4">
                You agree not to engage in any of the following prohibited activities:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                  Using the Service for any illegal purpose or in violation of any local, state, national, or
                  international law
                </li>
                <li>Attempting to exploit the Service to access unauthorized information</li>
                <li>Impersonating another person or entity</li>
                <li>Harassing, threatening, or intimidating any other users</li>
                <li>
                  Uploading viruses or malicious code or conducting any activity that could disable, overburden, or
                  impair the Service
                </li>
                <li>Using the Service to generate or spread false health information</li>
                <li>Attempting to reverse-engineer, decompile, or disassemble any portion of the Service</li>
                <li>Using automated means to access or interact with the Service without our express permission</li>
                <li>Selling, reselling, or leasing access to the Service</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Violation of these prohibitions may result in termination of your access to the Service and potential
                legal action.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <ShieldAlert className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-700 mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL MEDICHAT, ITS DIRECTORS, EMPLOYEES, PARTNERS,
                AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
                PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER
                INTANGIBLE LOSSES, RESULTING FROM:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE</li>
                <li>ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE</li>
                <li>ANY CONTENT OBTAINED FROM THE SERVICE</li>
                <li>UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT</li>
                <li>ANY MEDICAL DECISIONS MADE BASED ON INFORMATION PROVIDED BY THE SERVICE</li>
              </ul>
              <p className="text-gray-700 mt-4">
                THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT ANY WARRANTIES OF ANY KIND. WE
                EXPRESSLY DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
                THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p className="text-gray-700 mt-4">
                WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE, OR THAT ANY
                DEFECTS WILL BE CORRECTED. WE MAKE NO WARRANTIES AS TO THE RESULTS THAT MAY BE OBTAINED FROM THE USE OF
                THE SERVICE.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <RefreshCw className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">Updates to Terms</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-700 mb-4">
                We may update these Terms from time to time. We will notify you of any changes by posting the new Terms
                on this page and updating the "Last Updated" date.
              </p>
              <p className="text-gray-700 mb-4">
                You are advised to review these Terms periodically for any changes. Changes to these Terms are effective
                when they are posted on this page.
              </p>
              <p className="text-gray-700">
                Your continued use of the Service after we post any modifications to the Terms will constitute your
                acknowledgment of the modifications and your consent to abide and be bound by the modified Terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <FileText className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">Governing Law</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-700 mb-4">
                These Terms shall be governed and construed in accordance with the laws of the State of California,
                United States, without regard to its conflict of law provisions.
              </p>
              <p className="text-gray-700 mb-4">
                Our failure to enforce any right or provision of these Terms will not be considered a waiver of those
                rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining
                provisions of these Terms will remain in effect.
              </p>
              <p className="text-gray-700">
                These Terms constitute the entire agreement between us regarding our Service, and supersede and replace
                any prior agreements we might have had between us regarding the Service.
              </p>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Link href="/contact">
              <Button>Contact Us With Questions</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

