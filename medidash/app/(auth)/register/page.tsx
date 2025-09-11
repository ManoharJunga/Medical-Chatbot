"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, Stethoscope, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialty: "",
    location: "",
    contact: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecialtyChange = (value: string) => {
    setFormData((prev) => ({ ...prev, specialty: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    // 🔍 Log the payload before sending
    const payload = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      password: formData.password,
      specialty: formData.specialty,
      location: formData.location,
      contact: formData.contact,
    };
    console.log("Submitting doctor registration payload:", payload);

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5001/api/auth/doctors/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Backend response:", data); // 👈 also log the response

      if (!response.ok) throw new Error(data.message || "Registration failed");

      setSuccess("Doctor registered successfully! OTP sent for verification.");
      localStorage.setItem("registeredEmail", formData.email);
      setTimeout(() => router.push("/otp-verify"), 2000);
    } catch (err: any) {
      console.error("Error during registration:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">MediDash</h1>
          </div>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>Enter your information to create your doctor account</CardDescription>
          </CardHeader>
          <CardContent>
            {error && <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}
            {success && <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-600">{success}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="firstName" name="firstName" placeholder="John" className="pl-10" value={formData.firstName} onChange={handleChange} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" placeholder="Doe" value={formData.lastName} onChange={handleChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="email" name="email" type="email" placeholder="doctor@example.com" className="pl-10" value={formData.email} onChange={handleChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contact</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="contact" name="contact" type="tel" placeholder="1234567890" className="pl-10" value={formData.contact} onChange={handleChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" placeholder="New York" value={formData.location} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty</Label>
                <Select onValueChange={handleSpecialtyChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cardiology">Cardiology</SelectItem>
                    <SelectItem value="dermatology">Dermatology</SelectItem>
                    <SelectItem value="neurology">Neurology</SelectItem>
                    <SelectItem value="pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="surgery">Surgery</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10 pr-10" value={formData.password} onChange={handleChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10" value={formData.confirmPassword} onChange={handleChange} required />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center text-sm">
            Already have an account? <Link href="/login" className="text-primary hover:underline">Sign in</Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
