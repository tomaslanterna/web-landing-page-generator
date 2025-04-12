import { type NextRequest, NextResponse } from "next/server"
import { generateHTML, generateCSS, generateJS } from "@/lib/generator"
import { previewStore } from "./store"
import { cleanupPreviews } from "./cleanup"

// Aumentar el límite de tamaño de la solicitud
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Aumentar el límite a 10MB
    },
  },
}

export async function POST(request: NextRequest) {
  try {
    // Verificar el tamaño de la solicitud
    const contentLength = request.headers.get("content-length")
    if (contentLength && Number.parseInt(contentLength) > 10 * 1024 * 1024) {
      // 10MB en bytes
      return NextResponse.json(
        { error: "La solicitud es demasiado grande. Intenta con imágenes más pequeñas." },
        { status: 413 },
      )
    }

    const settings = await request.json()

    // Procesar las imágenes para reducir su tamaño
    if (settings.images && Array.isArray(settings.images)) {
      // Limitar la longitud de las cadenas base64 de las imágenes
      settings.images = settings.images.map((img: string) => {
        if (img && img.length > 500000) {
          // Si la imagen es mayor a ~500KB
          return img.substring(0, 500000) // Truncar la imagen
        }
        return img
      })
    }

    // Procesar imágenes en otras secciones
    if (settings.hero && settings.hero.backgroundImage && settings.hero.backgroundImage.length > 500000) {
      settings.hero.backgroundImage = settings.hero.backgroundImage.substring(0, 500000)
    }

    if (settings.about && settings.about.image && settings.about.image.length > 500000) {
      settings.about.image = settings.about.image.substring(0, 500000)
    }

    if (settings.features && Array.isArray(settings.features)) {
      settings.features = settings.features.map((feature: any) => {
        if (feature.image && feature.image.length > 500000) {
          feature.image = feature.image.substring(0, 500000)
        }
        return feature
      })
    }

    // Generate a unique ID for this preview
    const previewId = Date.now().toString(36) + Math.random().toString(36).substring(2)

    // Store the settings with a timestamp
    previewStore[previewId] = {
      settings,
      createdAt: Date.now(),
    }

    // Run cleanup to remove old previews
    cleanupPreviews()

    // Return the preview ID
    return NextResponse.json({ previewId })
  } catch (error) {
    console.error("Error creating preview:", error)
    return NextResponse.json({ error: "Failed to create preview" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const previewId = searchParams.get("id")

    if (!previewId || !previewStore[previewId]) {
      return NextResponse.json({ error: "Preview not found" }, { status: 404 })
    }

    const { settings } = previewStore[previewId]

    // Generate the HTML, CSS, and JS
    const html = generateHTML(settings)
    const css = generateCSS(settings)
    const js = generateJS(settings)

    // Combine them into a complete HTML document
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${settings.title}</title>
        <style>${css}</style>
        <link href="https://fonts.googleapis.com/css2?family=${settings.fontFamily.replace(" ", "+")}&display=swap" rel="stylesheet">
      </head>
      <body>
        ${html}
        <script>${js}</script>
      </body>
      </html>
    `

    // Return the HTML with the appropriate content type
    return new NextResponse(fullHtml, {
      headers: {
        "Content-Type": "text/html",
      },
    })
  } catch (error) {
    console.error("Error generating preview:", error)
    return new NextResponse("Error generating preview: " + (error as Error).message, {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    })
  }
}
