<!-- src/pages/Home.vue -->
<script setup>
</script>

<template>
  <section class="home">
    <!-- HERO: Kadın / Erkek / Çocuk-Bebek -->
    <div class="hero">
      <div class="hero-title">DeFacto</div>

      <div class="hero-grid">
        <!-- Kadın -->
        <RouterLink
          to="/products?cat=women"
          class="hero-card hero-women"
        >
          <span class="hero-label">KADIN</span>
        </RouterLink>

        <!-- Erkek -->
        <RouterLink
          to="/products?cat=men"
          class="hero-card hero-men"
        >
          <span class="hero-label">ERKEK</span>
        </RouterLink>

        <!-- Çocuk / Bebek -->
        <RouterLink
          to="/products?cat=kids"
          class="hero-card hero-kids"
        >
          <span class="hero-label">ÇOCUK / BEBEK</span>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home {
  background: #fafafa;
}

/* ================= HERO ================= */

.hero {
  background: #ffffff;
  padding: 40px 0 40px;
}

.hero-title {
  text-align: center;
  font-size: 75px;
  font-weight: 300;
  margin-bottom: 40px;
  color: #111827;
}

.hero-grid {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 10px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.hero-card {
  position: relative;
  height: 420px;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  cursor: pointer;
  background-size: cover;
  background-position: center;
  transition: transform 0.45s ease;
}

.hero-card:hover {
  transform: scale(1.06);
}

/* نص KADIN / ERKEK / ÇOCUK */
.hero-label {
  position: relative;
  z-index: 1;
  color: #ffffff;
  font-size: 26px;
  font-weight: 600;
  letter-spacing: 0.18em;
}

.hero-card::before {
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

.hero-card:hover::before {
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.6),
    rgba(0, 0, 0, 0.2)
  );
}

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
    height: 260px;
  }

  .hero-label {
    font-size: 22px;
    letter-spacing: 0.12em;
  }
}
</style>
