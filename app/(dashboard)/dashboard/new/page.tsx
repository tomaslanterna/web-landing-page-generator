"use client"

import { useState, useEffect } from "react"
import saveAs from "file-saver"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, ExternalLink, Download, Rocket, Sparkles } from "lucide-react"
import ColorPicker from "@/components/color-picker"
import ImageUploader from "@/components/image-uploader"
import Preview from "@/components/preview"
import { generateHTML, generateCSS, generateJS, generateSeparatePages } from "@/lib/generator"
// Importar el nuevo componente de diálogo
import { DeployDialog } from "@/components/deploy-dialog"
// Agregar useSearchParams para obtener los parámetros de la URL
import { useSearchParams } from "next/navigation"

interface Feature {
  title: string
  description: string
  image: string
  link?: string // Nuevo campo para el deeplink
}

export default function Home() {
  const [settings, setSettings] = useState({
    layout: "top-navbar",
    primaryColor: "#e25822", // Updated to match the orange in the image
    secondaryColor: "#10b981",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    fontFamily: "Inter",
    title: "My Amazing Landing Page",
    description: "This is a beautiful landing page created with the Landing Page Generator.",
    sections: ["hero", "features", "about", "contact"],
    singlePage: true,
    images: [],
    navItems: {}, // Nombres personalizados para los items de navegación
    featuresSection: {
      title: "FEATURES",
      subtitle: "Our Features & Services.",
    },
    features: [
      {
        title: "Communications",
        description: "Pretium lectus quam id leo in vitae turpis. Mattis pellentesque id nibh tortor id.",
        image: "",
        link: "https://example.com/communications",
      },
      {
        title: "Inspired Design",
        description: "Nunc consequat interdum varius sit amet mattis vulputate enim nulla. Risus feugiat.",
        image: "",
        link: "https://example.com/design",
      },
      {
        title: "Happy Customers",
        description: "Nisl purus in mollis nunc sed id semper. Rhoncus aenean vel elit scelerisque mauris.",
        image: "",
        link: "https://example.com/customers",
      },
    ] as Feature[],
    hero: {
      title: "Welcome to Our Platform",
      description: "Create beautiful landing pages with our easy-to-use generator.",
      pills: ["Designer", "Product Designer", "Marketing", "Full Stack Developer"],
      backgroundImage: "",
    },
    about: {
      title: "Nice to meet you",
      description: "We're a team of passionate designers and developers creating amazing tools for businesses.",
      image: "",
    },
    contact: {
      phone: "1 (234) 567-891, 1 (234) 987-654",
      location: "121 Rock Street, 21 Avenue, New York, NY 92103-9000",
      hours: "Mon - Fri ......10 am - 8 pm, Sat, Sun ....... Closed",
      title: "CONTACT",
      subtitle: "Contact Us",
    },
  })
  const [isCreatingPreview, setIsCreatingPreview] = useState(false)
  // Agregar estos estados dentro de la función Home
  const [deployDialogOpen, setDeployDialogOpen] = useState(false)
  const [deployUrl, setDeployUrl] = useState<string | null>(null)
  const [isDeploying, setIsDeploying] = useState(false)
  // Add these states after deployUrl and isDeploying
  const [useCustomDomain, setUseCustomDomain] = useState(false)
  const [customDomain, setCustomDomain] = useState<string | undefined>(undefined)
  const [isVerifyingDomain, setIsVerifyingDomain] = useState(false)
  const [domainVerificationError, setDomainVerificationError] = useState<string | null>(null)

  // Dentro de la función Home, agregar:
  const searchParams = useSearchParams()
  const aiGenerated = searchParams.get("aiGenerated") === "true"
  const settingsId = searchParams.get("settingsId")

  // Agregar un useEffect para cargar los settings generados por la IA
  useEffect(() => {
    const loadAISettings = async () => {
      if (aiGenerated && settingsId) {
        try {
          const response = await fetch(`/api/ai-landing?id=${settingsId}`)

          if (!response.ok) {
            throw new Error("Error al cargar los settings generados por la IA")
          }

          const data = await response.json()
          setSettings(data.settings)
        } catch (error) {
          console.error("Error loading AI settings:", error)
        }
      }
    }

    loadAISettings()
  }, [aiGenerated, settingsId])

  const handleColorChange = (color: string, type: string) => {
    setSettings({
      ...settings,
      [type]: color,
    })
  }

  const handleImageUpload = (images: string[]) => {
    setSettings({
      ...settings,
      images,
    })
  }

  const handleChange = (field: string, value: any) => {
    setSettings({
      ...settings,
      [field]: value,
    })
  }

  const handleHeroChange = (field: string, value: any) => {
    setSettings({
      ...settings,
      hero: {
        ...settings.hero,
        [field]: value,
      },
    })
  }

  const handleAboutChange = (field: string, value: any) => {
    setSettings({
      ...settings,
      about: {
        ...settings.about,
        [field]: value,
      },
    })
  }

  const handleContactChange = (field: string, value: any) => {
    setSettings({
      ...settings,
      contact: {
        ...settings.contact,
        [field]: value,
      },
    })
  }

  const handlePillsChange = (pillsText: string) => {
    // Simplemente actualiza el texto sin procesar las comas
    setSettings({
      ...settings,
      hero: {
        ...settings.hero,
        pills: pillsText.split(",").map((pill) => pill.trim()),
        // No filtramos los elementos vacíos para permitir escribir comas
      },
    })
  }

  const handleFeatureChange = (index: number, field: string, value: string) => {
    const updatedFeatures = [...settings.features]
    updatedFeatures[index] = {
      ...updatedFeatures[index],
      [field]: value,
    }
    setSettings({
      ...settings,
      features: updatedFeatures,
    })
  }

  const addFeature = () => {
    setSettings({
      ...settings,
      features: [
        ...settings.features,
        {
          title: "New Feature",
          description: "Description for the new feature",
          image: "",
          link: "",
        },
      ],
    })
  }

  const removeFeature = (index: number) => {
    const updatedFeatures = settings.features.filter((_, i) => i !== index)
    setSettings({
      ...settings,
      features: updatedFeatures,
    })
  }

  const downloadFiles = () => {
    if (settings.singlePage) {
      // Single page mode - download one HTML file
      const html = generateHTML(settings)
      const css = generateCSS(settings)
      const js = generateJS(settings)

      const htmlBlob = new Blob([html], { type: "text/html;charset=utf-8" })
      const cssBlob = new Blob([css], { type: "text/css;charset=utf-8" })
      const jsBlob = new Blob([js], { type: "text/javascript;charset=utf-8" })

      saveAs(htmlBlob, "landing-page.html")
      saveAs(cssBlob, "styles.css")
      saveAs(jsBlob, "script.js")
    } else {
      // Separate pages mode - download multiple HTML files
      const pages = generateSeparatePages(settings)
      const css = generateCSS(settings)
      const js = generateJS(settings)

      // Download CSS and JS
      const cssBlob = new Blob([css], { type: "text/css;charset=utf-8" })
      const jsBlob = new Blob([js], { type: "text/javascript;charset=utf-8" })
      saveAs(cssBlob, "styles.css")
      saveAs(jsBlob, "script.js")

      // Download each HTML file
      Object.entries(pages).forEach(([filename, content]) => {
        const htmlBlob = new Blob([content], { type: "text/html;charset=utf-8" })
        saveAs(htmlBlob, filename)
      })
    }
  }

  const openPreviewInNewTab = async () => {
    try {
      setIsCreatingPreview(true)

      // Crear una copia de los settings para no modificar el estado original
      const previewSettings = JSON.parse(JSON.stringify(settings))

      // Comprimir las imágenes antes de enviarlas
      if (previewSettings.images && Array.isArray(previewSettings.images)) {
        previewSettings.images = previewSettings.images.map((img: string) => {
          if (img && img.length > 500000) {
            return img.substring(0, 500000) // Truncar imágenes muy grandes
          }
          return img
        })
      }

      // Comprimir otras imágenes en el objeto settings
      if (
        previewSettings.hero &&
        previewSettings.hero.backgroundImage &&
        previewSettings.hero.backgroundImage.length > 500000
      ) {
        previewSettings.hero.backgroundImage = previewSettings.hero.backgroundImage.substring(0, 500000)
      }

      if (previewSettings.about && previewSettings.about.image && previewSettings.about.image.length > 500000) {
        previewSettings.about.image = previewSettings.about.image.substring(0, 500000)
      }

      if (previewSettings.features && Array.isArray(previewSettings.features)) {
        previewSettings.features = previewSettings.features.map((feature: any) => {
          if (feature.image && feature.image.length > 500000) {
            feature.image = feature.image.substring(0, 500000)
          }
          return feature
        })
      }

      // Send the settings to the API to create a preview
      const response = await fetch("/api/preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(previewSettings),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Error del servidor: ${response.status} ${errorText}`)
      }

      const data = await response.json()

      if (data.previewId) {
        // Open the preview in a new tab
        window.open(`/api/preview?id=${data.previewId}`, "_blank")
      } else {
        console.error("Failed to create preview: No preview ID returned")
        alert("Error al crear la vista previa. Por favor, intenta con imágenes más pequeñas o menos imágenes.")
      }
    } catch (error) {
      console.error("Error creating preview:", error)
      alert(
        `Error al crear la vista previa: ${(error as Error).message || "Error desconocido"}. Intenta con imágenes más pequeñas.`,
      )
    } finally {
      setIsCreatingPreview(false)
    }
  }

  // Agregar esta función dentro de la función Home
  const handleDeploy = async (projectName: string, customDomain?: string) => {
    try {
      console.log("Deploy initiated with:", { projectName, customDomain })
      setIsDeploying(true)

      if (customDomain) {
        setIsVerifyingDomain(true)
        console.log("Verifying domain:", customDomain)
        // In a real case, we would verify domain availability here
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setIsVerifyingDomain(false)
      }

      // Send settings and project name to the API
      console.log("Sending request to /api/deploy")
      const response = await fetch("/api/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          settings,
          projectName,
          customDomain,
        }),
      })

      const data = await response.json()
      console.log("Deploy API response:", data)

      if (!response.ok) {
        throw new Error(data.error || "Failed to deploy")
      }

      // Save deployment URL
      setDeployUrl(data.deployUrl)
      setCustomDomain(data.customDomain)
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

  const handleFeaturesSectionChange = (field: string, value: any) => {
    setSettings({
      ...settings,
      featuresSection: {
        ...settings.featuresSection,
        [field]: value,
      },
    })
  }

  const handleNavItemChange = (section: string, value: string) => {
    setSettings({
      ...settings,
      navItems: {
        ...settings.navItems,
        [section]: value,
      },
    })
  }

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">Landing Page Generator</h1>

      {aiGenerated && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 flex items-center">
            <Sparkles className="h-4 w-4 mr-2" />
            Landing page generada con IA. Puedes personalizar los detalles a continuación.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Tabs defaultValue="layout" className="w-full">
            <TabsList className="grid grid-cols-6 mb-4">
              <TabsTrigger value="layout">Layout</TabsTrigger>
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="hero">Hero</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            <TabsContent value="layout" className="space-y-4">
              <Card className="p-4">
                <h2 className="text-xl font-semibold mb-4">Choose Layout</h2>
                <RadioGroup
                  value={settings.layout}
                  onValueChange={(value) => handleChange("layout", value)}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="top-navbar" id="top-navbar" />
                    <Label htmlFor="top-navbar">Top Navbar</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="left-sidebar" id="left-sidebar" />
                    <Label htmlFor="left-sidebar">Left Sidebar</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="right-sidebar" id="right-sidebar" />
                    <Label htmlFor="right-sidebar">Right Sidebar</Label>
                  </div>
                </RadioGroup>

                <div className="mt-4 flex items-center space-x-2">
                  <Switch
                    id="single-page"
                    checked={settings.singlePage}
                    onCheckedChange={(checked) => handleChange("singlePage", checked)}
                  />
                  <Label htmlFor="single-page">
                    {settings.singlePage ? "Single page layout" : "Separate sections"}
                  </Label>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="site-title">Site Title</Label>
                    <Input
                      id="site-title"
                      value={settings.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="My Amazing Landing Page"
                    />
                  </div>

                  <div>
                    <Label>Font Family</Label>
                    <select
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 mt-1"
                      value={settings.fontFamily}
                      onChange={(e) => handleChange("fontFamily", e.target.value)}
                    >
                      <option value="Inter">Inter</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Open Sans">Open Sans</option>
                      <option value="Montserrat">Montserrat</option>
                      <option value="Lato">Lato</option>
                      <option value="Poppins">Poppins</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-base font-semibold">Navigation Items</Label>
                    <p className="text-sm text-muted-foreground mb-2">Customize the names of your navigation items</p>

                    {settings.sections.map((section) => (
                      <div key={section} className="mb-2">
                        <Label htmlFor={`nav-${section}`}>{capitalizeFirstLetter(section)}</Label>
                        <Input
                          id={`nav-${section}`}
                          value={settings.navItems[section] || ""}
                          onChange={(e) => handleNavItemChange(section, e.target.value)}
                          placeholder={capitalizeFirstLetter(section)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="colors" className="space-y-4">
              <Card className="p-4">
                <h2 className="text-xl font-semibold mb-4">Choose Colors</h2>
                <div className="space-y-4">
                  <div>
                    <Label>Primary Color</Label>
                    <ColorPicker
                      color={settings.primaryColor}
                      onChange={(color) => handleColorChange(color, "primaryColor")}
                    />
                  </div>
                  <div>
                    <Label>Secondary Color</Label>
                    <ColorPicker
                      color={settings.secondaryColor}
                      onChange={(color) => handleColorChange(color, "secondaryColor")}
                    />
                  </div>
                  <div>
                    <Label>Background Color</Label>
                    <ColorPicker
                      color={settings.backgroundColor}
                      onChange={(color) => handleColorChange(color, "backgroundColor")}
                    />
                  </div>
                  <div>
                    <Label>Text Color</Label>
                    <ColorPicker
                      color={settings.textColor}
                      onChange={(color) => handleColorChange(color, "textColor")}
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="hero" className="space-y-4">
              <Card className="p-4">
                <h2 className="text-xl font-semibold mb-4">Hero Section</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="hero-title">Title</Label>
                    <Input
                      id="hero-title"
                      value={settings.hero.title}
                      onChange={(e) => handleHeroChange("title", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hero-description">Description</Label>
                    <Textarea
                      id="hero-description"
                      value={settings.hero.description}
                      onChange={(e) => handleHeroChange("description", e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hero-pills">Pills (comma separated)</Label>
                    <Input
                      id="hero-pills"
                      value={settings.hero.pills.join(", ")}
                      onChange={(e) => handlePillsChange(e.target.value)}
                      placeholder="Designer, Developer, Marketer"
                    />
                  </div>
                  <div>
                    <Label>Background Image</Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Recomendado: 1920x1080px o mayor. Formato panorámico para mejor visualización.
                    </p>
                    <ImageUploader
                      onImagesChange={(images) => {
                        if (images.length > 0) {
                          handleHeroChange("backgroundImage", images[0])
                        }
                      }}
                      maxImages={1}
                      imageType="hero"
                    />
                    {settings.hero.backgroundImage && (
                      <p className="text-xs text-muted-foreground mt-1">Background image uploaded</p>
                    )}
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Features</h2>
                  <Button onClick={addFeature} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Feature
                  </Button>
                </div>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="features-title">Section Label</Label>
                    <Input
                      id="features-title"
                      value={settings.featuresSection?.title || ""}
                      onChange={(e) => handleFeaturesSectionChange("title", e.target.value)}
                      placeholder="FEATURES"
                    />
                  </div>
                  <div>
                    <Label htmlFor="features-subtitle">Section Title</Label>
                    <Input
                      id="features-subtitle"
                      value={settings.featuresSection?.subtitle || ""}
                      onChange={(e) => handleFeaturesSectionChange("subtitle", e.target.value)}
                      placeholder="Our Features & Services."
                    />
                  </div>
                  {settings.features.map((feature, index) => (
                    <div key={index} className="space-y-4 pb-4 border-b last:border-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Feature {index + 1}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFeature(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div>
                        <Label htmlFor={`feature-title-${index}`}>Title</Label>
                        <Input
                          id={`feature-title-${index}`}
                          value={feature.title}
                          onChange={(e) => handleFeatureChange(index, "title", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`feature-description-${index}`}>Description</Label>
                        <Textarea
                          id={`feature-description-${index}`}
                          value={feature.description}
                          onChange={(e) => handleFeatureChange(index, "description", e.target.value)}
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`feature-link-${index}`}>Button Link (URL)</Label>
                        <Input
                          id={`feature-link-${index}`}
                          value={feature.link || ""}
                          onChange={(e) => handleFeatureChange(index, "link", e.target.value)}
                          placeholder="https://example.com/feature"
                        />
                      </div>
                      <div>
                        <Label>Feature Image</Label>
                        <p className="text-xs text-muted-foreground mb-2">
                          Recomendado: 600x400px. Preferiblemente formato cuadrado o ligeramente rectangular.
                        </p>
                        <ImageUploader
                          onImagesChange={(images) => {
                            if (images.length > 0) {
                              handleFeatureChange(index, "image", images[0])
                            }
                          }}
                          maxImages={1}
                          imageType="feature"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="about" className="space-y-4">
              <Card className="p-4">
                <h2 className="text-xl font-semibold mb-4">About Section</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="about-title">Title</Label>
                    <Input
                      id="about-title"
                      value={settings.about.title}
                      onChange={(e) => handleAboutChange("title", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="about-description">Description</Label>
                    <Textarea
                      id="about-description"
                      value={settings.about.description}
                      onChange={(e) => handleAboutChange("description", e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>About Image</Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Recomendado: 800x600px. Formato rectangular para mostrar el equipo o las instalaciones.
                    </p>
                    <ImageUploader
                      onImagesChange={(images) => {
                        if (images.length > 0) {
                          handleAboutChange("image", images[0])
                        }
                      }}
                      maxImages={1}
                      imageType="about"
                    />
                    {settings.about.image && <p className="text-xs text-muted-foreground mt-1">About image uploaded</p>}
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <Card className="p-4">
                <h2 className="text-xl font-semibold mb-4">Contact Section</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="contact-title">Section Label</Label>
                    <Input
                      id="contact-title"
                      value={settings.contact?.title || ""}
                      onChange={(e) => handleContactChange("title", e.target.value)}
                      placeholder="CONTACT"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-subtitle">Section Title</Label>
                    <Input
                      id="contact-subtitle"
                      value={settings.contact?.subtitle || ""}
                      onChange={(e) => handleContactChange("subtitle", e.target.value)}
                      placeholder="Contact Us"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-phone">Phone Numbers</Label>
                    <Input
                      id="contact-phone"
                      value={settings.contact?.phone || ""}
                      onChange={(e) => handleContactChange("phone", e.target.value)}
                      placeholder="1 (234) 567-891, 1 (234) 987-654"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-location">Location</Label>
                    <Textarea
                      id="contact-location"
                      value={settings.contact?.location || ""}
                      onChange={(e) => handleContactChange("location", e.target.value)}
                      placeholder="121 Rock Street, 21 Avenue, New York, NY 92103-9000"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-hours">Business Hours</Label>
                    <Input
                      id="contact-hours"
                      value={settings.contact?.hours || ""}
                      onChange={(e) => handleContactChange("hours", e.target.value)}
                      placeholder="Mon - Fri ......10 am - 8 pm, Sat, Sun ....... Closed"
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex gap-4 mt-6">
            <Button className="flex-1" size="lg" onClick={downloadFiles} variant="default">
              <Download className="h-4 w-4 mr-2" />
              Download Files
            </Button>

            <Button
              className="flex-1"
              size="lg"
              onClick={openPreviewInNewTab}
              variant="outline"
              disabled={isCreatingPreview}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Preview in Browser
            </Button>

            <Button
              className="flex-1"
              size="lg"
              onClick={() => {
                setDeployUrl(null)
                setDeployDialogOpen(true)
              }}
              variant="secondary"
            >
              <Rocket className="h-4 w-4 mr-2" />
              Deploy to Vercel
            </Button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <Card className="p-4 h-full">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <div className="border rounded-md h-[600px] overflow-auto">
              <Preview settings={settings} />
            </div>
          </Card>
        </div>
      </div>
      <DeployDialog
        open={deployDialogOpen}
        onOpenChange={setDeployDialogOpen}
        onDeploy={handleDeploy}
        deployUrl={deployUrl}
        isDeploying={isDeploying}
        isVerifyingDomain={isVerifyingDomain}
        domainVerificationError={domainVerificationError}
      />
    </main>
  )
}
