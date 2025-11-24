<!-- src/components/FooterBar.vue -->
<script setup>

</script>

<template>
  <footer class="df-footer">
    <!-- TOP BENEFITS ROW (icons) -->
    <section class="df-benefits">
      <div class="df-container df-benefits-row">
        <!-- 1) Mağazadan Teslim Al -->
        <div class="benefit-item">
          <div class="benefit-icon">
            <span class="icon-shop"></span>
          </div>
          <div class="benefit-text">
            <div class="benefit-title">Mağazadan Teslim Al</div>
            <div class="benefit-sub">Kargo bedava</div>
          </div>
        </div>

        <!-- 2) Kapıda ödeme -->
        <div class="benefit-item">
          <div class="benefit-icon">
            <span class="icon-cash"></span>
          </div>
          <div class="benefit-text">
            <div class="benefit-title">Kapıda ödeme</div>
            <div class="benefit-sub">Hizmet bedeli sadece 39,99 TL</div>
          </div>
        </div>

        <!-- 3) Mağazada Değişim & İade -->
        <div class="benefit-item">
          <div class="benefit-icon">
            <span class="icon-change"></span>
          </div>
          <div class="benefit-text">
            <div class="benefit-title">Mağazada Değişim &amp; İade</div>
            <div class="benefit-sub">Online al, mağazada değiştir</div>
          </div>
        </div>

        <!-- 4) Ücretsiz iade -->
        <div class="benefit-item">
          <div class="benefit-icon">
            <span class="icon-box"></span>
          </div>
          <div class="benefit-text">
            <div class="benefit-title">Ücretsiz iade</div>
            <div class="benefit-sub">30 gün içerisinde iade et</div>
          </div>
        </div>

        <!-- 5) Gift Club -->
        <div class="benefit-item">
          <div class="benefit-icon">
            <span class="icon-gift"></span>
          </div>
          <div class="benefit-text">
            <div class="benefit-title">DeFacto Gift Club</div>
            <div class="benefit-sub">Ayrıcalıklarla yenilen, eğlen, devam et!</div>
          </div>
        </div>
      </div>
    </section>

    <!-- MAIN FOOTER -->
    <section class="df-main-footer">
      <div class="df-container df-main-row">
        <!-- DeFacto column -->
        <div class="col">
          <h4 class="col-title">DeFacto</h4>
          <ul>
            <li><a href="#">Kurumsal</a></li>
            <li><a href="#">Hakkımızda</a></li>
            <li><a href="#">İnsan Kaynakları</a></li>
            <li><a href="#">Kurumsal Satış</a></li>
            <li><a href="#">Toptan Satış (Wholesale Partner)</a></li>
            <li><a href="#">DeFacto Teknoloji</a></li>
            <li><a href="#">Sitemap</a></li>
          </ul>
        </div>

        <!-- Yardım column -->
        <div class="col">
          <h4 class="col-title">Yardım</h4>
          <ul>
            <li><a href="#">Sıkça Sorulan Sorular</a></li>
            <li><a href="#">Siparişimi Nasıl Takip Ederim?</a></li>
            <li><a href="#">Nasıl İade Ederim?</a></li>
            <li><a href="#">İşlem Rehberi</a></li>
            <li><a href="#">Kampanyalar</a></li>
            <li><a href="#">Kişisel Verilerin Korunması</a></li>
          </ul>
        </div>

        <!-- Bize Ulaşın column -->
        <div class="col">
          <h4 class="col-title">Bize Ulaşın</h4>
          <ul>
            <li><a href="#">Mağazalarımız</a></li>
            <li><a href="#">İletişim Formu</a></li>
          </ul>

          <div class="support-block">
            <div class="support-label">Müşteri Hizmetleri</div>
            <div class="support-phone">0 850 333 22 86</div>
          </div>
        </div>

        <!-- Takip Edin + Ülke Değiştir -->
        <div class="col col-social">
          <h4 class="col-title">Takip Edin</h4>

          <div class="social-row">
            <button class="social-btn" aria-label="WhatsApp">
              <span class="icon-whatsapp"></span>
            </button>
            <button class="social-btn" aria-label="Facebook">
              <span class="icon-fb">f</span>
            </button>
            <button class="social-btn" aria-label="X">
              <span class="icon-x">X</span>
            </button>
            <button class="social-btn" aria-label="Instagram">
              <span class="icon-ig"></span>
            </button>
            <button class="social-btn" aria-label="TikTok">
              <span class="icon-tt">♫</span>
            </button>
          </div>

          <button class="country-btn" type="button">
            <span class="country-icon"></span>
            <span>Ülke Değiştir</span>
          </button>
        </div>
      </div>

      <div class="df-container df-copy-row">
        <p>
          © 2025 DeFacto Clone – Öğrenci projesi (BSM Web Programlama) – ShopVue
          / Mohammed Al-Jafri
        </p>
      </div>
    </section>
  </footer>
</template>

