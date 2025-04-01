import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { authService } from "@/lib/auth-service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing name, email or password" }, { status: 400 })
    }

    // Verificar si el usuario ya existe
    const existingUser = await authService.getUserByEmail(email)

    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 })
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear el usuario
    const newUser = await authService.createUser({
      name,
      email,
      password: hashedPassword,
    })

    // Eliminar la contraseña de la respuesta
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    console.error("Error registering user:", error)
    return NextResponse.json({ error: "Error registering user" }, { status: 500 })
  }
}

