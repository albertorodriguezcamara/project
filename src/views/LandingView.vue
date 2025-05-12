<template>
  <div>
    <header>
      <div class="container">
        <div class="header-content">
          <a href="#" class="logo">
            <img src="../assets/logo.png" alt="Rutina.es" class="logo-img" />
          </a>
          <nav class="nav-links">
            <a href="#features" class="nav-link">Características</a>
            <a href="#how-it-works" class="nav-link">Cómo funciona</a>
            <a href="#pricing" class="nav-link">Precios</a>
            <a href="/login" class="nav-link">Iniciar sesión</a>
            <a href="/register" class="btn btn-primary">Registrarse</a>
          </nav>
          <button class="mobile-menu-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </header>
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1><span>TU ENTRENADOR</span><br>PERSONAL DIGITAL</h1>
            <p>
              Rutina.es te ayuda a crear, gestionar y seguir tus rutinas de entrenamiento de forma sencilla. Disponible en móvil y escritorio para que nunca pierdas el ritmo.
            </p>
            <div class="hero-buttons">
              <a href="/register" class="btn btn-primary">COMENZAR GRATIS</a>
              <a href="#how-it-works" class="btn btn-secondary">CÓMO FUNCIONA</a>
            </div>
          </div>
          <div class="hero-image">
            <div class="device-mockup-container">
              <img src="/img/rutina-logo.svg" alt="Rutina.es App" class="device-mockup">
              <div class="fitness-elements">
                <div class="fitness-element dumbell"></div>
                <div class="fitness-element kettlebell"></div>
                <div class="fitness-element pulse"></div>
                <div class="fitness-element stopwatch"></div>
                <div class="fitness-element weight"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="hero-wave">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#f3f4f6" fill-opacity="1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
      </div>
    </section>
    <!-- Features Section -->
    <section id="features" class="features">
      <div class="container">
        <div class="section-header">
          <h2>Todo lo que necesitas para tus entrenamientos</h2>
          <p>Rutina.es ofrece todas las herramientas necesarias para que puedas planificar, seguir y mejorar tus entrenamientos.</p>
        </div>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <!-- SVG ICON -->
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m4 0h-1V8h-1m-4 0h1v4h1m-4 0h1v4h1"/></svg>
            </div>
            <h3>Seguimiento en tiempo real</h3>
            <p>Registra tus entrenamientos en tiempo real con nuestro temporizador integrado y control de series.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <!-- SVG ICON -->
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
            </div>
            <h3>Biblioteca de ejercicios</h3>
            <p>Accede a nuestra amplia biblioteca de ejercicios con descripciones detalladas y técnicas correctas.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <!-- SVG ICON -->
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3"/></svg>
            </div>
            <h3>Análisis de progreso</h3>
            <p>Visualiza tu progreso con gráficos detallados y estadísticas para optimizar tus entrenamientos.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <!-- SVG ICON -->
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
            </div>
            <h3>Planificación de mesociclos</h3>
            <p>Organiza tus entrenamientos en mesociclos para una planificación a largo plazo y mejores resultados.</p>
          </div>
        </div>
      </div>
    </section>
    <!-- CTA Section -->
    <section class="cta">
      <div class="container">
        <div class="cta-content">
          <h2>POTENCIA TU ENTRENAMIENTO</h2>
          <p>Únete a miles de atletas que ya están transformando su rutina con nuestra plataforma. <strong>¡100% GRATIS!</strong></p>
          <a href="/register" class="btn btn-primary">EMPIEZA HOY MISMO</a>
        </div>
      </div>
    </section>
    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <a href="#" class="logo">
              <img src="../assets/logo.png" alt="Rutina.es" class="footer-logo" />
            </a>
            <p class="footer-slogan">TRAIN HARD. LIVE STRONG.</p>
          </div>
          <div class="footer-links">
            <div class="footer-links-column">
              <h4>Producto</h4>
              <ul>
                <li><a href="#features">Características</a></li>
                <li><a href="#pricing">Precios</a></li>
                <li><a href="#">Testimonios</a></li>
                <li><a href="#">Novedades</a></li>
              </ul>
            </div>
            <div class="footer-links-column">
              <h4>Empresa</h4>
              <ul>
                <li><a href="#">Sobre nosotros</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Contacto</a></li>
                <li><a href="#">Empleo</a></li>
              </ul>
            </div>
            <div class="footer-links-column">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Política de privacidad</a></li>
                <li><a href="#">Términos de servicio</a></li>
                <li><a href="#">Cookies</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2025 Rutina.es. Todos los derechos reservados.</p>
          <div class="social-links">
            <a href="#" class="social-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="#" class="social-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="#" class="social-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// No necesitamos importar estilos externos, los definimos aquí
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700&display=swap');

