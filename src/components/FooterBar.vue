<template>
  <footer class="site-footer">
    <!-- Üst şerit -->
    <div class="footer-top">
      <div class="feature">
        <span class="icon">🏬</span>
        <div>
          <div class="title">Mağazadan Teslim Al</div>
          <div class="text">Kargo bedava</div>
        </div>
      </div>

      <div class="feature">
        <span class="icon">🚚</span>
        <div>
          <div class="title">Kapıda ödeme</div>
          <div class="text">Hizmet bedeli sadece 39,99 TL</div>
        </div>
      </div>

      <div class="feature">
        <span class="icon">♻️</span>
        <div>
          <div class="title">Mağazada Değişim &amp; İade</div>
          <div class="text">Online al mağazada değiştir</div>
        </div>
      </div>

      <div class="feature">
        <span class="icon">↩️</span>
        <div>
          <div class="title">Ücretsiz iade</div>
          <div class="text">30 gün içerisinde iade et</div>
        </div>
      </div>

      <div class="feature">
        <span class="icon">🎁</span>
        <div>
          <div class="title">Gift Club</div>
          <div class="text">Ayrıcalıklarla dolu alışveriş</div>
        </div>
      </div>
    </div>

    <!-- Ana alt kısım -->
    <div class="footer-main">
      <div class="col">
        <h4>DeFacto</h4>
        <ul>
          <li>Kurumsal</li>
          <li>Hakkımızda</li>
          <li>İnsan Kaynakları</li>
          <li>Kurumsal Satış</li>
          <li>DeFacto Teknoloji</li>
        </ul>
      </div>

      <div class="col">
        <h4>Yardım</h4>
        <ul>
          <li>Sıkça Sorulan Sorular</li>
          <li>Siparişimi Nasıl Takip Ederim?</li>
          <li>Nasıl İade Ederim?</li>
          <li>İşlem Rehberi</li>
          <li>KVKK &amp; Gizlilik</li>
        </ul>
      </div>

      <div class="col">
        <h4>Bize Ulaşın</h4>
        <ul>
          <li>Mağazalarımız</li>
          <li>İletişim Formu</li>
          <li class="bold">Müşteri Hizmetleri</li>
          <li class="bold">0850 333 22 86</li>
        </ul>
      </div>

      <div class="col follow">
        <h4>Takip Edin</h4>
        <div class="social-row">
          <span class="social-box">WA</span>
          <span class="social-box">F</span>
          <span class="social-box">X</span>
          <span class="social-box">IG</span>
          <span class="social-box">TT</span>
        </div>
        <div class="country">
          <span class="globe">🌐</span>
          <span>Ülke Değiştir</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// sadece statik HTML, script yok
</script>

<style scoped>
.site-footer {
  margin-top: 40px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  font-size: 13px;
  color: #4b5563;
}

/* Üst özellikler */
.footer-top {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding: 18px 40px;
  border-bottom: 1px solid #e5e7eb;
}

.feature {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon {
  font-size: 20px;
}

.title {
  font-weight: 600;
  color: #111827;
}

.text {
  font-size: 12px;
}

/* Ana footer alanı */
.footer-main {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
  padding: 24px 40px 26px;
}

.col h4 {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  margin-bottom: 4px;
}

.bold {
  font-weight: 600;
  color: #111827;
}

/* Sosyal ikonlar */
.follow .social-row {
  display: flex;
  gap: 8px;
  margin-top: 6px;
  margin-bottom: 10px;
}

.social-box {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #000000;
  color: #ffffff;
  font-size: 11px;
}

/* Ülke değiştir satırı */
.country {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.globe {
  font-size: 15px;
}

/* responsive küçük ekran */
@media (max-width: 900px) {
  .footer-main {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .footer-main {
    grid-template-columns: 1fr;
  }
}
</style>
