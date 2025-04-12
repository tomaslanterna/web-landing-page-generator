import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

// Almacenamiento temporal para los settings generados por la IA
// En una aplicación real, esto estaría en una base de datos
const aiGeneratedSettings: Record<string, any> = {}

export async function POST(request: Request) {
  try {
    const { prompt, businessType } = await request.json()

    if (!prompt || !businessType) {
      return NextResponse.json({ error: "Prompt y tipo de negocio son requeridos" }, { status: 400 })
    }

    console.log("Generando landing page para:", businessType)
    console.log("Prompt:", prompt.substring(0, 50) + "...")

    // Construir el prompt para la API de v0
    const fullPrompt = `
      Genera una landing page para un negocio de tipo "${businessType}" con la siguiente descripción:
      "${prompt}"
      
      Responde ÚNICAMENTE con un objeto JSON válido que contenga la configuración completa para la landing page, con la siguiente estructura exacta:
      
      {
        "layout": "top-navbar",
        "primaryColor": "#e25822",
        "secondaryColor": "#10b981",
        "backgroundColor": "#ffffff",
        "textColor": "#1f2937",
        "fontFamily": "Inter",
        "title": "Título de la landing page",
        "description": "Descripción breve",
        "sections": ["hero", "features", "about", "contact"],
        "singlePage": true,
        "images": [],
        "navItems": {},
        "featuresSection": {
          "title": "SERVICIOS",
          "subtitle": "Nuestros Servicios"
        },
        "features": [
          {
            "title": "Servicio 1",
            "description": "Descripción del servicio",
            "image": "",
            "link": "#"
          },
          {
            "title": "Servicio 2",
            "description": "Descripción del servicio",
            "image": "",
            "link": "#"
          }
        ],
        "hero": {
          "title": "Título principal",
          "description": "Descripción principal",
          "pills": ["Etiqueta1", "Etiqueta2"],
          "backgroundImage": ""
        },
        "about": {
          "title": "Sobre Nosotros",
          "description": "Descripción sobre la empresa",
          "image": ""
        },
        "contact": {
          "phone": "123-456-7890",
          "location": "Dirección",
          "hours": "Horario",
          "title": "CONTACTO",
          "subtitle": "Contáctanos"
        }
      }
      
      Asegúrate de que los colores sean apropiados para el tipo de negocio y que el contenido sea relevante.
      NO incluyas explicaciones, comentarios o texto adicional fuera del objeto JSON.
      Responde SOLO con el objeto JSON válido.
    `

    // Usar la API de v0 para generar la respuesta
    let settings
    try {
      console.log("Llamando a la API de v0...")

      // En lugar de llamar a una API externa, usamos la API de v0 directamente
      // a través de un endpoint local que actúa como proxy
      const response = await fetch(`${process.env.VERCEL_URL || "http://localhost:3000"}/api/v0-proxy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: fullPrompt,
        }),
      })

      if (!response.ok) {
        throw new Error(`Error en la API de v0: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const text = data.text || data.response || ""

      console.log("Respuesta recibida de la API de v0")

      // Intentar extraer el JSON de la respuesta
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      const jsonString = jsonMatch ? jsonMatch[0] : text

      try {
        // Parsear el JSON
        settings = JSON.parse(jsonString)
        console.log("Settings generados correctamente")

        // Validar y corregir los settings
        settings = validateAndFixSettings(settings, businessType, prompt)
      } catch (parseError) {
        console.error("Error al parsear JSON:", parseError)
        console.log("Respuesta completa:", text)

        // Si hay un error al procesar la respuesta, usar settings por defecto
        settings = generateDefaultSettings(businessType, prompt)
      }
    } catch (aiError) {
      console.error("Error al llamar a la API de v0:", aiError)

      // Si hay un error con la API, usar settings por defecto
      settings = generateDefaultSettings(businessType, prompt)
    }

    // Generar un ID único para estos settings
    const settingsId = uuidv4()
    aiGeneratedSettings[settingsId] = settings

    // Establecer un tiempo de expiración para estos settings (30 minutos)
    setTimeout(
      () => {
        delete aiGeneratedSettings[settingsId]
      },
      30 * 60 * 1000,
    )

    return NextResponse.json({ settingsId })
  } catch (error) {
    console.error("Error generando landing page con IA:", error)
    return NextResponse.json(
      { error: (error as Error).message || "Error al generar la landing page con IA" },
      { status: 500 },
    )
  }
}

// Endpoint para obtener los settings generados por la IA
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const settingsId = searchParams.get("id")

  if (!settingsId || !aiGeneratedSettings[settingsId]) {
    return NextResponse.json({ error: "Settings no encontrados" }, { status: 404 })
  }

  return NextResponse.json({ settings: aiGeneratedSettings[settingsId] })
}