:root {
  /* Colores base */
  --navy: #1F2D48;
  --navy-dark: #141E32;
  --brick-red: #A52A2A;
  --brick-red-dark: #8B2323;
  --pure-white: #FFFFFF;
  --deep-black: #111111;
  --gold-accent: #FFD700;
  --silver-accent: #C0C0C0;

  /* Colores de texto */
  --text-primary: var(--deep-black);
  --text-secondary: rgba(255, 255, 255, 0.8);
  --text-light: var(--pure-white);
  --text-highlight: var(--gold-accent);

  /* Colores de fondo */
  --bg-primary: var(--pure-white);
  --bg-secondary: var(--navy);
  --bg-accent: var(--brick-red);

  /* Gradientes atléticos */
  --gradient-hero: linear-gradient(135deg, var(--navy) 0%, var(--navy-dark) 100%), url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M0 0h20v20H0V0zm20 20h20v20H20V20zm40 0h20v20H60V20zm20 20h20v20H80V40zm-20 0h20v20H60V40zm-40 0h20v20H20V40zm60 40h20v20H80V80zm-20 0h20v20H60V80zm-40 0h20v20H20V80zm60-80h20v20H80V0z'/%3E%3C/g%3E%3C/svg%3E");
  --gradient-red: linear-gradient(135deg, var(--brick-red) 0%, var(--brick-red-dark) 100%);
  --gradient-accent: linear-gradient(45deg, var(--brick-red) 0%, var(--navy) 100%);
  --gradient-gold: linear-gradient(135deg, var(--gold-accent) 0%, #FFA500 100%);

  /* Sombras y efectos */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.15);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.2);
  --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.25);
  --shadow-xl: 0 12px 24px rgba(0, 0, 0, 0.3);
  --shadow-inner: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  --text-shadow-strong: 2px 2px 0px rgba(0, 0, 0, 0.3);

  /* Bordes y efectos atléticos */
  --border-athletic: 4px solid var(--brick-red);
  --border-gold: 2px solid var(--gold-accent);
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;

  /* Transiciones */
  --transition-fast: 0.2s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;
  --transition-bounce: 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);

  /* Patrones y texturas */
  --pattern-dots: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E");
  --pattern-grid: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M0 0h40v40H0V0zm20 20h20v20H20V20zm0-20h20v20H20V0zM0 20h20v20H0V20z'/%3E%3C/g%3E%3C/svg%3E");
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Header Styles */
header {
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 0;
}

.logo {
  display: flex;
  align-items: center;
  font-weight: 800;
  font-size: 1.5rem;
  color: var(--gray-900);
  text-decoration: none;
  position: relative;
  padding: 0.5rem;
}

.logo::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--brick-red);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
}

.logo:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

.logo-img {
  height: 4.5rem;
  width: auto;
  margin-right: 0.5rem;
  transition: transform 0.3s ease;
}

.logo:hover .logo-img {
  transform: scale(1.05);
}

.logo-text {
  font-weight: 900;
  font-size: 1.75rem;
  letter-spacing: -0.5px;
  color: var(--gray-900);
}

.logo-dot {
  color: var(--primary);
  font-weight: 900;
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  color: var(--text-light);
  text-decoration: none;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.9rem;
  padding: 0.75rem 1.25rem;
  border-radius: var(--border-radius-sm);
  transition: var(--transition-normal);
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--brick-red);
  transition: var(--transition-normal);
  transform: translateX(-50%);
}

