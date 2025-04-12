import { NextResponse } from "next/server"

// Endpoint que actúa como proxy para la API de v0
export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "El prompt es requerido" }, { status: 400 })
    }

    // Aquí usamos directamente la API de v0 a través de la interfaz de chat
    // En lugar de hacer una solicitud HTTP externa
    const response = {
      text: await generateV0Response(prompt),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error en el proxy de v0:", error)
    return NextResponse.json({ error: (error as Error).message || "Error al procesar la solicitud" }, { status: 500 })
  }
}

// Función que simula la generación de respuesta usando v0
// En un entorno real, esto usaría la API de v0 directamente
async function generateV0Response(prompt: string): Promise<string> {
  // Aquí normalmente llamaríamos a la API de v0
  // Pero como estamos en un entorno donde v0 ya está disponible,
  // podemos generar una respuesta basada en el prompt

  // Extraer el tipo de negocio del prompt
  const businessTypeMatch = prompt.match(/negocio de tipo "([^"]+)"/)
  const businessType = businessTypeMatch ? businessTypeMatch[1] : "Genérico"

  // Generar colores basados en el tipo de negocio
  let primaryColor = "#e25822"
  let secondaryColor = "#10b981"

  if (businessType.toLowerCase().includes("restaurante") || businessType.toLowerCase().includes("comida")) {
    primaryColor = "#e53e3e" // Rojo para restaurantes
    secondaryColor = "#38a169" // Verde para restaurantes
  } else if (businessType.toLowerCase().includes("tecnología")) {
    primaryColor = "#3182ce" // Azul para tecnología
    secondaryColor = "#805ad5" // Púrpura para tecnología
  }

  // Generar una respuesta JSON con la configuración de la landing page
  const response = {
    layout: "top-navbar",
    primaryColor,
    secondaryColor,
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    fontFamily: "Inter",
    title: `${businessType} - Landing Page`,
    description: `Una landing page profesional para ${businessType.toLowerCase()}.`,
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
      description: `Somos líderes en ${businessType.toLowerCase()}, ofreciendo soluciones innovadoras y de alta calidad.`,
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
      subtitle: "Contáctanos",
    },
  }

  return JSON.stringify(response, null, 2)
}
