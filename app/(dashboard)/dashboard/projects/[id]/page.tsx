"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, Download, Rocket, Edit, Copy, ArrowLeft, Calendar, Globe, Eye } from "lucide-react"
import Preview from "@/components/preview"
import { DeployDialog } from "@/components/deploy-dialog"
import { ProjectDetails } from "@/components/project-details"
import { generateHTML, generateCSS, generateJS } from "@/lib/generator"
import saveAs from "file-saver"

// Datos de ejemplo para simular la información que vendría de la base de datos
const mockProjects = {
  "1": {
    id: "1",
    name: "Landing Page Demo",
    createdAt: "2023-01-15T12:00:00Z",
    updatedAt: "2023-02-20T15:30:00Z",
    deployUrl: "https://landing-demo.vercel.app",
    views: 1250,
    settings: {
      layout: "top-navbar",
      primaryColor: "#e25822",
      secondaryColor: "#10b981",
      backgroundColor: "#ffffff",
      textColor: "#1f2937",
      fontFamily: "Inter",
      title: "Demo Landing Page",
      description: "This is a demo landing page created with our generator.",
      sections: ["hero", "features", "about", "contact"],
      singlePage: true,
      images: [],
      navItems: {
        hero: "Inicio",
        features: "Servicios",
        about: "Nosotros",
        contact: "Contacto",
      },
      featuresSection: {
        title: "SERVICIOS",
        subtitle: "Nuestros Servicios Destacados",
      },
      features: [
        {
          title: "Diseño Web",
          description: "Creamos diseños web modernos y responsivos que se adaptan a cualquier dispositivo.",
          image: "",
          link: "#",
        },
        {
          title: "Marketing Digital",
          description: "Estrategias de marketing digital para aumentar la visibilidad de tu negocio.",
          image: "",
          link: "#",
        },
        {
          title: "Desarrollo de Apps",
          description: "Desarrollamos aplicaciones móviles nativas para iOS y Android.",
          image: "",
          link: "#",
        },
      ],
      hero: {
        title: "Soluciones Digitales para tu Negocio",
        description: "Ayudamos a las empresas a crecer en el mundo digital con soluciones personalizadas.",
        pills: ["Diseño Web", "Marketing Digital", "Desarrollo de Apps", "SEO"],
        backgroundImage: "",
      },
      about: {
        title: "Sobre Nosotros",
        description:
          "Somos un equipo de profesionales apasionados por la tecnología y el diseño. Nos dedicamos a crear soluciones digitales que ayuden a nuestros clientes a alcanzar sus objetivos.",
        image: "",
      },
      contact: {
        phone: "+1 (234) 567-890",
        location: "123 Calle Principal, Ciudad, País",
        hours: "Lun - Vie: 9am - 6pm",
        title: "CONTACTO",
        subtitle: "Ponte en Contacto",
      },
    },
  },
  "2": {
    id: "2",
    name: "Restaurant Website",
    createdAt: "2023-03-10T09:15:00Z",
    updatedAt: "2023-03-15T14:20:00Z",
    deployUrl: "https://restaurant-demo.vercel.app",
    views: 850,
    settings: {
      layout: "top-navbar",
      primaryColor: "#d4a373",
      secondaryColor: "#588157",
      backgroundColor: "#fefae0",
      textColor: "#3a3a3a",
      fontFamily: "Montserrat",
      title: "La Trattoria",
      description: "Auténtica cocina italiana en el corazón de la ciudad.",
      sections: ["hero", "features", "about", "contact"],
      singlePage: true,
      images: [],
      navItems: {
        hero: "Inicio",
        features: "Menú",
        about: "Nosotros",
        contact: "Reservas",
      },
      featuresSection: {
        title: "NUESTRO MENÚ",
        subtitle: "Especialidades de la Casa",
      },
      features: [
        {
          title: "Pastas Artesanales",
          description: "Elaboradas diariamente con los mejores ingredientes importados de Italia.",
          image: "",
          link: "#",
        },
        {
          title: "Pizzas al Horno de Leña",
          description: "Auténticas pizzas napolitanas cocinadas en nuestro horno de leña tradicional.",
          image: "",
          link: "#",
        },
        {
          title: "Postres Caseros",
          description: "Deliciosos postres tradicionales italianos elaborados por nuestro chef pastelero.",
          image: "",
          link: "#",
        },
      ],
      hero: {
        title: "La Trattoria",
        description: "Auténtica cocina italiana con más de 25 años de tradición familiar.",
        pills: ["Pasta Fresca", "Pizza Napolitana", "Vinos Selectos", "Postres Caseros"],
        backgroundImage: "",
      },
      about: {
        title: "Nuestra Historia",
        description:
          "Fundado en 1995 por la familia Rossi, nuestro restaurante mantiene vivas las recetas tradicionales italianas pasadas de generación en generación. Utilizamos ingredientes frescos y de la más alta calidad para ofrecer una experiencia gastronómica auténtica.",
        image: "",
      },
      contact: {
        phone: "+1 (234) 567-890",
        location: "45 Calle del Olivo, Centro Histórico",
        hours: "Mar - Dom: 12pm - 11pm",
        title: "RESERVAS",
        subtitle: "Reserva tu Mesa",
      },
    },
  },
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deployDialogOpen, setDeployDialogOpen] = useState(false)
  const [deployUrl, setDeployUrl] = useState<string | null>(null)
  const [isDeploying, setIsDeploying] = useState(false)
  const [isVerifyingDomain, setIsVerifyingDomain] = useState(false)
  const [domainVerificationError, setDomainVerificationError] = useState<string | null>(null)

  useEffect(() => {
    // Simular la carga de datos desde una API
    const fetchProject = async () => {
      try {
        // En una aplicación real, aquí haríamos una llamada a la API
        await new Promise((resolve) => setTimeout(resolve, 800)) // Simular delay de red

        const projectData = mockProjects[projectId]

        if (!projectData) {
          router.push("/dashboard")
          return
        }

        setProject(projectData)
      } catch (error) {
        console.error("Error fetching project:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [projectId, router])

  const handleDeploy = async (projectName: string, customDomain?: string) => {
    try {
      setIsDeploying(true)

      if (customDomain) {
        setIsVerifyingDomain(true)
        // En un caso real, aquí verificaríamos la disponibilidad del dominio
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setIsVerifyingDomain(false)
      }

      // Enviar los settings y el nombre del proyecto a la API
      const response = await fetch("/api/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          settings: project.settings,
          projectName,
          customDomain,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to deploy")
      }

      // Guardar la URL del despliegue
      setDeployUrl(data.deployUrl)

      // En una aplicación real, aquí actualizaríamos el proyecto en la base de datos
      setProject({
        ...project,
        deployUrl: data.deployUrl,
      })
    } catch (error) {
      console.error("Error deploying:", error)
      if ((error as Error).message.includes("domain")) {
        setDomainVerificationError((error as Error).message)
      } else {
        alert(`Error al desplegar: ${(error as Error).message}`)
      }
    } finally {
      setIsDeploying(false)
      setIsVerifyingDomain(false)
    }
  }

  const downloadFiles = () => {
    if (!project) return

    const { settings } = project

    // Generate files
    const html = generateHTML(settings)
    const css = generateCSS(settings)
    const js = generateJS(settings)

    // Create blobs and download
    const htmlBlob = new Blob([html], { type: "text/html;charset=utf-8" })
    const cssBlob = new Blob([css], { type: "text/css;charset=utf-8" })
    const jsBlob = new Blob([js], { type: "text/javascript;charset=utf-8" })

    saveAs(htmlBlob, "landing-page.html")
    saveAs(cssBlob, "styles.css")
    saveAs(jsBlob, "script.js")
  }

  const openPreviewInNewTab = async () => {
    if (!project) return

    try {
      // Send the settings to the API to create a preview
      const response = await fetch("/api/preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project.settings),
      })

      const data = await response.json()

      if (data.previewId) {
        // Open the preview in a new tab
        window.open(`/api/preview?id=${data.previewId}`, "_blank")
      } else {
        console.error("Failed to create preview")
      }
    } catch (error) {
      console.error("Error creating preview:", error)
    }
  }

  const handleEditProject = () => {
    // En una aplicación real, aquí redirigimos a la página de edición con los datos del proyecto
    router.push(`/dashboard/edit/${projectId}`)
  }

  const handleDuplicateProject = async () => {
    // En una aplicación real, aquí crearíamos una copia del proyecto en la base de datos
    alert("Funcionalidad de duplicar proyecto no implementada")
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Button>
        </div>
        <div className="h-96 flex items-center justify-center">
          <div className="animate-pulse text-lg">Cargando proyecto...</div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Button>
        </div>
        <div className="h-96 flex items-center justify-center">
          <div className="text-lg">Proyecto no encontrado</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al Dashboard
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Creado: {new Date(project.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>Actualizado: {new Date(project.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleEditProject}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="outline" size="sm" onClick={handleDuplicateProject}>
            <Copy className="h-4 w-4 mr-2" />
            Duplicar
          </Button>
          <Button variant="outline" size="sm" onClick={openPreviewInNewTab}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Ver en navegador
          </Button>
          <Button variant="outline" size="sm" onClick={downloadFiles}>
            <Download className="h-4 w-4 mr-2" />
            Descargar archivos
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setDeployUrl(null)
              setDeployDialogOpen(true)
            }}
          >
            <Rocket className="h-4 w-4 mr-2" />
            Desplegar
          </Button>
        </div>
      </div>

      {project.deployUrl && (
        <Card className="p-4 mb-8 bg-muted/50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-medium">Sitio desplegado</h3>
                <a
                  href={project.deployUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm"
                >
                  {project.deployUrl}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{project.views} visitas</span>
              </div>
              <Button size="sm" variant="outline" asChild>
                <a href={project.deployUrl} target="_blank" rel="noopener noreferrer">
                  Visitar sitio
                </a>
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="preview">Vista previa</TabsTrigger>
          <TabsTrigger value="details">Detalles</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-4">
          <Card className="p-4 h-full">
            <h2 className="text-xl font-semibold mb-4">Vista previa</h2>
            <div className="border rounded-md h-[600px] overflow-auto">
              <Preview settings={project.settings} />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <ProjectDetails project={project} />
        </TabsContent>
      </Tabs>

      <DeployDialog
        open={deployDialogOpen}
        onOpenChange={setDeployDialogOpen}
        onDeploy={handleDeploy}
        deployUrl={deployUrl}
        isDeploying={isDeploying}
        isVerifyingDomain={isVerifyingDomain}
        domainVerificationError={domainVerificationError}
      />
    </div>
  )
}
