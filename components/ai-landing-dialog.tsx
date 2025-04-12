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
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Sparkles, Info } from "lucide-react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface AILandingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Ejemplos de prompts para diferentes tipos de negocio
const promptExamples = {
  Restaurante:
    "Quiero una landing page moderna para mi restaurante italiano con secciones para el menú, testimonios de clientes y un formulario de reserva. Los colores deben ser cálidos y acogedores.",
  "Tienda de ropa":
    "Necesito una landing page elegante para mi tienda de ropa con secciones para mostrar las últimas colecciones, ofertas especiales y un formulario de contacto. Prefiero un diseño minimalista.",
  "Agencia de marketing":
    "Busco una landing page profesional para mi agencia de marketing digital que muestre nuestros servicios, casos de éxito y un formulario para solicitar presupuestos. Quiero un diseño moderno y dinámico.",
  "Clínica dental":
    "Necesito una landing page para mi clínica dental que transmita confianza y profesionalismo. Debe incluir información sobre nuestros servicios, el equipo médico y un sistema para agendar citas.",
  Gimnasio:
    "Quiero una landing page energética para mi gimnasio que muestre las instalaciones, los planes de membresía y testimonios de clientes. Debe tener un diseño que motive a las personas a inscribirse.",
  "Estudio de fotografía":
    "Busco una landing page visual para mi estudio de fotografía que destaque mi portafolio, servicios y un formulario de contacto. El diseño debe ser elegante y permitir que las imágenes sean el centro de atención.",
}

// Lista de tipos de negocio comunes
const businessTypes = [
  "Restaurante",
  "Tienda de ropa",
  "Agencia de marketing",
  "Clínica dental",
  "Gimnasio",
  "Estudio de fotografía",
  "Consultoría",
  "Escuela/Academia",
  "Inmobiliaria",
  "Salón de belleza",
  "Taller mecánico",
  "Estudio de diseño",
  "Tienda de tecnología",
  "Hotel/Hostal",
  "Servicios legales",
]

export function AILandingDialog({ open, onOpenChange }: AILandingDialogProps) {
  const router = useRouter()
  const [prompt, setPrompt] = useState("")
  const [businessType, setBusinessType] = useState("")
  const [customBusinessType, setCustomBusinessType] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [useCustomType, setUseCustomType] = useState(false)

  const handleBusinessTypeChange = (value: string) => {
    setBusinessType(value)
    // Si hay un ejemplo de prompt para este tipo de negocio, sugerirlo
    if (promptExamples[value as keyof typeof promptExamples] && !prompt) {
      setPrompt(promptExamples[value as keyof typeof promptExamples])
    }
  }

  const handleGenerate = async () => {
    const finalBusinessType = useCustomType ? customBusinessType : businessType

    if (!prompt.trim()) {
      setError("Por favor, describe qué deseas para tu landing page")
      return
    }

    if (!finalBusinessType.trim()) {
      setError("Por favor, indica el tipo de negocio")
      return
    }

    try {
      setError(null)
      setIsGenerating(true)

      // Enviar la solicitud a la API para generar la landing page con IA
      const response = await fetch("/api/ai-landing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          businessType: finalBusinessType,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Error al generar la landing page")
      }

      const data = await response.json()

      // Redirigir al usuario a la página de edición con los settings generados
      router.push(`/dashboard/new?aiGenerated=true&settingsId=${data.settingsId}`)
      onOpenChange(false)
    } catch (error) {
      console.error("Error generando landing page:", error)
      setError((error as Error).message || "Ocurrió un error al generar la landing page")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleUseExample = (example: string) => {
    setPrompt(example)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Crear Landing Page con IA
          </DialogTitle>
          <DialogDescription>
            Describe qué deseas para tu landing page y nuestro asistente de IA generará una página personalizada para
            ti.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="business-type" className="col-span-4">
              Tipo de negocio
            </Label>

            {!useCustomType ? (
              <div className="col-span-4 flex gap-2">
                <Select value={businessType} onValueChange={handleBusinessTypeChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un tipo de negocio" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setUseCustomType(true)
                    setCustomBusinessType(businessType)
                  }}
                >
                  Otro
                </Button>
              </div>
            ) : (
              <div className="col-span-4 flex gap-2">
                <Input
                  placeholder="Ej: Tienda de mascotas, Estudio de yoga..."
                  value={customBusinessType}
                  onChange={(e) => setCustomBusinessType(e.target.value)}
                  disabled={isGenerating}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setUseCustomType(false)
                  }}
                >
                  Usar lista
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-4 flex items-center justify-between">
              <Label htmlFor="prompt" className="flex items-center gap-1">
                Describe tu landing page ideal
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[300px]">
                      <p>
                        Describe el estilo, secciones, colores y cualquier otra característica que desees para tu
                        landing page.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>

              {businessType && promptExamples[businessType as keyof typeof promptExamples] && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleUseExample(promptExamples[businessType as keyof typeof promptExamples])}
                  disabled={isGenerating}
                >
                  Usar ejemplo
                </Button>
              )}
            </div>

            <Textarea
              id="prompt"
              placeholder="Ej: Quiero una landing page moderna para mi negocio, con secciones para servicios, testimonios y un formulario de contacto..."
              className="col-span-4"
              rows={5}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
            />
          </div>

          {error && <div className="col-span-4 bg-destructive/10 text-destructive p-3 rounded-md text-sm">{error}</div>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isGenerating}>
            Cancelar
          </Button>
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generar con IA
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
