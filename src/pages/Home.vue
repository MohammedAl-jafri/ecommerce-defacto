<!-- src/pages/Home.vue -->
<script setup>
// لا منطق حالياً
</script>

<template>
  <section class="home">
    <div class="hero">
      <!-- شعار DeFacto قابل للنقر -->
      <div class="hero-logo">
        <RouterLink to="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 150 30"
            class="defacto-logo-svg"
          >
            <g clip-path="url(#A)" fill="#22242a">
              <path
                d="M11.545.554C7.77-.349 3.885.074 0 .19v29.287a3.56 3.56 0 0 0 .438.05H8.46c3.471-.115 6.793-1.413 9.4-3.671a14.69 14.69 0 0 0 4.892-8.709 14.46 14.46 0 0 0-2.294-10.461A14.88 14.88 0 0 0 11.545.554zm9.464 15.274a12.92 12.92 0 0 1-4.331 8.541c-2.493 2.203-5.743 3.392-9.093 3.325H1.896V2.064c.067 0 .11-.091.152-.091 2.528 0 5.056-.108 7.584.116 6.758.622 11.949 7.106 11.376 13.74zm18.488-8.631a11.86 11.86 0 0 0-6.535.589 11.66 11.66 0 0 0-5.182 3.96 11.39 11.39 0 0 0-2.197 6.084 11.35 11.35 0 0 0 1.481 6.29 11.6 11.6 0 0 0 4.692 4.514 11.85 11.85 0 0 0 6.424 1.315 11.8 11.8 0 0 0 6.132-2.299 11.52 11.52 0 0 0 3.907-5.187l-1.626-.672c-2.756 5.92-8.233 7.081-12.101 5.945s-6.885-4.793-6.876-8.292h21.261a11.22 11.22 0 0 0-2.27-7.918c-1.736-2.267-4.273-3.812-7.109-4.33zm-11.899 10.29c.143-4.519 4.576-8.532 9.48-8.624a9.87 9.87 0 0 1 6.668 2.409c1.837 1.597 2.997 3.815 3.25 6.215H27.599zm24.345 11.999h1.846v-14.71h12.632v-1.824H53.848V1.899h13.449V.141H51.943v29.345zM90.951 7.189l-.32-.166-.32.182-.565.315v4.511c-.973-1.372-2.233-2.523-3.696-3.376a12.04 12.04 0 0 0-4.784-1.568 12.09 12.09 0 0 0-5.015.521 11.95 11.95 0 0 0-4.346 2.516c-2.233 2.073-3.546 4.928-3.655 7.946s.995 5.958 3.073 8.181a11.27 11.27 0 0 0 3.598 2.654 11.44 11.44 0 0 0 4.366 1.061c4.348.216 7.744-1.559 10.492-5.108v4.627h1.82V7.537l-.649-.348zM79.996 28.151c-1.938-.002-3.831-.568-5.442-1.629a9.68 9.68 0 0 1-3.606-4.328 9.5 9.5 0 0 1-.556-5.57c.378-1.87 1.312-3.587 2.682-4.935A9.85 9.85 0 0 1 78.09 9.05a9.95 9.95 0 0 1 5.661.547 9.77 9.77 0 0 1 4.399 3.548c1.078 1.585 1.654 3.448 1.655 5.354-.001 1.27-.257 2.527-.752 3.7a9.64 9.64 0 0 1-2.135 3.134 9.83 9.83 0 0 1-3.193 2.09 9.95 9.95 0 0 1-3.763.727h.034zm34.736-12.869h.363l.227-.29.363-.481c-.958-2.534-2.793-4.656-5.182-5.991a11.85 11.85 0 0 0-7.883-1.312c-2.703.488-5.145 1.897-6.896 3.981s-2.701 4.707-2.682 7.411c.013 2.699.99 5.307 2.761 7.368s4.222 3.442 6.925 3.903a11.84 11.84 0 0 0 7.855-1.383c2.372-1.354 4.185-3.487 5.119-6.024l-1.626-.68c-2.688 5.879-8.157 7.056-12.025 5.979a9.84 9.84 0 0 1-5.038-3.375 9.58 9.58 0 0 1-2.05-5.647 9.43 9.43 0 0 1 1.814-5.876 9.69 9.69 0 0 1 5.079-3.569 9.41 9.41 0 0 1 5.654-.058 10.24 10.24 0 0 1 3.954 2.249 10.03 10.03 0 0 1 2.56 3.721l.708.075zm23.606-8.259c-2.309-.002-4.567.671-6.487 1.932a11.53 11.53 0 0 0-4.303 5.154c-.884 2.099-1.116 4.409-.666 6.637s1.562 4.276 3.195 5.882 3.713 2.7 5.978 3.143a11.85 11.85 0 0 0 6.745-.655c2.133-.87 3.956-2.343 5.237-4.233a11.35 11.35 0 0 0 1.964-6.383 11.39 11.39 0 0 0-3.419-8.112c-2.186-2.152-5.151-3.361-8.244-3.364zm0 21.161a9.96 9.96 0 0 1-5.471-1.628 9.72 9.72 0 0 1-3.628-4.345 9.54 9.54 0 0 1-.564-5.596 9.64 9.64 0 0 1 2.692-4.961c1.376-1.355 3.13-2.279 5.039-2.653a9.99 9.99 0 0 1 5.688.55 9.81 9.81 0 0 1 4.419 3.567c1.082 1.593 1.659 3.466 1.659 5.381 0 2.567-1.036 5.029-2.88 6.845s-4.345 2.837-6.954 2.84zM119.133.149v7.338h-3.809v1.849h3.877v14.61a6.83 6.83 0 0 0 .531 3.4 4.31 4.31 0 0 0 1.685 1.849 5.97 5.97 0 0 0 2.461.73 4.8 4.8 0 0 0 1.264 0v-1.658a6.21 6.21 0 0 1-.843 0 3.97 3.97 0 0 1-1.761-.572 2.72 2.72 0 0 1-1.071-1.352 6.71 6.71 0 0 1-.353-2.413V9.311h5.561V7.462h-5.553V.149"
              />
              <path d="M91.592 11.642V7.023h-1.82v21.965" />
            </g>
            <defs>
              <clipPath id="A">
                <path fill="#fff" d="M0 0h150v30H0z" />
              </clipPath>
            </defs>
          </svg>
        </RouterLink>
      </div>

      <!-- الصور الثلاث -->
      <div class="hero-grid">
        <!-- Kadın -->
        <RouterLink to="/products?cat=women" class="hero-card">
          <div class="hero-bg hero-women"></div>
          <span class="hero-label">KADIN</span>
        </RouterLink>

        <!-- Erkek -->
        <RouterLink to="/products?cat=men" class="hero-card">
          <div class="hero-bg hero-men"></div>
          <span class="hero-label">ERKEK</span>
        </RouterLink>

        <!-- Çocuk / Bebek -->
        <RouterLink to="/products?cat=kids" class="hero-card">
          <div class="hero-bg hero-kids"></div>
          <span class="hero-label">ÇOCUK BEBEK</span>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home {
  background: #ffffff;
}

