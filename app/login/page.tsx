import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Iniciar sesión | Landing Page Generator",
  description: "Inicia sesión en tu cuenta para crear landing pages",
}

// Desactivar la redirección automática para permitir pruebas
export default async function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <LoginForm />
    </div>
  )
}
