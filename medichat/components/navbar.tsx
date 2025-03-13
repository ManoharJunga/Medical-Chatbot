"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, UserCircle } from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; profilePic?: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user"); // Remove invalid data
        setUser(null);
      }
    }
  }, []);
  

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary">MediChat</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary font-medium">Home</Link>
            <Link href="/about" className="text-gray-700 hover:text-primary font-medium">About</Link>
            <Link href="/chat" className="text-gray-700 hover:text-primary font-medium">Chatbot</Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary font-medium">Contact</Link>
          </nav>

          {/* Profile or Login Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {user.profilePic ? (
                  <img src={user.profilePic} alt="Profile" className="w-8 h-8 rounded-full" />
                ) : (
                  <UserCircle size={32} className="text-gray-500" />
                )}
                <span className="text-gray-700 font-medium">{user.name}</span>
                <Button variant="outline" onClick={handleLogout}>Logout</Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline">Log in</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-2">
          <nav className="flex flex-col space-y-4 py-4">
            <Link href="/" className="text-gray-700 hover:text-primary font-medium" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link href="/about" className="text-gray-700 hover:text-primary font-medium" onClick={() => setIsMenuOpen(false)}>About</Link>
            <Link href="/chat" className="text-gray-700 hover:text-primary font-medium" onClick={() => setIsMenuOpen(false)}>Chatbot</Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary font-medium" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
              {user ? (
                <div className="flex flex-col space-y-2">
                  <span className="text-center font-medium">{user.name}</span>
                  <Button variant="outline" className="w-full" onClick={handleLogout}>Logout</Button>
                </div>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Log in</Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Sign up</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
