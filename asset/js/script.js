document.addEventListener("DOMContentLoaded", () => {
  // Inicializar Feather Icons
  if (typeof feather !== "undefined") {
    feather.replace()
  }

  // Establecer año actual en el footer
  const currentYearElement = document.getElementById("current-year")
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear()
  }

  // Inicializar animación de partículas
  initParticleAnimation()

  // Actualizar barra de progreso en páginas de capítulos
  const progressBar = document.getElementById("progress-bar")
  if (progressBar) {
    updateProgressBar()
    window.addEventListener("scroll", updateProgressBar)
  }

  function updateProgressBar() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
    const scrolled = (winScroll / height) * 100
    progressBar.style.width = scrolled + "%"
  }

  // Animación de entrada para las secciones
  const fadeElems = document.querySelectorAll(".fade-in")
  if (fadeElems.length > 0) {
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      { threshold: 0.1 },
    )

    fadeElems.forEach((elem) => {
      fadeObserver.observe(elem)
    })
  }

  // Toggle de modo oscuro
  const themeToggle = document.getElementById("theme-toggle")

  if (themeToggle) {
    // Verificar preferencia guardada o preferencia del sistema
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.body.classList.add("dark")
      updateThemeIcon(true)
    }

    themeToggle.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark")

      if (isDark) {
        localStorage.setItem("theme", "dark")
      } else {
        localStorage.setItem("theme", "light")
      }

      updateThemeIcon(isDark)
    })
  }

  function updateThemeIcon(isDark) {
    const themeIcon = document.getElementById("theme-icon")
    if (!themeIcon) return

    if (isDark) {
      themeIcon.setAttribute("data-feather", "sun")
    } else {
      themeIcon.setAttribute("data-feather", "moon")
    }

    if (typeof feather !== "undefined") {
      feather.replace()
    }
  }

  // Menú de navegación móvil
  const menuToggle = document.getElementById("menu-toggle")
  const sidebar = document.getElementById("sidebar")
  const overlay = document.getElementById("overlay")

  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open")
      if (overlay) {
        overlay.classList.toggle("active")
      }
      document.body.classList.toggle("menu-open")
    })

    if (overlay) {
      overlay.addEventListener("click", () => {
        sidebar.classList.remove("open")
        overlay.classList.remove("active")
        document.body.classList.remove("menu-open")
      })
    }
  }

  // Toggle de sidebar
  const sidebarToggle = document.getElementById("sidebar-toggle")

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      document.body.classList.toggle("sidebar-collapsed")

      const isCollapsed = document.body.classList.contains("sidebar-collapsed")

      if (isCollapsed) {
        sidebarToggle.querySelector("i").setAttribute("data-feather", "chevron-right")
      } else {
        sidebarToggle.querySelector("i").setAttribute("data-feather", "chevron-left")
      }

      if (typeof feather !== "undefined") {
        feather.replace()
      }
    })
  }

  // Acordeón para el menú lateral
  const accordionToggles = document.querySelectorAll(".accordion-toggle")

  if (accordionToggles.length > 0) {
    accordionToggles.forEach((toggle) => {
      toggle.addEventListener("click", function () {
        this.classList.toggle("active")
        const content = this.nextElementSibling

        if (content.style.maxHeight) {
          content.style.maxHeight = null
        } else {
          content.style.maxHeight = content.scrollHeight + "px"
        }
      })
    })
  }

  // Inicializar pestañas en el dashboard
  const tabButtons = document.querySelectorAll(".tab-button")

  if (tabButtons.length > 0) {
    tabButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const tabId = this.getAttribute("data-tab")

        // Desactivar todas las pestañas
        document.querySelectorAll(".tab-button").forEach((btn) => {
          btn.classList.remove("active")
        })

        document.querySelectorAll(".tab-content").forEach((content) => {
          content.classList.remove("active")
        })

        // Activar la pestaña seleccionada
        this.classList.add("active")
        document.getElementById(tabId).classList.add("active")
      })
    })

    // Activar la primera pestaña por defecto
    if (tabButtons.length > 0 && !tabButtons[0].classList.contains("active")) {
      tabButtons[0].click()
    }
  }
})

// Inicializar animación de partículas
function initParticleAnimation() {
  const canvas = document.getElementById("particleCanvas")
  if (!canvas) return

  const ctx = canvas.getContext("2d")

  // Establecer dimensiones del canvas
  function setCanvasDimensions() {
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
  }

  setCanvasDimensions()
  window.addEventListener("resize", setCanvasDimensions)

  // Crear partículas
  const particles = []
  const particleCount = 30

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width
      this.y = Math.random() * canvas.height
      this.size = Math.random() * 3 + 1
      this.speedX = Math.random() * 1 - 0.5
      this.speedY = Math.random() * 1 - 0.5
      this.color = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.2})`
    }

    update() {
      this.x += this.speedX
      this.y += this.speedY

      if (this.x > canvas.width) this.x = 0
      else if (this.x < 0) this.x = canvas.width

      if (this.y > canvas.height) this.y = 0
      else if (this.y < 0) this.y = canvas.height
    }

    draw() {
      ctx.fillStyle = this.color
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  function init() {
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }
  }

  function connectParticles() {
    const maxDistance = 100

    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x
        const dy = particles[a].y - particles[b].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < maxDistance) {
          const opacity = 1 - distance / maxDistance
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.3})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(particles[a].x, particles[a].y)
          ctx.lineTo(particles[b].x, particles[b].y)
          ctx.stroke()
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < particles.length; i++) {
      particles[i].update()
      particles[i].draw()
    }

    connectParticles()
    requestAnimationFrame(animate)
  }

  init()
  animate()
}

