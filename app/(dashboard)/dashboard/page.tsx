import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { authService } from "@/lib/auth-service"

export default async function DashboardPage() {
  /* if (!session) {
    redirect("/login")
  }*/

  // Obtener proyectos del usuario desde nuestro servicio simulado
  const userProjects = await authService.getUserProjects("1")

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button asChild>
            <Link href="/dashboard/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nueva landing page
            </Link>
          </Button>
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

            {userProjects.length === 0 ? (
              <div className="border rounded-lg p-8 text-center">
                <h3 className="text-lg font-medium mb-2">No tienes proyectos</h3>
                <p className="text-muted-foreground mb-4">Comienza creando tu primera landing page</p>
                <Button asChild>
                  <Link href="/dashboard/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Crear landing page
                  </Link>
                </Button>
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
    </div>
  )
}