// Función para validar y corregir los settings
function validateAndFixSettings(settings: any, businessType: string, prompt: string) {
  // Asegurarnos de que settings es un objeto
  if (!settings || typeof settings !== "object") {
    return generateDefaultSettings(businessType, prompt)
  }

  // Asegurarnos de que tenemos todos los campos necesarios
  const defaultSettings = generateDefaultSettings(businessType, prompt)

  // Validar colores hexadecimales
  const isValidHexColor = (color: string) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)

  const primaryColor = isValidHexColor(settings.primaryColor) ? settings.primaryColor : defaultSettings.primaryColor
  const secondaryColor = isValidHexColor(settings.secondaryColor)
    ? settings.secondaryColor
    : defaultSettings.secondaryColor
  const backgroundColor = isValidHexColor(settings.backgroundColor)
    ? settings.backgroundColor
    : defaultSettings.backgroundColor
  const textColor = isValidHexColor(settings.textColor) ? settings.textColor : defaultSettings.textColor

  // Validar que features es un array
  const features = Array.isArray(settings.features) ? settings.features : defaultSettings.features

  return {
    layout: settings.layout || defaultSettings.layout,
    primaryColor,
    secondaryColor,
    backgroundColor,
    textColor,
    fontFamily: settings.fontFamily || defaultSettings.fontFamily,
    title: settings.title || defaultSettings.title,
    description: settings.description || defaultSettings.description,
    sections: Array.isArray(settings.sections) ? settings.sections : defaultSettings.sections,
    singlePage: settings.singlePage !== undefined ? settings.singlePage : defaultSettings.singlePage,
    images: Array.isArray(settings.images) ? settings.images : defaultSettings.images,
    navItems: settings.navItems && typeof settings.navItems === "object" ? settings.navItems : defaultSettings.navItems,
    featuresSection:
      settings.featuresSection && typeof settings.featuresSection === "object"
        ? settings.featuresSection
        : defaultSettings.featuresSection,
    features,
    hero: settings.hero && typeof settings.hero === "object" ? settings.hero : defaultSettings.hero,
    about: settings.about && typeof settings.about === "object" ? settings.about : defaultSettings.about,
    contact: settings.contact && typeof settings.contact === "object" ? settings.contact : defaultSettings.contact,
  }
}

// Función para generar settings por defecto
function generateDefaultSettings(businessType: string, prompt: string) {
  // Generar colores basados en el tipo de negocio
  let primaryColor = "#e25822"
  let secondaryColor = "#10b981"

  if (businessType.toLowerCase().includes("restaurante") || businessType.toLowerCase().includes("comida")) {
    primaryColor = "#e53e3e" // Rojo para restaurantes
    secondaryColor = "#38a169" // Verde para restaurantes
  } else if (businessType.toLowerCase().includes("tecnología") || businessType.toLowerCase().includes("tech")) {
    primaryColor = "#3182ce" // Azul para tecnología
    secondaryColor = "#805ad5" // Púrpura para tecnología
  } else if (businessType.toLowerCase().includes("salud") || businessType.toLowerCase().includes("médico")) {
    primaryColor = "#38a169" // Verde para salud
    secondaryColor = "#3182ce" // Azul para salud
  } else if (businessType.toLowerCase().includes("moda") || businessType.toLowerCase().includes("ropa")) {
    primaryColor = "#d53f8c" // Rosa para moda
    secondaryColor = "#805ad5" // Púrpura para moda
  } else if (businessType.toLowerCase().includes("educación") || businessType.toLowerCase().includes("escuela")) {
    primaryColor = "#3182ce" // Azul para educación
    secondaryColor = "#ed8936" // Naranja para educación
  } else if (businessType.toLowerCase().includes("inmobiliaria") || businessType.toLowerCase().includes("propiedad")) {
    primaryColor = "#2c5282" // Azul oscuro para inmobiliaria
    secondaryColor = "#718096" // Gris para inmobiliaria
  }

  // Generar título basado en el tipo de negocio
  const title = `${businessType} - Landing Page`

  // Extraer palabras clave del prompt para personalizar la descripción
  const keywords = prompt
    .split(" ")
    .filter((word) => word.length > 4)
    .slice(0, 5)
    .join(", ")

  // Generar settings para la landing page
  return {
    layout: "top-navbar",
    primaryColor,
    secondaryColor,
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    fontFamily: "Inter",
    title,
    description: `Una landing page profesional para ${businessType.toLowerCase()} con enfoque en ${keywords || "calidad y servicio"}.`,
    sections: ["hero", "features", "about", "contact"],
    singlePage: true,
    images: [],
    navItems: {},
    featuresSection: {
      title: "SERVICIOS",
      subtitle: `Nuestros Servicios en ${businessType}`,
    },
    features: [
      {
        title: "Servicio Premium",
        description: "Ofrecemos servicios de la más alta calidad para satisfacer todas tus necesidades.",
        image: "",
        link: "#",
      },
      {
        title: "Atención Personalizada",
        description: "Nos adaptamos a tus requerimientos específicos para brindarte la mejor experiencia.",
        image: "",
        link: "#",
      },
      {
        title: "Resultados Garantizados",
        description: "Trabajamos incansablemente para asegurar tu satisfacción y los mejores resultados.",
        image: "",
        link: "#",
      },
    ],
    hero: {
      title: `Bienvenido a ${businessType}`,
      description: prompt.substring(0, 150) + (prompt.length > 150 ? "..." : ""),
      pills: ["Profesional", "Confiable", "Innovador", "Calidad"],
      backgroundImage: "",
    },
    about: {
      title: "Sobre Nosotros",
      description: `Somos una empresa dedicada a ${businessType.toLowerCase()} con años de experiencia en el sector. Nuestro compromiso es brindar el mejor servicio a nuestros clientes.`,
      image: "",
    },
    contact: {
      phone: "123-456-7890",
      location: "Calle Principal #123, Ciudad",
      hours: "Lun - Vie: 9am - 6pm, Sáb: 10am - 2pm",
      title: "CONTACTO",
      subtitle: "Ponte en Contacto",
    },
  }
}