.nav-link:hover {
  color: var(--pure-white);
}

.nav-link:hover::after {
  width: 80%;
}

.nav-link:hover {
  color: var(--brick-red);
  background: rgba(255, 255, 255, 0.1);
}

.nav-link {
  color: var(--gray-600);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: var(--primary);
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  border-radius: 0.375rem;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.4s ease;
  z-index: 1;
}

.btn:hover::before {
  left: 100%;
}

.btn span {
  position: relative;
  z-index: 2;
}

.btn-large {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
}

.btn-primary {
  background: var(--gradient-red);
  color: var(--pure-white);
  padding: 1rem 2rem;
  border-radius: var(--border-radius-sm);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: var(--transition-bounce);
  text-decoration: none;
  display: inline-block;
  border: none;
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
  z-index: 1;
  font-family: 'Oswald', sans-serif;
  clip-path: polygon(0 0, 100% 0, 95% 100%, 0% 100%);
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--gradient-accent);
  opacity: 0;
  z-index: -1;
  transition: var(--transition-normal);
}

.btn-primary:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: var(--shadow-lg);
}

.btn-primary:hover::before {
  opacity: 1;
  background: var(--gradient-dark);
  transform: translateY(-3px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.btn-secondary {
  background-color: transparent;
  color: var(--pure-white);
  border: 2px solid var(--pure-white);
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius-sm);
  font-weight: 700;
  transition: var(--transition-bounce);
  text-decoration: none;
  display: inline-block;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
  overflow: hidden;
  font-family: 'Open Sans', sans-serif;
  clip-path: polygon(5% 0, 100% 0, 100% 100%, 0% 100%);
}

.btn-secondary:hover {
  background: var(--secondary-light);
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

/* Hero Section */
.hero {
  background: var(--gradient-hero);
  color: var(--pure-white);
  padding: 8rem 0 10rem;
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-xl);
  border-bottom: var(--border-athletic);
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
  opacity: 0.3;
  z-index: 0;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%);
  pointer-events: none;
}

.hero::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 4px;
  background: var(--gradient-red);
}

.hero-content {
  display: flex;
  align-items: center;
  gap: 4rem;
}

.hero-text {
  flex: 1;
}

.hero-text h1 {
  font-size: 4.5rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2px;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  text-shadow: var(--text-shadow-strong);
  color: var(--pure-white);
  position: relative;
  display: inline-block;
  font-family: 'Montserrat', sans-serif;
  -webkit-text-stroke: 1px rgba(0,0,0,0.2);
}

.hero-text h1 span {
  color: var(--gold-accent);
  position: relative;
  display: inline-block;
  letter-spacing: 3px;
}

.hero-text h1::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  width: 80px;
  height: 5px;
  background: var(--brick-red);
  border-radius: 2px;
}

.hero-text p {
  font-size: 1.25rem;
  color: var(--pure-white);
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 600px;
  opacity: 0.9;
}

.hero-buttons {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-top: 2.5rem;
}

.hero-buttons .btn-primary {
  padding: 1.25rem 2.5rem;
  font-size: 1.1rem;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.hero-buttons .btn-primary::after {
  content: '→';
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  transition: var(--transition-normal);
}

.hero-buttons .btn-primary:hover::after {
  right: 1.5rem;
  opacity: 1;
}

.hero-buttons .btn-primary:hover {
  padding-right: 3.5rem;
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.device-mockup-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.device-mockup {
  max-width: 80%;
  height: auto;
  filter: drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.15));
  transform: perspective(1000px) rotateY(-10deg) rotateX(5deg);
  transition: transform 0.5s ease;
  z-index: 2;
}

.device-mockup:hover {
  transform: perspective(1000px) rotateY(-5deg) rotateX(2deg);
}

.fitness-elements {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
}

