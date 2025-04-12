"use client"

import { useEffect, useRef } from "react"
import { generateHTML, generateCSS, generateJS } from "@/lib/generator"

interface PreviewProps {
  settings: {
    layout: string
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
    textColor: string
    fontFamily: string
    title: string
    description: string
    sections: string[]
    singlePage: boolean
    images: string[]
    features: {
      title: string
      description: string
      image: string
    }[]
    hero?: {
      title: string
      description: string
      pills: string[]
      backgroundImage: string
    }
    about?: {
      title: string
      description: string
      image: string
    }
    contact?: {
      phone: string
      location: string
      hours: string
    }
  }
}

export default function Preview({ settings }: PreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    updatePreview()
  }, [settings])

  const updatePreview = () => {
    if (!iframeRef.current) return

    const html = generateHTML(settings)
    const css = generateCSS(settings)
    const js = generateJS(settings)

    const iframe = iframeRef.current
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

    if (iframeDoc) {
      iframeDoc.open()
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <style>${css}</style>
            <link href="https://fonts.googleapis.com/css2?family=${settings.fontFamily.replace(" ", "+")}&display=swap" rel="stylesheet">
          </head>
          <body>
            ${html}
            <script>${js}</script>
          </body>
        </html>
      `)
      iframeDoc.close()
    }
  }

  return <iframe ref={iframeRef} title="Landing Page Preview" className="w-full h-full border-0" />
}
