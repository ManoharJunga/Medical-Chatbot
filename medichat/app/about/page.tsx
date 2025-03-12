import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MessageSquare, AlertCircle, Shield, Award, Brain } from "lucide-react"

export default function About() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4">About MediChat</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">Your trusted AI-powered healthcare assistant</p>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Welcome to MediChat</h2>
                <p className="text-gray-600 mb-4">
                  MediChat is your AI-powered healthcare assistant, designed to provide general medical guidance,
                  symptom checking, and health tips using advanced artificial intelligence.
                </p>
                <p className="text-gray-600">
                  Our platform helps users make informed health decisions by providing quick, accessible information
                  based on the latest medical knowledge.
                </p>
              </div>
              <div className="flex justify-center">
                <img
                  src="/placeholder.svg?height=300&width=400"
                  alt="MediChat Interface"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-12 px-4 bg-gray-50">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Mission</h2>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <p className="text-xl text-gray-700 italic">
                "We aim to make healthcare guidance accessible, fast, and reliable through advanced AI technology,
                empowering individuals to take control of their health journey."
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <Card className="text-center p-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Accessibility</h3>
                <p className="text-gray-600">Making healthcare information available to everyone, anytime, anywhere.</p>
              </Card>

              <Card className="text-center p-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Quality</h3>
                <p className="text-gray-600">Providing accurate, evidence-based information you can trust.</p>
              </Card>

              <Card className="text-center p-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Innovation</h3>
                <p className="text-gray-600">Leveraging cutting-edge AI technology to improve healthcare guidance.</p>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">How It Works</h2>

            <div className="space-y-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Enter Your Symptoms</h3>
                  <p className="text-gray-600">
                    Describe what you're experiencing in simple, everyday language. Our AI understands natural language
                    and can interpret a wide range of symptoms.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Get Preliminary Advice</h3>
                  <p className="text-gray-600">
                    Receive AI-generated insights based on your symptoms and medical knowledge. The chatbot will suggest
                    possible causes and provide general guidance.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Connect with a Doctor (if needed)</h3>
                  <p className="text-gray-600">
                    For serious concerns, we'll recommend professional medical consultation. MediChat can help you
                    understand when it's time to seek professional care.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link href="/chat">
                <Button size="lg">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Try MediChat Now
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-12 px-4 bg-amber-50">
          <div className="container mx-auto max-w-4xl">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="rounded-full bg-amber-100 p-4 w-16 h-16 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-8 w-8 text-amber-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4 text-amber-800">Medical Disclaimer</h2>
                <p className="text-amber-700 mb-4">
                  MediChat does not replace professional medical advice, diagnosis, or treatment. Always consult a
                  doctor for serious conditions.
                </p>
                <p className="text-amber-700 mb-4">
                  Our AI chatbot provides general information based on available medical knowledge, but it cannot
                  perform physical examinations or access your complete medical history.
                </p>
                <p className="text-amber-700">
                  If you're experiencing a medical emergency, please call emergency services or visit the nearest
                  emergency room immediately.
                </p>

                <div className="mt-6">
                  <Link href="/disclaimer">
                    <Button variant="outline" className="border-amber-600 text-amber-700 hover:bg-amber-100">
                      Read Full Disclaimer
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team & Technology (Optional) */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Our Technology</h2>

            <div className="bg-gray-50 rounded-lg p-8">
              <p className="text-gray-700 mb-4">
                MediChat is developed using state-of-the-art AI and Natural Language Processing (NLP) technology to
                provide accurate and helpful responses to your health queries.
              </p>
              <p className="text-gray-700 mb-4">
                Our system is continuously learning and improving based on the latest medical research and guidelines,
                ensuring you receive up-to-date information.
              </p>
              <p className="text-gray-700">
                We prioritize user privacy and data security, implementing robust measures to protect your personal
                information and chat history.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

