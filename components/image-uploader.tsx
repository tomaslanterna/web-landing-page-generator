"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Upload } from "lucide-react"

interface ImageUploaderProps {
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

export default function ImageUploader({ onImagesChange, maxImages = Number.POSITIVE_INFINITY }: ImageUploaderProps) {
  const [images, setImages] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages: string[] = []

      Array.from(e.target.files)
        .slice(0, maxImages - images.length)
        .forEach((file) => {
          const reader = new FileReader()
          reader.onload = (event) => {
            if (event.target && typeof event.target.result === "string") {
              newImages.push(event.target.result)

              if (newImages.length === Math.min(e.target.files!.length, maxImages - images.length)) {
                const updatedImages = [...images, ...newImages].slice(0, maxImages)
                setImages(updatedImages)
                onImagesChange(updatedImages)
              }
            }
          }
          reader.readAsDataURL(file)
        })
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
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden" />

      <Button
        type="button"
        variant="outline"
        onClick={triggerFileInput}
        className="w-full h-24 border-dashed flex flex-col gap-2"
      >
        <Upload className="h-6 w-6" />
        <span>Upload Images</span>
      </Button>

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

