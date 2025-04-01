"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function SiteHeader() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">LandingBuilder</span>
          </Link>
          <nav className="hidden md:flex gap-6 ml-6">
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/dashboard" ? "text-primary" : "text-foreground/60"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/#features"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/#features" ? "text-primary" : "text-foreground/60"
              }`}
            >
              Características
            </Link>
            <Link
              href="/#pricing"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/#pricing" ? "text-primary" : "text-foreground/60"
              }`}
            >
              Precios
            </Link>
            <Link
              href="/#testimonials"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/#testimonials" ? "text-primary" : "text-foreground/60"
              }`}
            >
              Testimonios
            </Link>
          </nav>
        </div>
        <div className="hidden md:flex gap-4">
          <Button asChild variant="ghost">
            <Link href="/login">Iniciar sesión</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Registrarse</Link>
          </Button>
        </div>
        <button className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden container py-4 border-t">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/#features"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={toggleMenu}
            >
              Características
            </Link>
            <Link
              href="/#pricing"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={toggleMenu}
            >
              Precios
            </Link>
            <Link
              href="/#testimonials"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={toggleMenu}
            >
              Testimonios
            </Link>
            <div className="flex flex-col gap-2 pt-2 border-t">
              <Button asChild variant="ghost">
                <Link href="/login" onClick={toggleMenu}>
                  Iniciar sesión
                </Link>
              </Button>
              <Button asChild>
                <Link href="/register" onClick={toggleMenu}>
                  Registrarse
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

