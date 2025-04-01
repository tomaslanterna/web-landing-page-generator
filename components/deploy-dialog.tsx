"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface DeployDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeploy: (projectName: string) => Promise<void>
  deployUrl: string | null
  isDeploying: boolean
}

export function DeployDialog({ open, onOpenChange, onDeploy, deployUrl, isDeploying }: DeployDialogProps) {
  const [projectName, setProjectName] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleDeploy = async () => {
    if (!projectName.trim()) {
      setError("Por favor, ingresa un nombre para el proyecto")
      return
    }

    // Validar que el nombre del proyecto sea válido para una URL
    const validProjectName = /^[a-z0-9-]+$/
    if (!validProjectName.test(projectName)) {
      setError("El nombre del proyecto solo puede contener letras minúsculas, números y guiones")
      return
    }

    setError(null)
    await onDeploy(projectName)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Desplegar en Vercel</DialogTitle>
          <DialogDescription>
            Ingresa un nombre para tu proyecto. Este nombre será parte de la URL de tu landing page.
          </DialogDescription>
        </DialogHeader>
        {!deployUrl ? (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="project-name" className="col-span-4">
                  Nombre del proyecto
                </Label>
                <Input
                  id="project-name"
                  placeholder="mi-landing-page"
                  className="col-span-4"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value.toLowerCase())}
                  disabled={isDeploying}
                />
                {error && <p className="col-span-4 text-sm text-destructive">{error}</p>}
                <p className="col-span-4 text-xs text-muted-foreground">
                  Tu URL será: {projectName ? `https://${projectName}.vercel.app` : "..."}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeploying}>
                Cancelar
              </Button>
              <Button onClick={handleDeploy} disabled={isDeploying}>
                {isDeploying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Desplegando...
                  </>
                ) : (
                  "Desplegar"
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-6 space-y-4">
            <div className="p-4 bg-muted rounded-md">
              <p className="font-medium mb-2">¡Despliegue exitoso!</p>
              <p className="text-sm mb-4">Tu landing page está disponible en:</p>
              <a
                href={deployUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline break-all font-medium"
              >
                {deployUrl}
              </a>
            </div>
            <DialogFooter>
              <Button onClick={() => onOpenChange(false)}>Cerrar</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