.fitness-element {
  position: absolute;
  opacity: 0.25;
  z-index: -1;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.dumbell {
  width: 80px;
  height: 80px;
  top: 20%;
  right: 15%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 5v14M18 5v14M2 12h20M6 9a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2zM6 19a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2zM18 19a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2zM18 9a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2z'/%3E%3C/svg%3E");
  animation: float 6s ease-in-out infinite;
}

.kettlebell {
  width: 70px;
  height: 70px;
  bottom: 25%;
  left: 10%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M17.4 10c0 4.5-2.8 8.5-7 10-4.2-1.5-7-5.5-7-10 0-2.8 2.2-5 5-5 .8 0 1.6.2 2.2.5C13.4 4.2 17.3 5 17.4 10z'/%3E%3Cpath d='M11.8 5C13 3.8 14.7 3 16.5 3c2.8 0 5 2.2 5 5 0 .6-.1 1.2-.3 1.7'/%3E%3C/svg%3E");
  animation: float 7s ease-in-out infinite reverse;
}

.pulse {
  width: 60px;
  height: 60px;
  top: 60%;
  right: 20%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 12h-4l-3 9L9 3l-3 9H2'/%3E%3C/svg%3E");
  animation: pulse 5s ease-in-out infinite;
}

/* Añadir más elementos fitness */
.fitness-element.stopwatch {
  width: 50px;
  height: 50px;
  top: 30%;
  left: 25%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpath d='M12 6v6l4 2'/%3E%3C/svg%3E");
  animation: float 8s ease-in-out infinite;
}

.fitness-element.weight {
  width: 65px;
  height: 65px;
  bottom: 40%;
  right: 35%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z'/%3E%3Cline x1='16' y1='8' x2='2' y2='22'/%3E%3Cline x1='17.5' y1='15' x2='9' y2='15'/%3E%3C/svg%3E");
  animation: spin 20s linear infinite;
}

/* Features Section */
.features {
  background-color: var(--gray-100);
  padding: 6rem 0;
  position: relative;
}

.section-header {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 3rem;
}

.section-header h2 {
  color: var(--navy);
  font-size: 2.5rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -1px;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
}

.section-header h2::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: var(--brick-red);
  border-radius: 2px;
}

.section-header p {
  color: var(--deep-black);
  font-size: 1.25rem;
  line-height: 1.6;
  opacity: 0.8;
  margin-bottom: 2rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2.5rem;
  margin-top: 4rem;
  position: relative;
}

.features-grid::before {
  content: '';
  position: absolute;
  top: -2rem;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--brick-red), transparent);
}

.feature-card {
  background-color: var(--bg-primary);
  border-radius: var(--border-radius-md);
  padding: 2.5rem;
  box-shadow: var(--shadow-md);
  transition: var(--transition-bounce);
  position: relative;
  overflow: hidden;
  border: 2px solid var(--navy);
  border-bottom: var(--border-athletic);
  z-index: 1;
  clip-path: polygon(0 0, 100% 0, 100% 95%, 95% 100%, 0 100%);
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--gradient-accent);
  opacity: 0;
  z-index: -1;
  transition: var(--transition-normal);
}

.feature-card:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: var(--shadow-lg);
  border-color: var(--brick-red);
}

.feature-card:hover::after {
  content: '';
  position: absolute;
  top: -5px;
  right: -5px;
  width: 30px;
  height: 30px;
  background: var(--gold-accent);
  border-radius: 50%;
  z-index: 2;
  box-shadow: var(--shadow-sm);
}

.feature-card:hover::before {
  opacity: 0.05;
}

.feature-card:hover h3 {
  color: var(--brick-red);
}

.feature-card h3 {
  color: var(--navy);
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 1rem;
  font-family: 'Roboto Condensed', sans-serif;
  position: relative;
  display: inline-block;
  word-spacing: 2px;
}

.feature-card h3::before {
  content: '★';
  position: absolute;
  left: -1.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--brick-red);
  font-size: 1rem;
  opacity: 0;
  transition: var(--transition-normal);
}

.feature-card:hover h3::before {
  opacity: 1;
  left: -1rem;
}

