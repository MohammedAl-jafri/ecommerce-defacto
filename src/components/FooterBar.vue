<!-- src/components/FooterBar.vue -->
<script setup>
// لا نحتاج أي منطق هنا، مجرد footer statik
</script>

<template>
  <footer class="footer">
    <div class="container footer-grid">
      <div class="col">
        <h3>Yardım & Destek</h3>
        <a href="#">Sıkça Sorulan Sorular</a>
        <a href="#">İade & Değişim</a>
        <a href="#">Teslimat Bilgileri</a>
      </div>

      <div class="col">
        <h3>Kampanyalar</h3>
        <a href="#">Güncel Kampanyalar</a>
        <a href="#">Üyelik Avantajları</a>
        <a href="#">Hediye Kartları</a>
      </div>

      <div class="col">
        <h3>Sosyal Medya</h3>
        <div class="social">
          <span>Instagram</span>
          <span>Twitter</span>
          <span>Facebook</span>
        </div>
      </div>
    </div>

    <div class="bottom">
      <p>© 2025 DeFacto Clone – Öğrenci projesi (BSM Web Programlama)</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: 40px;
  background: #111827;
  color: #e5e7eb;
  padding: 24px 0 12px;
  font-size: 13px;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.col h3 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #f9fafb;
}

.col a {
  display: block;
  text-decoration: none;
  color: #d1d5db;
  margin-bottom: 4px;
}

.col a:hover {
  text-decoration: underline;
}

.social span {
  display: inline-block;
  margin-right: 10px;
  color: #e5e7eb;
}

.bottom {
  margin-top: 12px;
  border-top: 1px solid #374151;
  padding-top: 8px;
  text-align: center;
  color: #9ca3af;
  font-size: 12px;
}
</style>
