"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, Sparkles } from "lucide-react"
import { AILandingDialog } from "@/components/ai-landing-dialog"

interface Project {
  id: string
  name: string
  updatedAt: Date
}

export function DashboardClient() {
  const [aiDialogOpen, setAiDialogOpen] = useState(false)
  const [userProjects, setUserProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // En una aplicación real, aquí cargaríamos los proyectos del usuario
    // desde una API
    const fetchProjects = async () => {
      try {
        // Simulamos una llamada a la API
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Datos de ejemplo
        setUserProjects([
          {
            id: "1",
            name: "Landing Page Demo",
            updatedAt: new Date("2023-01-15"),
          },
          {
            id: "2",
            name: "Restaurant Website",
            updatedAt: new Date("2023-03-15"),
          },
        ])
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/dashboard/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nueva landing page
              </Link>
            </Button>
            <Button variant="secondary" onClick={() => setAiDialogOpen(true)}>
              <Sparkles className="mr-2 h-4 w-4" />
              Crear con IA
            </Button>
          </div>
        </div>

        <div className="grid gap-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Proyectos recientes</h2>
              {userProjects.length > 0 && (
                <Button variant="link" asChild>
                  <Link href="/dashboard/projects">Ver todos</Link>
                </Button>
              )}
            </div>

            {isLoading ? (
              <div className="border rounded-lg p-8 text-center">
                <p className="text-muted-foreground">Cargando proyectos...</p>
              </div>
            ) : userProjects.length === 0 ? (
              <div className="border rounded-lg p-8 text-center">
                <h3 className="text-lg font-medium mb-2">No tienes proyectos</h3>
                <p className="text-muted-foreground mb-4">Comienza creando tu primera landing page</p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button asChild>
                    <Link href="/dashboard/new">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Crear landing page
                    </Link>
                  </Button>
                  <Button variant="secondary" onClick={() => setAiDialogOpen(true)}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Crear con IA
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {userProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/dashboard/projects/${project.id}`}
                    className="border rounded-lg p-4 hover:border-primary transition-colors"
                  >
                    <div className="aspect-video bg-muted rounded-md mb-2"></div>
                    <h3 className="font-medium truncate">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Actualizado: {new Date(project.updatedAt).toLocaleDateString()}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <AILandingDialog open={aiDialogOpen} onOpenChange={setAiDialogOpen} />
    </div>
  )
}