.feature-card p {
  color: var(--deep-black);
  font-size: 1.1rem;
  line-height: 1.6;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: var(--gradient-primary);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: -1;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  border-top-color: var(--primary);
}

.feature-card:hover::before {
  transform: translateX(0);
}

.feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  border-radius: 12px;
  background: var(--navy);
  color: var(--pure-white);
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
  border: 3px solid var(--brick-red);
  transform: rotate(45deg);
}

.feature-icon > * {
  transform: rotate(-45deg);
  font-size: 1.5rem;
}

.feature-icon::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: linear-gradient(45deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%);
  z-index: 1;
}

.feature-icon svg {
  width: 60%;
  height: 60%;
  stroke-width: 2.5;
  z-index: 2;
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--gray-900);
}

.feature-card p {
  color: var(--gray-600);
  line-height: 1.6;
}

/* CTA Section */
.cta {
  background: var(--gradient-hero);
  color: var(--pure-white);
  padding: 8rem 0;
  text-align: center;
  position: relative;
  overflow: hidden;
  border-top: var(--border-athletic);
  position: relative;
}

.cta::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M20 0L0 20h20V0zm0 40V20h20L20 40z'/%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.3;
  z-index: 0;
}

.cta::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 15px;
  background: repeating-linear-gradient(45deg, var(--brick-red), var(--brick-red) 10px, var(--navy) 10px, var(--navy) 20px);
  opacity: 0.8;
}

.cta::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
}

.cta-content {
  max-width: 48rem;
  margin: 0 auto;
}

.cta h2 {
  font-size: 3.5rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 1.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  position: relative;
  display: inline-block;
  word-spacing: 4px;
  font-family: 'Montserrat', sans-serif;
}

.cta h2::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 5px;
  background: var(--brick-red);
  border-radius: 2px;
}

.cta p {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta .btn-primary {
  background: var(--brick-red);
  font-size: 1.2rem;
  padding: 1.25rem 3rem;
  font-weight: 700;
  letter-spacing: 2.5px;
  position: relative;
  overflow: hidden;
  z-index: 1;
  word-spacing: 2px;
  font-family: 'Oswald', sans-serif;
}

.cta .btn-primary::after {
  content: '→';
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  transition: var(--transition-normal);
}

.cta .btn-primary:hover::after {
  right: 1.5rem;
  opacity: 1;
}

.cta .btn-primary:hover {
  padding-right: 4rem;
}

/* Footer */
.footer {
  background-color: var(--bg-secondary);
  color: var(--text-light);
  padding: 3rem 0;
  border-top: var(--border-athletic);
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 4rem;
  margin-bottom: 3rem;
}

.footer-logo {
  height: 3.5rem;
  margin-bottom: 1rem;
}

.footer-slogan {
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 0.5rem;
  font-size: 1rem;
  color: var(--pure-white);
  opacity: 0.9;
}

.footer-brand p {
  max-width: 20rem;
  opacity: 0.8;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.footer-links-column h4 {
  color: white;
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
}

.footer-links-column ul {
  list-style: none;
}

.footer-links-column li {
  margin-bottom: 0.75rem;
}

.footer-links-column a {
  color: var(--gray-400);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-links-column a:hover {
  color: white;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid var(--gray-800);
}

.social-links {
  display: flex;
  gap: 1.25rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: var(--gray-800);
  color: var(--gray-300);
  transition: all 0.2s ease;
}

.social-link:hover {
  background-color: var(--primary);
  color: white;
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .hero-text h1 {
    font-size: 3rem;
  }
  
  .hero-content {
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  
  .mobile-menu-btn {
    display: block;
  }
  
  .hero {
    padding: 4rem 0 6rem;
  }
  
  .hero-content {
    flex-direction: column;
    text-align: center;
  }
  
  .hero-text h1 {
    font-size: 2.5rem;
  }
  
  .hero-buttons {
    justify-content: center;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  
  .footer-links {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
}

@media (max-width: 640px) {
  .section-header h2 {
    font-size: 2rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .footer-links {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
