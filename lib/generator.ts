interface Settings {
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
  navItems?: { [key: string]: string } // Nuevos nombres para los items de navegación
  features: {
    title: string
    description: string
    image: string
    link?: string // Nuevo campo para el deeplink
  }[]
  featuresSection?: {
    title: string
    subtitle: string
  }
  hero: {
    title: string
    description: string
    pills: string[]
    backgroundImage: string
  }
  about: {
    title: string
    description: string
    image: string
  }
  contact?: {
    phone: string
    location: string
    hours: string
    title?: string
    subtitle?: string
  }
}

export function generateHTML(settings: Settings): string {
  const { layout, title, description, sections, singlePage, images, hero, about, contact } = settings

  // Generate navigation based on layout
  let navigation = ""
  let mainContent = ""

  // Create navigation links
  const navLinks = sections
    .map((section) => {
      const customName = settings.navItems?.[section]
      const displayName = customName || capitalizeFirstLetter(section)
      return `<a href="${singlePage ? `#${section}` : `${section}.html`}" class="nav-link">${displayName}</a>`
    })
    .join("\n")

  // Create navigation based on layout type
  switch (layout) {
    case "top-navbar":
      navigation = `
        <nav class="navbar">
          <div class="logo">${title}</div>
          <div class="nav-links">
            ${navLinks}
          </div>
        </nav>
      `
      break
    case "left-sidebar":
    case "right-sidebar":
      const sideClass = layout === "left-sidebar" ? "left-sidebar" : "right-sidebar"
      navigation = `
        <nav class="sidebar ${sideClass}">
          <div class="sidebar-header">
            <div class="logo">${title}</div>
            <button class="sidebar-toggle" aria-label="Toggle Sidebar">
              <span class="toggle-icon"></span>
            </button>
          </div>
          <div class="nav-links">
            ${navLinks}
          </div>
        </nav>
      `
      break
  }

  // Create mobile tabBar
  const mobileTabBar = `
    <div class="mobile-tabbar">
      ${navLinks}
    </div>
  `

  // Generate content sections
  const contentSections = sections
    .map((section, index) => {
      if (section === "hero") {
        return `
        <section id="${section}" class="hero-section full-width">
          <div class="hero-overlay"></div>
          <div class="hero-content">
            <h1>${hero?.title || title}</h1>
            <p class="hero-description">${hero?.description || description}</p>
            <div class="tags-container">
              ${
                hero?.pills?.map((pill) => `<span class="tag">${pill}</span>`).join("") ||
                `
                <span class="tag">Designer</span>
                <span class="tag">Product Designer</span>
                <span class="tag">Marketing</span>
                <span class="tag">Full Stack Developer</span>
              `
              }
            </div>
          </div>
          ${
            hero?.backgroundImage
              ? `<img src="${hero.backgroundImage}" alt="Hero background" class="hero-background">`
              : images[0]
                ? `<img src="${images[0]}" alt="Hero background" class="hero-background">`
                : '<div class="hero-background placeholder-image">Hero Image</div>'
          }
        </section>
      `
      } else if (section === "features") {
        return `
    <section id="features" class="features-section full-width">
      <div class="features-container">
        <div class="features-header">
          <span class="features-label">${settings.featuresSection?.title || "FEATURES"}</span>
          <h2>${settings.featuresSection?.subtitle || "Our Features & Services."}</h2>
        </div>
        <div class="features-grid">
          ${settings.features
            .map(
              (feature) => `
            <div class="feature-card">
              <div class="feature-image">
                ${
                  feature.image
                    ? `<img src="${feature.image}" alt="${feature.title}">`
                    : `<div class="feature-image-placeholder"></div>`
                }
              </div>
              <h3>${feature.title}</h3>
              <p>${feature.description}</p>
              <a href="${feature.link || "#"}" class="feature-button" ${feature.link ? 'target="_blank" rel="noopener noreferrer"' : ""}>MORE</a>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    </section>
  `
      } else if (section === "about") {
        return `
        <section id="about" class="about-section full-width">
          <div class="about-container">
            <div class="about-content">
              <h2>${about?.title || "nice to meet you"}</h2>
              <p>${about?.description || description}</p>
            </div>
            <div class="about-image">
              ${
                about?.image
                  ? `<img src="${about.image}" alt="About us">`
                  : images[Math.min(1, images.length - 1)]
                    ? `<img src="${images[Math.min(1, images.length - 1)]}" alt="About us">`
                    : `<div class="about-image-placeholder">About Image</div>`
              }
            </div>
          </div>
        </section>
      `
      } else if (section === "contact") {
        return `
<section id="contact" class="contact-section full-width full-height">
  <div class="contact-container">
    <div class="contact-header">
      <span class="contact-label">${settings.contact?.title || "CONTACT"}</span>
      <h2>${settings.contact?.subtitle || "Contact Us"}</h2>
    </div>
    <div class="contact-content">
      <div class="contact-form">
        <form>
          <input type="text" placeholder="Enter your Name" required>
          <input type="email" placeholder="Enter a valid email address" required>
          <textarea placeholder="Message" rows="6"></textarea>
          <button type="submit" class="submit-button">SUBMIT</button>
        </form>
      </div>
    </div>
  </div>
</section>
`
      } else {
        const imageHtml = images[index % images.length]
          ? `<div class="image-container"><img src="${images[index % images.length]}" alt="${section}" class="section-image"></div>`
          : `<div class="image-container"><div class="placeholder-image">${capitalizeFirstLetter(section)} Image</div></div>`

        return `
      <section id="${section}" class="section full-width">
        <div class="section-content">
          <h2>${capitalizeFirstLetter(section)}</h2>
          <p>${description}</p>
          ${imageHtml}
        </div>
      </section>
    `
      }
    })
    .join("\n")

  // Combine everything
  mainContent = `
    <div class="main-content ${layout}">
      ${contentSections}
    </div>
  `

  // Final HTML
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <link rel="stylesheet" href="styles.css">
      <link href="https://fonts.googleapis.com/css2?family=${settings.fontFamily.replace(" ", "+")}&display=swap" rel="stylesheet">
    </head>
    <body>
      <div class="container ${layout}">
        ${navigation}
        ${mobileTabBar}
        ${mainContent}
      </div>
      <script src="script.js"></script>
    </body>
    </html>
  `
}

export function generateCSS(settings: Settings): string {
  const { layout, primaryColor, secondaryColor, backgroundColor, textColor, fontFamily } = settings

  const heroStyles = `
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.5) 30%,
    rgba(0, 0, 0, 0.3) 60%,
    rgba(0, 0, 0, 0.1) 100%
  );
  z-index: 2;
}

.hero-content {
  position: relative;
  z-index: 3;
  max-width: 600px;
  margin-left: 10%;
  color: white;
  padding: 2rem 0;
}

.hero-content h1 {
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  line-height: 1.1;
}

.hero-description {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.search-container {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.search-input {
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  background: white;
}

.search-button {
  padding: 1rem 2rem;
  border: none;
  border-radius: 4px;
  background-color: ${secondaryColor};
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-button:hover {
  background-color: ${adjustColor(secondaryColor, -20)};
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tag {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 100px;
  font-size: 0.875rem;
  color: white;
  backdrop-filter: blur(4px);
}

@media (max-width: 768px) {
  .hero-content {
    margin: 0 1.5rem;
    padding-top: 6rem; /* Add space for the fixed navbar */
  }

  .hero-content h1 {
    font-size: 2.5rem;
  }

  .search-container {
    flex-direction: column;
  }

  .tags-container {
    justify-content: center;
  }
  
  .tag {
    font-size: 0.75rem;
    padding: 0.4rem 0.8rem;
  }
}

@media (max-width: 480px) {
  .hero-content h1 {
    font-size: 2rem;
  }
  
  .hero-description {
    font-size: 1rem;
  }
  
  .search-input, .search-button {
    padding: 0.75rem 1rem;
  }
}
`

  const featuresStyles = `
  .features-section {
    padding: 5rem 2rem;
    background-color: ${secondaryColor}20;
  }

  .features-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .features-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .features-label {
    color: ${primaryColor};
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    display: block;
    margin-bottom: 1rem;
  }

  .features-header h2 {
    font-size: 2.5rem;
    color: #2c5282;
    margin: 0;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    padding: 1rem;
  }

  .feature-card {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }

  .feature-image {
    width: 200px;
    height: 200px;
    margin: 0 auto 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .feature-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .feature-image-placeholder {
    width: 100%;
    height: 100%;
    background-color: ${secondaryColor}20;
    border-radius: 0.5rem;
  }

  .feature-card h3 {
    color: #2d3748;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .feature-card p {
    color: #718096;
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }

  .feature-button {
    background-color: ${primaryColor};
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .feature-button:hover {
    background-color: ${adjustColor(primaryColor, -20)};
  }

  @media (max-width: 768px) {
    .features-section {
      padding: 3rem 1.5rem;
    }
    
    .features-header h2 {
      font-size: 2rem;
    }

    .features-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .feature-card {
      padding: 1.5rem;
    }
    
    .feature-image {
      width: 150px;
      height: 150px;
    }
  }
  
  @media (max-width: 480px) {
    .features-section {
      padding: 2rem 1rem;
    }
    
    .features-header h2 {
      font-size: 1.75rem;
    }
    
    .feature-card h3 {
      font-size: 1.25rem;
    }
    
    .feature-card p {
      font-size: 0.9rem;
    }
    
    .feature-button {
      padding: 0.6rem 1.5rem;
      font-size: 0.9rem;
    }
  }
`

  const aboutStyles = `
  .about-section {
    padding: 0;
    margin: 0;
    background: ${backgroundColor};
    display: flex;
    align-items: center;
  }

  .about-container {
    display: flex;
    width: 100%;
    min-height: 600px;
    margin: 0;
    padding: 0;
  }

  .about-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 5rem;
    background-color: ${adjustColor(backgroundColor, -10)};
  }

  .about-content h2 {
    font-size: 3.5rem;
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 2rem;
    color: ${textColor};
  }

  .about-content p {
    font-size: 1.125rem;
    line-height: 1.8;
    color: ${adjustColor(textColor, 20)};
    max-width: 600px;
  }

  .about-image {
    flex: 1;
    position: relative;
    background-color: ${adjustColor(backgroundColor, 10)};
    overflow: hidden;
  }

  .about-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .about-image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${secondaryColor}20;
    color: ${textColor};
    font-size: 1.5rem;
  }

  @media (max-width: 992px) {
    .about-content {
      padding: 4rem 3rem;
    }
    
    .about-content h2 {
      font-size: 3rem;
    }
  }

  @media (max-width: 768px) {
    .about-section {
      min-height: auto;
      padding: 4rem 0;
    }
    
    .about-container {
      flex-direction: column;
      min-height: auto;
    }

    .about-content {
      padding: 3rem 2rem;
      order: 2;
    }

    .about-content h2 {
      font-size: 2.5rem;
      text-align: center;
    }
    
    .about-content p {
      text-align: center;
      margin: 0 auto;
    }

    .about-image {
      min-height: 300px;
      order: 1;
    }
  }
  
  @media (max-width: 480px) {
    .about-section {
      padding: 3rem 0;
    }
    
    .about-content {
      padding: 2rem 1.5rem;
    }
    
    .about-content h2 {
      font-size: 2rem;
    }
    
    .about-content p {
      font-size: 1rem;
    }
    
    .about-image {
      min-height: 250px;
    }
  }
`

  const contactStyles = `
  .contact-section {
    padding: 0;
    margin: 0;
    background-color: #f8f9fa;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
  }

  .contact-container {
    width: 100%;
    max-width: 1200px;
    margin: 5rem auto;
    padding: 0;
  }

  .contact-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .contact-label {
    color: ${primaryColor};
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    display: block;
    margin-bottom: 1rem;
  }

  .contact-header h2 {
    font-size: 2.5rem;
    color: #2c5282;
    margin: 0;
  }

  .contact-content {
    display: flex;
    width: 100%;
    min-height: 600px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }

  .contact-info {
    flex: 1;
    position: relative;
    background-color: white;
    overflow: hidden;
  }

  .contact-info-shape {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 200px;
    background-color: ${primaryColor};
    border-radius: 0 0 50% 0;
  }

  .contact-info-content {
    position: relative;
    z-index: 2;
    padding: 3rem 2rem;
    color: ${textColor};
  }

  .contact-info-item {
    margin-bottom: 2.5rem;
  }

  .contact-info-item h3 {
    color: ${primaryColor};
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .contact-info-item p {
    font-size: 1rem;
    line-height: 1.6;
  }

  .contact-form {
    flex: 1;
    padding: 3rem 2rem;
    background-color: #f1f1f1;
    display: flex;
    flex-direction: column;
  }

  .contact-form form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .contact-form input,
  .contact-form textarea {
    padding: 1rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    background: white;
  }

  .contact-form textarea {
    resize: none;
    min-height: 150px;
  }

  .submit-button {
    margin-top: 1rem;
    padding: 1rem;
    border: none;
    border-radius: 4px;
    background-color: ${primaryColor};
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;
    text-transform: uppercase;
  }

  .submit-button:hover {
    background-color: ${adjustColor(primaryColor, -20)};
  }

  @media (max-width: 992px) {
    .contact-container {
      max-width: 90%;
    }
  }

  @media (max-width: 768px) {
    .contact-section {
      padding: 3rem 0;
    }
    
    .contact-content {
      flex-direction: column;
      min-height: auto;
    }

    .contact-info,
    .contact-form {
      width: 100%;
    }
    
    .contact-info-shape {
      height: 150px;
    }
  }
  
  @media (max-width: 480px) {
    .contact-section {
      padding: 2rem 0;
    }
    
    .contact-info-content,
    .contact-form {
      padding: 2rem 1.5rem;
    }
    
    .contact-header h2 {
      font-size: 1.75rem;
    }
    
    .contact-info-item h3 {
      font-size: 0.9rem;
    }
    
    .contact-info-item p {
      font-size: 0.9rem;
    }
  }
`

  const sidebarStyles = `
    /* Sidebar Styles */
    .sidebar {
      position: fixed;
      top: 0;
      height: 100vh;
      width: 220px;
      background-color: transparent;
      color: white;
      z-index: 1000;
      transition: transform 0.3s ease, width 0.3s ease;
      display: flex;
      flex-direction: column;
      padding: 0;
    }
    
    .sidebar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .sidebar .logo {
      margin-bottom: 0;
    }
    
    .sidebar-toggle {
      background: transparent;
      border: none;
      color: white;
      cursor: pointer;
      width: 24px;
      height: 24px;
      position: relative;
      padding: 0;
    }
    
    .toggle-icon, .toggle-icon:before, .toggle-icon:after {
      content: '';
      display: block;
      width: 24px;
      height: 2px;
      background: white;
      position: absolute;
      transition: all 0.3s ease;
    }
    
    .toggle-icon:before {
      top: -6px;
    }
    
    .toggle-icon:after {
      bottom: -6px;
    }
    
    .sidebar.collapsed .toggle-icon {
      background: transparent;
    }
    
    .sidebar.collapsed .toggle-icon:before {
      transform: rotate(45deg);
      top: 0;
    }
    
    .sidebar.collapsed .toggle-icon:after {
      transform: rotate(-45deg);
      bottom: 0;
    }
    
    .sidebar .nav-links {
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
      gap: 1rem;
      overflow-y: auto;
    }
    
    .sidebar .nav-link {
      color: white;
      text-decoration: none;
      padding: 0.5rem 0;
      transition: color 0.3s ease;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .sidebar .nav-link:hover {
      color: ${secondaryColor};
    }
    
    /* Collapsed sidebar styles */
    .sidebar.collapsed {
      width: 60px;
    }
    
    .sidebar.collapsed .logo,
    .sidebar.collapsed .nav-link span {
      display: none;
    }
    
    .left-sidebar {
      left: 0;
    }
    
    .right-sidebar {
      right: 0;
    }
    
    .sidebar.collapsed.left-sidebar + .main-content {
      margin-left: 60px;
    }
    
    .sidebar.collapsed.right-sidebar + .main-content {
      margin-right: 60px;
    }
    
    /* Main content adjustment for sidebar */
    .main-content.left-sidebar {
      margin-left: 220px;
    }
    
    .main-content.right-sidebar {
      margin-right: 220px;
    }
    
    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
        width: 100%;
      }
      
      .right-sidebar {
        transform: translateX(100%);
      }
      
      .sidebar.mobile-open {
        transform: translateX(0);
      }
      
      .main-content.left-sidebar,
      .main-content.right-sidebar {
        margin-left: 0;
        margin-right: 0;
      }
    }
  `

  return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: '${fontFamily}', sans-serif;
      color: ${textColor};
      background-color: ${backgroundColor};
      overflow-x: hidden;
    }
    
    .container {
      display: flex;
      min-height: 100vh;
      ${layout === "top-navbar" ? "flex-direction: column;" : "flex-direction: row;"}
      width: 100%;
    }
    
    /* Full width section styles */
    .full-width {
      width: 100vw;
      max-width: 100%;
      margin-left: calc(-50vw + 50%);
      margin-right: calc(-50vw + 50%);
      position: relative;
    }
    
    /* Navigation Styles */
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background-color: transparent;
      color: white;
      width: 100%;
      z-index: 1000;
      position: fixed;
      top: 0;
      left: 0;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0) 100%);
    }

    .navbar .logo {
      font-weight: bold;
      font-size: 1.5rem;
    }

    .navbar .nav-links {
      display: flex;
      gap: 1.5rem;
    }

    .navbar .nav-link {
      color: white;
      text-decoration: none;
      transition: opacity 0.3s ease;
    }

    .navbar .nav-link:hover {
      opacity: 0.8;
    }

    /* Mobile TabBar */
    .mobile-tabbar {
      display: none;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 100%);
      padding: 0.75rem 1rem;
      z-index: 1000;
      justify-content: space-around;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .mobile-tabbar .nav-link {
      color: white;
      text-decoration: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 0.75rem;
      opacity: 0.7;
      transition: opacity 0.3s ease;
    }

    .mobile-tabbar .nav-link.active {
      opacity: 1;
    }

    .mobile-tabbar .nav-link:before {
      content: '';
      display: block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: white;
      margin-bottom: 5px;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .mobile-tabbar .nav-link.active:before {
      opacity: 1;
    }

    /* Mobile menu button */
    .mobile-menu-button {
      display: none;
      background: transparent;
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
    }
    
    ${sidebarStyles}
    
    /* Content Styles */
    .main-content {
      flex: 1;
      width: 100%;
      transition: margin 0.3s ease;
    }
    
    .section {
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      margin-bottom: 0;
      background-color: white;
    }
    
    .section-content {
      max-width: 1200px;
      margin: 0 auto;
      text-align: center;
      width: 100%;
    }
    
    .section h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: ${primaryColor};
    }
    
    .section p {
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 2rem;
    }
    
    /* Image Styles */
    .image-container {
      margin-top: 2rem;
      overflow: hidden;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      max-width: 100%;
    }
    
    .image-container:hover {
      transform: scale(1.03);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
    
    .section-image {
      width: 100%;
      max-height: 400px;
      object-fit: cover;
      display: block;
    }
    
    .placeholder-image {
      width: 100%;
      height: 300px;
      background-color: ${secondaryColor};
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }
    
    /* Responsive Styles */
    @media (max-width: 768px) {
      .navbar {
        padding: 1rem;
      }
      
      .navbar .nav-links {
        display: none;
      }
      
      .mobile-menu-button {
        display: block;
      }
      
      .mobile-tabbar {
        display: flex;
      }
      
      .hero-content h1 {
        font-size: 2.5rem;
      }
      
      .hero-description {
        font-size: 1rem;
      }
      
      .search-container {
        flex-direction: column;
      }
      
      .features-grid {
        grid-template-columns: 1fr;
      }
      
      .about-container {
        flex-direction: column;
      }
      
      .about-content, .about-image {
        width: 100%;
      }
      
      .about-content h2 {
        font-size: 2rem;
      }
      
      /* Add padding to the bottom to account for the tabBar */
      body {
        padding-bottom: 60px;
      }
    }

    @media (max-width: 480px) {
      .hero-content h1 {
        font-size: 2rem;
      }
      
      .hero-content {
        margin-left: 5%;
        margin-right: 5%;
      }
      
      .feature-card {
        padding: 1rem;
      }
      
      .about-content {
        padding: 2rem 1rem;
      }
      
      .about-content h2 {
        font-size: 2rem;
      }
    }

    ${heroStyles}
    ${featuresStyles}
    ${aboutStyles}
    ${contactStyles}
  `
}

export function generateJS(settings: Settings): string {
  return `
    // Smooth scrolling for anchor links and mobile tabBar functionality
    document.addEventListener('DOMContentLoaded', function() {
      const navLinks = document.querySelectorAll('.nav-link');
      const tabBarLinks = document.querySelectorAll('.mobile-tabbar .nav-link');
      
      // Function to set active tab
      function setActiveTab(id) {
        tabBarLinks.forEach(link => {
          if (link.getAttribute('href') === '#' + id || link.getAttribute('href') === id + '.html') {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
      
      // Set initial active tab
      if (tabBarLinks.length > 0) {
        const firstSection = document.querySelector('section');
        if (firstSection) {
          setActiveTab(firstSection.id);
        }
      }
      
      // Handle scroll to set active tab based on visible section
      window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        let currentSection = '';
        
        sections.forEach(section => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.clientHeight;
          if (window.pageYOffset >= (sectionTop - 200)) {
            currentSection = section.id;
          }
        });
        
        if (currentSection) {
          setActiveTab(currentSection);
        }
      });
      
      // Handle clicks on nav links
      navLinks.forEach(link => {
        if (link.getAttribute('href').startsWith('#')) {
          link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
              window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
              });
              
              // Set active tab
              setActiveTab(targetId);
            }
          });
        }
      });
      
      // Image hover effects
      const images = document.querySelectorAll('.image-container');
      
      images.forEach(image => {
        image.addEventListener('mouseenter', function() {
          this.style.transform = 'scale(1.03)';
          this.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
        });
        
        image.addEventListener('mouseleave', function() {
          this.style.transform = 'scale(1)';
          this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        });
      });

      // Sidebar toggle functionality
      const sidebarToggles = document.querySelectorAll('.sidebar-toggle');
      
      sidebarToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
          const sidebar = this.closest('.sidebar');
          sidebar.classList.toggle('collapsed');
          
          // Update main content margin
          const mainContent = document.querySelector('.main-content');
          if (sidebar.classList.contains('left-sidebar')) {
            mainContent.style.marginLeft = sidebar.classList.contains('collapsed') ? '60px' : '220px';
          } else if (sidebar.classList.contains('right-sidebar')) {
            mainContent.style.marginRight = sidebar.classList.contains('collapsed') ? '60px' : '220px';
          }
        });
      });

      // Mobile sidebar toggle
      const mobileToggle = document.createElement('button');
      mobileToggle.className = 'mobile-sidebar-toggle';
      mobileToggle.innerHTML = '<span></span><span></span><span></span>';
      document.body.appendChild(mobileToggle);
      
      mobileToggle.addEventListener('click', function() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('mobile-open');
      });

      // Handle window resize
      window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
          const sidebar = document.querySelector('.sidebar');
          if (sidebar) {
            sidebar.classList.remove('collapsed');
            sidebar.classList.remove('mobile-open');
          }
          
          const mainContent = document.querySelector('.main-content');
          if (mainContent) {
            mainContent.style.marginLeft = '0';
            mainContent.style.marginRight = '0';
          }
        }
      });
      
      // Add responsive behavior for the hero section
      const adjustHeroHeight = () => {
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
          if (window.innerWidth <= 768) {
            heroSection.style.minHeight = 'calc(100vh - 60px)'; // Account for tabBar
          } else {
            heroSection.style.minHeight = '100vh';
          }
        }
      };
      
      adjustHeroHeight();
      window.addEventListener('resize', adjustHeroHeight);
    });
  `
}

// Helper function to generate separate HTML files for each section
export function generateSeparatePages(settings: Settings): { [key: string]: string } {
  const { sections } = settings
  const pages: { [key: string]: string } = {}

  // Generate the main index.html
  pages["index.html"] = generateHTML({
    ...settings,
    sections: [sections[0]], // Only include the first section (usually hero)
  })

  // Generate separate HTML files for each section
  sections.forEach((section) => {
    if (section !== sections[0]) {
      // Skip the first section as it's already in index.html
      pages[`${section}.html`] = generateHTML({
        ...settings,
        sections: [section],
      })
    }
  })

  return pages
}

// Helper function
function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function adjustColor(color: string, amount: number): string {
  const hex = color.replace("#", "")
  const num = Number.parseInt(hex, 16)
  const r = Math.min(255, Math.max(0, (num >> 16) + amount))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount))
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`
}

