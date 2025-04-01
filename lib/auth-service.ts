import { v4 as uuidv4 } from "uuid"

// Tipos para nuestros datos
export interface User {
  id: string
  name: string | null
  email: string
  emailVerified?: Date | null
  image?: string | null
  password?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  name: string
  settings: any
  deployUrl?: string | null
  createdAt: Date
  updatedAt: Date
  userId: string
}

// Usuarios hardcodeados para simular la base de datos
const users: User[] = [
  {
    id: "1",
    name: "Usuario Demo",
    email: "demo@example.com",
    password: "$2a$10$8r0.OhB2X0IgHx3ZcKY.5eOq80ysVeQkYLlH1jvGZXmOJwGzWTUdW", // "password123" hasheado
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
]

// Proyectos hardcodeados
const projects: Project[] = [
  {
    id: "1",
    name: "Landing Page Demo",
    settings: {
      layout: "top-navbar",
      primaryColor: "#e25822",
      secondaryColor: "#10b981",
      backgroundColor: "#ffffff",
      textColor: "#1f2937",
      fontFamily: "Inter",
      title: "Demo Landing Page",
      description: "This is a demo landing page created with our generator.",
      sections: ["hero", "features", "about", "contact"],
      singlePage: true,
      images: [],
      features: [
        {
          title: "Feature 1",
          description: "Description for feature 1",
          image: "",
        },
        {
          title: "Feature 2",
          description: "Description for feature 2",
          image: "",
        },
      ],
      hero: {
        title: "Demo Landing Page",
        description: "This is a demo landing page.",
        pills: ["Demo", "Example", "Test"],
        backgroundImage: "",
      },
      about: {
        title: "About Us",
        description: "This is the about section.",
        image: "",
      },
      contact: {
        phone: "123-456-7890",
        location: "Demo Location",
        hours: "9am - 5pm",
      },
    },
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
    userId: "1",
  },
]

// Servicio de autenticación simulado
export const authService = {
  // Buscar usuario por email
  async getUserByEmail(email: string): Promise<User | null> {
    return users.find((user) => user.email === email) || null
  },

  // Buscar usuario por ID
  async getUserById(id: string): Promise<User | null> {
    return users.find((user) => user.id === id) || null
  },

  // Crear un nuevo usuario
  async createUser(userData: Partial<User>): Promise<User> {
    const newUser: User = {
      id: uuidv4(),
      name: userData.name || null,
      email: userData.email!,
      password: userData.password || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    users.push(newUser)
    return newUser
  },

  // Obtener proyectos de un usuario
  async getUserProjects(userId: string): Promise<Project[]> {
    return projects.filter((project) => project.userId === userId)
  },

  // Crear un nuevo proyecto
  async createProject(projectData: Partial<Project>): Promise<Project> {
    const newProject: Project = {
      id: uuidv4(),
      name: projectData.name!,
      settings: projectData.settings!,
      deployUrl: projectData.deployUrl || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: projectData.userId!,
    }

    projects.push(newProject)
    return newProject
  },

  // Simular la creación de una cuenta OAuth
  async linkAccount(account: any): Promise<void> {
    // En un sistema real, esto vincularía una cuenta OAuth con un usuario
    console.log("Linking account:", account)
  },

  // Simular la creación de una sesión
  async createSession(session: any): Promise<any> {
    // En un sistema real, esto crearía una sesión en la base de datos
    console.log("Creating session:", session)
    return { sessionToken: uuidv4(), ...session }
  },

  // Simular la actualización de una sesión
  async updateSession(session: any): Promise<any> {
    // En un sistema real, esto actualizaría una sesión en la base de datos
    console.log("Updating session:", session)
    return session
  },

  // Simular la eliminación de una sesión
  async deleteSession(sessionToken: string): Promise<void> {
    // En un sistema real, esto eliminaría una sesión de la base de datos
    console.log("Deleting session:", sessionToken)
  },
}

