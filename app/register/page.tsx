import type { Metadata } from "next"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Registrarse | Landing Page Generator",
  description: "Crea una cuenta para comenzar a crear landing pages",
}

export default async function RegisterPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <RegisterForm />
    </div>
  )
}