/* ===== HERO ===== */
.hero {
  background: #ffffff;
  padding: 40px 0 0;
}

/* الشعار */
.hero-logo {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}
.defacto-logo-svg {
  width: 220px;
  height: auto;
}

/* الشبكة */
.hero-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0; /* بدون فراغات بين الصور */
}

/* الكرت نفسه لا يكبر */
.hero-card {
  position: relative;
  height: 520px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  cursor: pointer;
}

/* الخلفية هي التي تكبر من الداخل */
.hero-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center center;
  transition: transform 0.45s ease;
}

/* التدرّج */
.hero-bg::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.45),
    rgba(0, 0, 0, 0.1)
  );
  transition: background 0.35s ease;
}

/* تكبير من الداخل + تعتيم أقوى */
.hero-card:hover .hero-bg {
  transform: scale(1.3);
}
.hero-card:hover .hero-bg::after {
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.6),
    rgba(0, 0, 0, 0.2)
  );
}

/* النص */
.hero-label {
  position: relative;
  z-index: 1;
  color: #ffffff;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 0.18em;
}

/* الصور الحقيقية */
.hero-women {
  background-image: url('https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg');
}
.hero-men {
  background-image: url('https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg');
}
.hero-kids {
  background-image: url('https://images.pexels.com/photos/1094084/pexels-photo-1094084.jpeg');
}

/* Responsive */
@media (max-width: 900px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }

  .hero-card {
    height: 320px;
  }

  .hero-label {
    font-size: 24px;
    letter-spacing: 0.12em;
  }

  .defacto-logo-svg {
    width: 170px;
  }
}
</style>
