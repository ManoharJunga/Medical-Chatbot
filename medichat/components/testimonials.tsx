import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Patient",
      content:
        "MediChat helped me understand my symptoms when I couldn't get an appointment. The advice was spot-on and saved me an unnecessary trip to the ER.",
      avatar: "SJ",
    },
    {
      name: "Michael Chen",
      role: "Healthcare Professional",
      content:
        "As a doctor, I'm impressed with the accuracy of MediChat's preliminary assessments. It helps patients get informed before their appointments.",
      avatar: "MC",
    },
    {
      name: "Emily Rodriguez",
      role: "Parent",
      content:
        "When my child had a fever at 2 AM, MediChat provided clear guidance on what to do. It's like having a medical professional on call 24/7.",
      avatar: "ER",
    },
  ]

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What Our Users Say</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarFallback className="bg-primary/10 text-primary">{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

