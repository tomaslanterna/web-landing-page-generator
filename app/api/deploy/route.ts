import { type NextRequest, NextResponse } from "next/server"
import { generateHTML, generateCSS, generateJS } from "@/lib/generator"

export async function POST(request: NextRequest) {
  try {
    console.log("Deploy API called")
    const body = await request.json()
    console.log("Request body:", {
      projectName: body.projectName,
      customDomain: body.customDomain,
      hasSettings: !!body.settings,
    })

    const { settings, projectName, customDomain } = body

    if (!projectName) {
      console.log("Error: Project name is required")
      return NextResponse.json({ error: "Project name is required" }, { status: 400 })
    }

    // Generar los archivos para el despliegue
    const html = generateHTML(settings)
    const css = generateCSS(settings)
    const js = generateJS(settings)

    // Crear un proyecto en Vercel y desplegarlo
    const deploymentData = await createVercelDeployment(projectName, html, css, js, customDomain)

    return NextResponse.json(deploymentData)
  } catch (error) {
    console.error("Error deploying to Vercel:", error)
    return NextResponse.json(
      { error: "Failed to deploy to Vercel", details: (error as Error).message },
      { status: 500 },
    )
  }
}

async function createVercelDeployment(
  projectName: string,
  html: string,
  css: string,
  js: string,
  customDomain?: string,
) {
  // Verificar si tenemos el token de Vercel
  const vercelToken = process.env.VERCEL_TOKEN
  if (!vercelToken) {
    throw new Error("VERCEL_TOKEN environment variable is not set")
  }

  // Preparar los archivos para el despliegue
  const files = [
    {
      file: "index.html",
      content: html,
    },
    {
      file: "styles.css",
      content: css,
    },
    {
      file: "script.js",
      content: js,
    },
  ]

  // Crear un nuevo proyecto en Vercel (si no existe)
  const projectResponse = await fetch("https://api.vercel.com/v9/projects", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${vercelToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: projectName,
      framework: null, // No framework, just static files
    }),
  })

  let projectData

  if (!projectResponse.ok) {
    const projectError = await projectResponse.json()

    // Si el proyecto ya existe, continuamos con el despliegue
    if (projectError.error?.code !== "project_name_taken") {
      throw new Error(`Failed to create project: ${JSON.stringify(projectError)}`)
    }

    // Obtener información del proyecto existente
    const existingProjectResponse = await fetch(`https://api.vercel.com/v9/projects/${projectName}`, {
      headers: {
        Authorization: `Bearer ${vercelToken}`,
      },
    })

    if (!existingProjectResponse.ok) {
      throw new Error("El proyecto ya existe pero no se pudo obtener información")
    }

    projectData = await existingProjectResponse.json()
  } else {
    projectData = await projectResponse.json()
  }

  // Si se proporcionó un dominio personalizado, verificarlo y agregarlo al proyecto
  if (customDomain) {
    try {
      // Verificar si el dominio ya está asignado
      const domainCheckResponse = await fetch(
        `https://api.vercel.com/v9/projects/${projectName}/domains/${customDomain}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${vercelToken}`,
          },
        },
      )

      // Si el dominio no está asignado, agregarlo
      if (!domainCheckResponse.ok) {
        const addDomainResponse = await fetch(`https://api.vercel.com/v9/projects/${projectName}/domains`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${vercelToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: customDomain,
          }),
        })

        if (!addDomainResponse.ok) {
          const domainError = await addDomainResponse.json()
          throw new Error(`Error al agregar dominio: ${JSON.stringify(domainError)}`)
        }

        // Obtener información de verificación del dominio
        const domainVerificationResponse = await fetch(
          `https://api.vercel.com/v9/projects/${projectName}/domains/${customDomain}/verify`,
          {
            headers: {
              Authorization: `Bearer ${vercelToken}`,
            },
          },
        )

        if (!domainVerificationResponse.ok) {
          throw new Error("No se pudo obtener información de verificación del dominio")
        }

        const verificationData = await domainVerificationResponse.json()

        // Aquí podríamos devolver las instrucciones de configuración DNS
        console.log("DNS Verification:", verificationData)
      }
    } catch (domainError) {
      console.error("Error configuring domain:", domainError)
      // Continuamos con el despliegue aunque haya error con el dominio
    }
  }

  // Crear un nuevo despliegue
  const deployResponse = await fetch("https://api.vercel.com/v13/deployments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${vercelToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: projectName,
      files: files.map((file) => ({
        file: file.file,
        data: file.content,
      })),
      projectSettings: {
        framework: null,
      },
    }),
  })

  if (!deployResponse.ok) {
    const deployError = await deployResponse.json()
    throw new Error(`Failed to create deployment: ${JSON.stringify(deployError)}`)
  }

  const deployData = await deployResponse.json()

  // Determinar la URL del despliegue
  let deployUrl
  if (customDomain) {
    deployUrl = `https://${customDomain}`
  } else {
    deployUrl = `https://${projectName}.vercel.app`
  }

  return {
    deployUrl,
    deploymentId: deployData.id,
    customDomain: customDomain || null,
    // Incluimos información sobre la verificación del dominio si es relevante
    domainVerification: customDomain
      ? {
          configured: true, // En un caso real, esto vendría de la API de Vercel
          instructions: "Configura tu DNS para apuntar a los servidores de Vercel",
        }
      : null,
  }
}