<style scoped>
.df-footer {
  background: #ffffff;
  color: #111111;
  border-top: 1px solid #e5e7eb;
  margin-top: 40px;
  font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
}

.df-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 16px;
}

/* ===== TOP BENEFITS ===== */
.df-benefits {
  border-bottom: 1px solid #e5e7eb;
  padding: 24px 0 18px;
}

.df-benefits-row {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 18px;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.benefit-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-shop,
.icon-cash,
.icon-change,
.icon-box,
.icon-gift {
  display: inline-block;
  position: relative;
}

.icon-shop {
  width: 18px;
  height: 14px;
  border-radius: 3px;
  border: 1px solid #111;
  box-shadow: 0 -3px 0 0 #111;
}

.icon-cash {
  width: 18px;
  height: 12px;
  border-radius: 3px;
  border: 1px solid #111;
}

.icon-cash::after {
  content: "₺";
  position: absolute;
  font-size: 9px;
  top: 1px;
  left: 4px;
}

.icon-change {
  width: 18px;
  height: 12px;
  border-radius: 3px;
  border: 1px solid #111;
}

.icon-change::before,
.icon-change::after {
  content: "";
  position: absolute;
  width: 8px;
  height: 6px;
  border-radius: 50%;
  border: 1px solid #111;
  top: -6px;
}

.icon-change::before {
  left: -2px;
}

.icon-change::after {
  right: -2px;
}

.icon-box {
  width: 18px;
  height: 14px;
  border-radius: 2px;
  border: 1px solid #111;
}

.icon-box::before {
  content: "";
  position: absolute;
  width: 10px;
  height: 2px;
  background: #111;
  top: 4px;
  left: 3px;
}

.icon-gift {
  width: 18px;
  height: 14px;
  border-radius: 2px;
  border: 1px solid #111;
}

.icon-gift::before,
.icon-gift::after {
  content: "";
  position: absolute;
  background: #111;
}

.icon-gift::before {
  width: 2px;
  height: 14px;
  left: 8px;
}

.icon-gift::after {
  width: 18px;
  height: 2px;
  top: 5px;
}

.benefit-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.benefit-title {
  font-size: 14px;
  font-weight: 600;
}

.benefit-sub {
  font-size: 12px;
  color: #6b7280;
}

/* ===== MAIN FOOTER ===== */
.df-main-footer {
  padding: 26px 0 24px;
}

.df-main-row {
  display: grid;
  grid-template-columns: 1.1fr 1.1fr 1.1fr 1fr;
  gap: 30px;
}

.col-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 10px;
}

.col ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.col li {
  margin-bottom: 6px;
}

.col a {
  font-size: 13px;
  color: #4b5563;
  text-decoration: none;
}

.col a:hover {
  text-decoration: underline;
}

/* Bize Ulaşın support block */
.support-block {
  margin-top: 12px;
}

.support-label {
  font-size: 13px;
  color: #6b7280;
}

.support-phone {
  font-size: 15px;
  font-weight: 700;
  margin-top: 4px;
}

/* Social */
.col-social .social-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.social-btn {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  border: none;
  background: #111111;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
}

.icon-whatsapp {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 2px solid #ffffff;
  position: relative;
}

.icon-whatsapp::after {
  content: "";
  position: absolute;
  width: 6px;
  height: 3px;
  border-radius: 0 0 6px 6px;
  border: 2px solid #ffffff;
  border-top: none;
  bottom: -4px;
  right: 1px;
}

.icon-fb,
.icon-x,
.icon-tt {
  font-weight: 700;
}

.icon-ig {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 2px solid #ffffff;
  position: relative;
}

.icon-ig::before {
  content: "";
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  border: 2px solid #ffffff;
  top: 3px;
  left: 3px;
}

.icon-ig::after {
  content: "";
  position: absolute;
  width: 2px;
  height: 2px;
  border-radius: 999px;
  background: #ffffff;
  top: 3px;
  right: 3px;
}

/* Country button */
.country-btn {
  margin-top: 8px;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  background: transparent;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  cursor: pointer;
}

.country-icon {
  width: 20px;
  height: 20px;
  border-radius: 999px;
  border: 1px solid #111111;
  position: relative;
}

.country-icon::before,
.country-icon::after {
  content: "";
  position: absolute;
  border-radius: 999px;
  border: 1px solid #111111;
}

.country-icon::before {
  inset: 3px;
}

.country-icon::after {
  inset: 6px;
}

/* Copy row */
.df-copy-row {
  margin-top: 20px;
  border-top: 1px solid #e5e7eb;
  padding-top: 10px;
}

.df-copy-row p {
  margin: 0;
  font-size: 12px;
  color: #6b7280;
}

/* Responsive */
@media (max-width: 1000px) {
  .df-benefits-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .df-main-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .df-benefits-row {
    grid-template-columns: 1fr;
  }
  .df-main-row {
    grid-template-columns: 1fr;
  }
}
</style>
