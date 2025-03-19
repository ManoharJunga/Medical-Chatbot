import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HowItWorks } from "@/components/how-it-works"
import { Features } from "@/components/features"
import { Testimonials } from "@/components/testimonials"
import Image from "next/image";
import main from "@/public/main.png";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">Your AI-Powered Healthcare Assistant</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Get instant medical guidance from our AI chatbot. Always available, always helpful.
            </p>
            <Link href="/chat">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Chat
              </Button>
            </Link>
            <div className="mt-12">
              <Image
                src={main}
                alt="Medical AI Assistant Interface"
                className="rounded-lg shadow-xl mx-auto"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <Features />

        {/* How It Works */}
        <HowItWorks />

        {/* Testimonials */}
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}

