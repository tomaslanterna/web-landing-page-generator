import { type NextRequest, NextResponse } from "next/server"
import { generateHTML, generateCSS, generateJS } from "@/lib/generator"
import { previewStore } from "./store"
import { cleanupPreviews } from "./cleanup"

export async function POST(request: NextRequest) {
  try {
    const settings = await request.json()

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
    return NextResponse.json({ error: "Failed to create preview" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
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
}

