"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Upload } from "lucide-react"

// Importar la biblioteca browser-image-compression
import imageCompression from "browser-image-compression"

interface ImageUploaderProps {
  onImagesChange: (images: string[]) => void
  maxImages?: number
  imageType?: "hero" | "feature" | "about" | "general"
}

export default function ImageUploader({
  onImagesChange,
  maxImages = Number.POSITIVE_INFINITY,
  imageType = "general",
}: ImageUploaderProps) {
  const [images, setImages] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateImage = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const width = img.width
        const height = img.height

        // Validaciones específicas según el tipo de imagen
        switch (imageType) {
          case "hero":
            if (width < 1200 || height < 600) {
              setError(`La imagen es demasiado pequeña. Se recomienda al menos 1920x1080px para la sección Hero.`)
              resolve(false)
            } else if (width / height < 1.5) {
              setError(`La proporción de la imagen no es óptima. Se recomienda formato panorámico (16:9 o similar).`)
              resolve(false)
            } else {
              setError(null)
              resolve(true)
            }
            break

          case "feature":
            if (width < 400 || height < 400) {
              setError(`La imagen es demasiado pequeña. Se recomienda al menos 600x400px para las características.`)
              resolve(false)
            } else {
              setError(null)
              resolve(true)
            }
            break

          case "about":
            if (width < 600 || height < 400) {
              setError(
                `La imagen es demasiado pequeña. Se recomienda al menos 800x600px para la sección Sobre Nosotros.`,
              )
              resolve(false)
            } else {
              setError(null)
              resolve(true)
            }
            break

          default:
            setError(null)
            resolve(true)
        }
      }

      img.onerror = () => {
        setError("Error al cargar la imagen. Asegúrate de que sea un formato válido (JPG, PNG, GIF).")
        resolve(false)
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === "string") {
          img.src = e.target.result
        }
      }
      reader.readAsDataURL(file)
    })
  }

  // Modificar la función handleFileChange para comprimir las imágenes
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setError(null)
      const newImages: string[] = []
      const filesToProcess = Array.from(e.target.files).slice(0, maxImages - images.length)

      for (const file of filesToProcess) {
        try {
          // Configurar opciones de compresión según el tipo de imagen
          const options = {
            // Configuración más agresiva para imágenes de hero
            maxSizeMB: imageType === "hero" ? 0.3 : 0.5, // 300KB para hero, 500KB para otras
            maxWidthOrHeight: imageType === "hero" ? 1600 : 1200, // Reducir dimensiones para hero
            useWebWorker: true,
            // Aumentar la compresión para imágenes de hero
            initialQuality: imageType === "hero" ? 0.6 : 0.8, // Calidad más baja para hero
          }

          console.log(`Comprimiendo imagen de tipo ${imageType} con opciones:`, options)

          // Comprimir la imagen
          const compressedFile = await imageCompression(file, options)
          console.log(`Tamaño original: ${file.size / 1024} KB, Tamaño comprimido: ${compressedFile.size / 1024} KB`)

          const isValid = await validateImage(compressedFile)

          if (isValid) {
            const reader = new FileReader()
            reader.onload = (event) => {
              if (event.target && typeof event.target.result === "string") {
                // Para imágenes de hero, verificar el tamaño de la cadena base64
                const base64String = event.target.result
                console.log(`Longitud de la cadena base64: ${base64String.length} caracteres`)

                // Si la imagen es muy grande incluso después de la compresión, mostrar una advertencia
                if (base64String.length > 500000 && imageType === "hero") {
                  console.warn("La imagen de hero sigue siendo grande después de la compresión")
                }

                newImages.push(base64String)

                if (newImages.length === filesToProcess.filter((f) => f !== file || isValid).length) {
                  const updatedImages = [...images, ...newImages].slice(0, maxImages)
                  setImages(updatedImages)
                  onImagesChange(updatedImages)
                }
              }
            }
            reader.readAsDataURL(compressedFile)
          }
        } catch (error) {
          console.error("Error comprimiendo imagen:", error)
          setError("Error al procesar la imagen. Intenta con una imagen más pequeña.")
        }
      }
    }
  }

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index)
    setImages(updatedImages)
    onImagesChange(updatedImages)
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={imageType === "hero" ? "image/jpeg,image/png" : "image/*"}
        multiple
        className="hidden"
      />

      <Button
        type="button"
        variant="outline"
        onClick={triggerFileInput}
        className="w-full h-24 border-dashed flex flex-col gap-2"
      >
        <Upload className="h-6 w-6" />
        <span>Upload Images</span>
        {imageType === "hero" && (
          <span className="text-xs text-muted-foreground">Preferiblemente JPG o PNG, máx. 2MB</span>
        )}
      </Button>
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {images.map((image, index) => (
            <Card key={index} className="relative group overflow-hidden">
              <img
                src={image || "/placeholder.svg"}
                alt={`Uploaded image ${index + 1}`}
                className="w-full h-32 object-cover"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
