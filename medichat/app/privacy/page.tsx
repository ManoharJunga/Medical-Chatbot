import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Shield, Lock, Database, UserCheck, AlertTriangle, Mail } from "lucide-react"

export default function Privacy() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We value your privacy. This Privacy Policy explains how we collect, use, and protect your data.
            </p>
            <p className="text-gray-500 mt-2">Last Updated: March 11, 2025</p>
          </div>

          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Shield className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">Introduction</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-700 mb-4">
                MediChat ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains
                how we collect, use, and safeguard your information when you use our AI-powered medical chatbot service.
              </p>
              <p className="text-gray-700">
                By using MediChat, you agree to the collection and use of information in accordance with this policy. We
                will not use or share your information with anyone except as described in this Privacy Policy.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Database className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">What Data We Collect</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
                <p className="text-gray-700">When you create an account, we collect:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Password (encrypted)</li>
                  <li>Optional demographic information (age, gender) if provided</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Usage Data</h3>
                <p className="text-gray-700">We collect information on how you interact with our service:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
                  <li>Chat history and conversations with the AI</li>
                  <li>Symptoms and health information you share</li>
                  <li>Features you use and actions you take</li>
                  <li>Time spent on the platform</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Technical Data</h3>
                <p className="text-gray-700">
                  We automatically collect certain information when you visit our website:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
                  <li>IP address</li>
                  <li>Browser type and version</li>
                  <li>Device type and operating system</li>
                  <li>Time and date of your visit</li>
                  <li>Pages you view</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Cookies and Similar Technologies</h3>
                <p className="text-gray-700">
                  We use cookies and similar tracking technologies to track activity on our service and hold certain
                  information. Cookies are files with a small amount of data that may include an anonymous unique
                  identifier.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <UserCheck className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">How We Use Your Data</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-700 mb-4">We use the collected data for various purposes:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                  <span className="font-medium">To provide and maintain our service:</span>
                  <p className="mt-1">
                    Including monitoring the usage of our service and detecting, preventing, and addressing technical
                    issues.
                  </p>
                </li>
                <li>
                  <span className="font-medium">To improve the AI chatbot:</span>
                  <p className="mt-1">We analyze conversations to enhance the accuracy and relevance of responses.</p>
                </li>
                <li>
                  <span className="font-medium">To personalize your experience:</span>
                  <p className="mt-1">
                    We may use your information to understand how you use our service and to provide tailored content.
                  </p>
                </li>
                <li>
                  <span className="font-medium">To communicate with you:</span>
                  <p className="mt-1">To send you updates, security alerts, and support messages.</p>
                </li>
                <li>
                  <span className="font-medium">For research and analytics:</span>
                  <p className="mt-1">To improve our service and develop new features.</p>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Lock className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">Data Protection Measures</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-700 mb-4">
                The security of your data is important to us. We implement appropriate security measures to protect your
                personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>All data is encrypted during transmission and at rest</li>
                <li>We use secure authentication methods to protect your account</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Limited access to personal information by authorized personnel only</li>
                <li>Continuous monitoring for suspicious activities</li>
              </ul>
              <p className="text-gray-700 mt-4">
                However, please be aware that no method of transmission over the Internet or method of electronic
                storage is 100% secure. While we strive to use commercially acceptable means to protect your personal
                information, we cannot guarantee its absolute security.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <AlertTriangle className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-700 mb-4">
                We may employ third-party companies and individuals to facilitate our service, provide the service on
                our behalf, perform service-related tasks, or assist us in analyzing how our service is used.
              </p>
              <p className="text-gray-700 mb-4">These third parties include:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>AI model providers (e.g., OpenAI)</li>
                <li>Analytics services</li>
                <li>Cloud hosting providers</li>
                <li>Customer support tools</li>
              </ul>
              <p className="text-gray-700 mt-4">
                These third parties have access to your personal information only to perform these tasks on our behalf
                and are obligated not to disclose or use it for any other purpose.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <UserCheck className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-700 mb-4">
                Depending on your location, you may have certain rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                  <span className="font-medium">Right to Access:</span>
                  <p className="mt-1">You can request copies of your personal information.</p>
                </li>
                <li>
                  <span className="font-medium">Right to Rectification:</span>
                  <p className="mt-1">You can request that we correct inaccurate information about you.</p>
                </li>
                <li>
                  <span className="font-medium">Right to Erasure:</span>
                  <p className="mt-1">
                    You can request that we delete your personal information in certain circumstances.
                  </p>
                </li>
                <li>
                  <span className="font-medium">Right to Restrict Processing:</span>
                  <p className="mt-1">
                    You can request that we restrict the processing of your information in certain circumstances.
                  </p>
                </li>
                <li>
                  <span className="font-medium">Right to Data Portability:</span>
                  <p className="mt-1">
                    You can request that we transfer your information to another organization or directly to you.
                  </p>
                </li>
                <li>
                  <span className="font-medium">Right to Object:</span>
                  <p className="mt-1">You can object to our processing of your personal information.</p>
                </li>
              </ul>
              <p className="text-gray-700 mt-4">
                To exercise any of these rights, please contact us at privacy@medichat.com.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Mail className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">Contact for Privacy Concerns</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-700 mb-4">
                If you have any questions or concerns about our Privacy Policy or data practices, please contact our
                Privacy Officer at:
              </p>
              <div className="bg-gray-100 p-4 rounded-md">
                <p className="text-gray-700">Email: privacy@medichat.com</p>
                <p className="text-gray-700">Address: 123 Health Avenue, San Francisco, CA 94103</p>
                <p className="text-gray-700">Phone: +1 (555) 123-4567</p>
              </div>
              <p className="text-gray-700 mt-4">
                We will respond to your inquiry as soon as possible and within the timeframe required by applicable law.
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

