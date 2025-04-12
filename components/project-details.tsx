import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Layout, Palette, Type, Phone, MapPin, Clock } from "lucide-react"

interface ProjectDetailsProps {
  project: any
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
  const { settings } = project

  // Helper function to format layout name
  const formatLayoutName = (layout: string) => {
    switch (layout) {
      case "top-navbar":
        return "Barra de navegación superior"
      case "left-sidebar":
        return "Barra lateral izquierda"
      case "right-sidebar":
        return "Barra lateral derecha"
      default:
        return layout
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Layout className="h-5 w-5" />
            Configuración general
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-1">Diseño</h3>
            <p className="text-sm text-muted-foreground">{formatLayoutName(settings.layout)}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">Tipo de página</h3>
            <p className="text-sm text-muted-foreground">
              {settings.singlePage ? "Página única" : "Secciones separadas"}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">Secciones</h3>
            <div className="flex flex-wrap gap-2">
              {settings.sections.map((section: string) => (
                <Badge key={section} variant="outline">
                  {settings.navItems[section] || section}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">Fuente</h3>
            <p className="text-sm text-muted-foreground">{settings.fontFamily}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Colores
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Color primario</h3>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: settings.primaryColor }} />
                <span className="text-sm text-muted-foreground">{settings.primaryColor}</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-1">Color secundario</h3>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: settings.secondaryColor }} />
                <span className="text-sm text-muted-foreground">{settings.secondaryColor}</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-1">Color de fondo</h3>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: settings.backgroundColor }} />
                <span className="text-sm text-muted-foreground">{settings.backgroundColor}</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-1">Color de texto</h3>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: settings.textColor }} />
                <span className="text-sm text-muted-foreground">{settings.textColor}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Type className="h-5 w-5" />
            Contenido
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-base font-medium mb-2">Sección Hero</h3>
            <div className="space-y-2 pl-4 border-l-2 border-muted">
              <div>
                <h4 className="text-sm font-medium">Título</h4>
                <p className="text-sm text-muted-foreground">{settings.hero.title}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium">Descripción</h4>
                <p className="text-sm text-muted-foreground">{settings.hero.description}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium">Etiquetas</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {settings.hero.pills.map((pill: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {pill}
                    </Badge>
                  ))}
                </div>
              </div>

              {settings.hero.backgroundImage && (
                <div>
                  <h4 className="text-sm font-medium">Imagen de fondo</h4>
                  <p className="text-sm text-muted-foreground">Imagen configurada</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-base font-medium mb-2">Sección Características</h3>
            <div className="space-y-2 pl-4 border-l-2 border-muted">
              <div>
                <h4 className="text-sm font-medium">Título de sección</h4>
                <p className="text-sm text-muted-foreground">{settings.featuresSection?.title}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium">Subtítulo</h4>
                <p className="text-sm text-muted-foreground">{settings.featuresSection?.subtitle}</p>
              </div>

              <div className="mt-2">
                <h4 className="text-sm font-medium mb-2">Características ({settings.features.length})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {settings.features.map((feature: any, index: number) => (
                    <div key={index} className="border rounded-md p-3">
                      <h5 className="font-medium">{feature.title}</h5>
                      <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                      {feature.link && <p className="text-xs text-primary mt-1">Link: {feature.link}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-base font-medium mb-2">Sección Sobre Nosotros</h3>
            <div className="space-y-2 pl-4 border-l-2 border-muted">
              <div>
                <h4 className="text-sm font-medium">Título</h4>
                <p className="text-sm text-muted-foreground">{settings.about.title}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium">Descripción</h4>
                <p className="text-sm text-muted-foreground">{settings.about.description}</p>
              </div>

              {settings.about.image && (
                <div>
                  <h4 className="text-sm font-medium">Imagen</h4>
                  <p className="text-sm text-muted-foreground">Imagen configurada</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-base font-medium mb-2">Sección Contacto</h3>
            <div className="space-y-2 pl-4 border-l-2 border-muted">
              <div>
                <h4 className="text-sm font-medium">Título de sección</h4>
                <p className="text-sm text-muted-foreground">{settings.contact?.title}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium">Subtítulo</h4>
                <p className="text-sm text-muted-foreground">{settings.contact?.subtitle}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <h4 className="text-sm font-medium">Teléfono</h4>
                    <p className="text-sm text-muted-foreground">{settings.contact?.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <h4 className="text-sm font-medium">Ubicación</h4>
                    <p className="text-sm text-muted-foreground">{settings.contact?.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <h4 className="text-sm font-medium">Horario</h4>
                    <p className="text-sm text-muted-foreground">{settings.contact?.hours}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
