import { MessageSquare, AlertCircle, PhoneCall } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: MessageSquare,
      title: "Enter symptoms",
      description: "Describe what you're experiencing in simple, everyday language.",
    },
    {
      icon: AlertCircle,
      title: "Get preliminary advice",
      description: "Receive AI-generated insights based on your symptoms and medical knowledge.",
    },
    {
      icon: PhoneCall,
      title: "Connect with a doctor (if needed)",
      description: "For serious concerns, we'll recommend professional medical consultation.",
    },
  ]

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">How It Works</h2>
        <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Getting healthcare guidance has never been easier
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative">
                <div className="rounded-full bg-primary/10 p-6 w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <step.icon className="h-10 w-10 text-primary" />
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gray-200 -z-10 transform -translate-x-1/2" />
                )}
                <div className="rounded-full bg-primary text-white w-8 h-8 flex items-center justify-center absolute top-0 right-1/2 transform translate-x-12 -translate-y-2">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

