import { Clock, Activity, Search, BookOpen } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function Features() {
  const features = [
    {
      icon: Clock,
      title: "24/7 AI Assistance",
      description: "Get medical guidance anytime, day or night, without waiting for appointments.",
    },
    {
      icon: Activity,
      title: "General Healthcare Advice",
      description: "Receive evidence-based information on common health concerns and wellness tips.",
    },
    {
      icon: Search,
      title: "Symptom Checker",
      description: "Describe your symptoms and get preliminary insights on possible causes.",
    },
    {
      icon: BookOpen,
      title: "Medical Resources",
      description: "Access a library of trusted health articles and educational content.",
    },
  ]

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Features That Care For You</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-primary transition-colors duration-300">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

