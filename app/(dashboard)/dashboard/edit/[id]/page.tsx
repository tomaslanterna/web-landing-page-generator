"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

export default function EditProjectPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  useEffect(() => {
    // En una implementación real, aquí cargaríamos los datos del proyecto
    // y los pasaríamos al editor

    // Por ahora, simplemente redirigimos a la página de creación
    // En una aplicación real, esta página tendría el mismo editor que la página de creación
    // pero precargado con los datos del proyecto
    router.push(`/dashboard/new?edit=true&projectId=${projectId}`)
  }, [projectId, router])

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="h-96 flex items-center justify-center">
        <div className="animate-pulse text-lg">Redirigiendo al editor...</div>
      </div>
    </div>
  )
}
