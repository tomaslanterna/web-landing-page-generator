import { type NextRequest, NextResponse } from "next/server"
import { generateHTML, generateCSS, generateJS } from "@/lib/generator"

export async function POST(request: NextRequest) {
  try {
    const { settings, projectName } = await request.json()

    if (!projectName) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 })
    }

    // Generar los archivos para el despliegue
    const html = generateHTML(settings)
    const css = generateCSS(settings)
    const js = generateJS(settings)

    // Crear un proyecto en Vercel y desplegarlo
    const deploymentData = await createVercelDeployment(projectName, html, css, js)

    return NextResponse.json(deploymentData)
  } catch (error) {
    console.error("Error deploying to Vercel:", error)
    return NextResponse.json(
      { error: "Failed to deploy to Vercel", details: (error as Error).message },
      { status: 500 },
    )
  }
}

async function createVercelDeployment(projectName: string, html: string, css: string, js: string) {
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

  if (!projectResponse.ok) {
    const projectError = await projectResponse.json()

    // Si el proyecto ya existe, continuamos con el despliegue
    if (projectError.error?.code !== "project_name_taken") {
      throw new Error(`Failed to create project: ${JSON.stringify(projectError)}`)
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

  // La URL del despliegue será algo como https://project-name.vercel.app
  return {
    deployUrl: `https://${projectName}.vercel.app`,
    deploymentId: deployData.id,
  }
}

