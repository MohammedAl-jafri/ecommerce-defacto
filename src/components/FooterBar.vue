<!-- src/components/FooterBar.vue -->
<script setup>
const onBenefitClick = (type) => {
  console.log('Benefit clicked:', type)
}

const onSocialClick = (platform) => {
  console.log('Social clicked:', platform)
}

const onChangeCountry = () => {
  console.log('Country change clicked')
}
</script>

<template>
  <footer class="df-footer">
    <!-- TOP BENEFITS ROW (icons) -->
    <section class="df-benefits">
      <div class="df-container df-benefits-row">
        <!-- 1) MAĞAZADAN TESLİM AL -->
        <button
          class="benefit-item"
          type="button"
          @click="onBenefitClick('store')"
        >
          <div class="benefit-icon">
            <span class="icon-shop"></span>
          </div>
          <div class="benefit-text">
            <div class="benefit-title">MAĞAZADAN TESLİM AL</div>
            <div class="benefit-sub">KARGO BEDAVA</div>
          </div>
        </button>

        <!-- 2) KAPIDA ÖDEME -->
        <button
          class="benefit-item"
          type="button"
          @click="onBenefitClick('cash')"
        >
          <div class="benefit-icon">
            <span class="icon-cash"></span>
          </div>
          <div class="benefit-text">
            <div class="benefit-title">KAPIDA ÖDEME</div>
            <div class="benefit-sub">HİZMET BEDELİ SADECE 39,99 TL</div>
          </div>
        </button>

        <!-- 3) MAĞAZADA DEĞİŞİM&İADE -->
        <button
          class="benefit-item"
          type="button"
          @click="onBenefitClick('change')"
        >
          <div class="benefit-icon">
            <span class="icon-change"></span>
          </div>
          <div class="benefit-text">
            <div class="benefit-title">MAĞAZADA DEĞİŞİM&İADE</div>
            <div class="benefit-sub">ONLINE AL MAĞAZADA DEĞİŞTİR</div>
          </div>
        </button>

        <!-- 4) ÜCRETSİZ İADE -->
        <button
          class="benefit-item"
          type="button"
          @click="onBenefitClick('free-return')"
        >
          <div class="benefit-icon">
            <span class="icon-box"></span>
          </div>
          <div class="benefit-text">
            <div class="benefit-title">ÜCRETSİZ İADE</div>
            <div class="benefit-sub">30 GÜN İÇERİSİNDE İADE ET</div>
          </div>
        </button>

        <!-- 5) DEFACTO GIFT CLUB -->
        <button
          class="benefit-item"
          type="button"
          @click="onBenefitClick('gift-club')"
        >
          <div class="benefit-icon">
            <span class="icon-gift"></span>
          </div>
          <div class="benefit-text">
            <div class="benefit-title">DEFACTO GIFT CLUB</div>
            <div class="benefit-sub">
              AYRICALIKLARLA YENİLEN, EĞLEN, DEVAM ET!
            </div>
          </div>
        </button>
      </div>
    </section>

    <!-- MAIN FOOTER -->
    <section class="df-main-footer">
      <div class="df-container df-main-row">
        <!-- DeFacto column -->
        <div class="col">
          <h4 class="col-title"><span class="col-title-text">DEFACTO</span></h4>
          <ul>
            <li><a href="#">KURUMSAL</a></li>
            <li><a href="#">HAKKIMIZDA</a></li>
            <li><a href="#">İNSAN KAYNAKLARI</a></li>
            <li><a href="#">KURUMSAL SATIŞ</a></li>
            <li><a href="#">TOPTAN SATIŞ (WHOLESALE PARTNER)</a></li>
            <li><a href="#">DEFACTO TEKNOLOJİ</a></li>
            <li><a href="#">SITEMAP</a></li>
          </ul>
        </div>

        <!-- Yardım column -->
        <div class="col">
          <h4 class="col-title"><span class="col-title-text">YARDIM</span></h4>
          <ul>
            <li><a href="#">SIKÇA SORULAN SORULAR</a></li>
            <li><a href="#">SİPARİŞİMİ NASIL TAKİP EDERİM?</a></li>
            <li><a href="#">NASIL İADE EDERİM?</a></li>
            <li><a href="#">İŞLEM REHBERİ</a></li>
            <li><a href="#">KAMPANYALAR</a></li>
            <li><a href="#">KİŞİSEL VERİLERİN KORUNMASI VE GİZLİLİK</a></li>
          </ul>
        </div>

        <!-- Bize Ulaşın column -->
        <div class="col">
          <h4 class="col-title"><span class="col-title-text">BİZE ULAŞIN</span></h4>
          <ul>
            <li><a href="#">MAĞAZALARIMIZ</a></li>
            <li><a href="#">İLETİŞİM FORMU</a></li>
          </ul>

          <div class="support-block">
            <div class="support-label">MÜŞTERİ HİZMETLERİ</div>
            <div class="support-phone special-click">0850 333 22 86</div>
          </div>
        </div>

        <!-- Takip Edin + Ülke Değiştir -->
        <div class="col col-social">
          <h4 class="col-title"><span class="col-title-text">TAKİP EDİN</span></h4>

          <div class="social-row">
            <!-- WhatsApp -->
            <button
              class="social-btn"
              type="button"
              aria-label="WhatsApp"
              @click="onSocialClick('whatsapp')"
            >
              <span class="icon-wa"></span>
            </button>
            <!-- Facebook -->
            <button
              class="social-btn"
              type="button"
              aria-label="Facebook"
              @click="onSocialClick('facebook')"
            >
              <span class="icon-fb">f</span>
            </button>
            <!-- X -->
            <button
              class="social-btn"
              type="button"
              aria-label="X"
              @click="onSocialClick('x')"
            >
              <span class="icon-x">X</span>
            </button>
            <!-- Instagram -->
            <button
              class="social-btn"
              type="button"
              aria-label="Instagram"
              @click="onSocialClick('instagram')"
            >
              <span class="icon-ig"></span>
            </button>
            <!-- TikTok -->
            <button
              class="social-btn"
              type="button"
              aria-label="TikTok"
              @click="onSocialClick('tiktok')"
            >
              <span class="icon-tt">♫</span>
            </button>
          </div>

          <button class="country-btn" type="button">
            <span class="country-icon"></span>
            <span class="country-text" @click="onChangeCountry">
              ÜLKE DEĞİŞTİR
            </span>
          </button>
        </div>
      </div>

      <div class="df-container df-copy-row">
        <p>
          © 2025 DEFACTO CLONE – ÖĞRENCİ PROJESİ (BSM WEB PROGRAMLAMA) – SHOPVUE
          / MOHAMMED AL-JAFRI
        </p>
      </div>
    </section>
  </footer>
</template>

<style scoped>

/* SUPPORT SECTION (LOOKS LIKE A LINK) */

.special-click {
  font-size: 12px;
  color: #000000;
  cursor: pointer;
  text-decoration: none;
  text-transform: uppercase;
  display: inline-block;
  padding: 1px 0px;
}

/* تأثير التوهّج مثل الأقسام */
.special-click:hover,
.col .special-click:focus-visible {
  color: #848484;
}

.df-footer {
  background: #f0f0f0; /* مثل الصورة تقريبًا */
  color: #111111;
  margin-top: 40px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
}

.df-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 16px;
}

/* ===== TOP BENEFITS ===== */
.df-benefits {
  padding: 22px 0 20px;
}

.df-benefits-row {
  display: flex;
  gap: 15px;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: left;
  background: transparent;
  border: none;
  padding: 0;
  cursor: default;
  min-width: 180px;
}

/* الإصبع فقط على الأيقونة والنص */
.benefit-icon,
.benefit-title,
.benefit-sub {
  cursor: pointer;
}

.benefit-icon {
  width: 42px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.icon-shop,
.icon-cash,
.icon-change,
.icon-box,
.icon-gift {
  display: inline-block;
  position: relative;
}

/* تقريب الأيقونات للشكل الحقيقي قدر الإمكان */
.icon-shop {
  width: 22px;
  height: 16px;
  border-radius: 3px;
  border: 2px solid #111;
  box-shadow: 0 -4px 0 0 #111;
}

.icon-cash {
  width: 22px;
  height: 14px;
  border-radius: 3px;
  border: 2px solid #111;
}

.icon-cash::after {
  content: "₺";
  position: absolute;
  font-size: 10px;
  top: 0px;
  left: 5px;
  font-weight: 700;
}

.icon-change {
  width: 22px;
  height: 14px;
  border-radius: 3px;
  border: 2px solid #111;
}

.icon-change::before,
.icon-change::after {
  content: "";
  position: absolute;
  width: 10px;
  height: 8px;
  border-radius: 50%;
  border: 2px solid #111;
  top: -8px;
}

.icon-change::before {
  left: -2px;
}

.icon-change::after {
  right: -2px;
}

.icon-box {
  width: 22px;
  height: 16px;
  border-radius: 2px;
  border: 2px solid #111;
}

.icon-box::before {
  content: "";
  position: absolute;
  width: 12px;
  height: 2px;
  background: #111;
  top: 5px;
  left: 4px;
}

.icon-gift {
  width: 22px;
  height: 16px;
  border-radius: 2px;
  border: 2px solid #111;
}

.icon-gift::before,
.icon-gift::after {
  content: "";
  position: absolute;
  background: #111;
}

.icon-gift::before {
  width: 2px;
  height: 16px;
  left: 10px;
}

.icon-gift::after {
  width: 22px;
  height: 2px;
  top: 6px;
}

.benefit-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.benefit-title {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.benefit-sub {
  font-size: 11px;
  color: #6b7280;
  text-transform: uppercase;
  white-space: nowrap;
}

/* ===== MAIN FOOTER ===== */
.df-main-footer {
  padding: 26px 0 24px;
}

.df-main-row {
  display: flex;
  justify-content: space-between;
  gap: 30px;
}

.col {
  width: 25%; 
  flex-grow: 1;
}

.col-social {
  width: 35%;
  flex-grow: 0;
  min-width: 200px;
}

.col-title {
  font-size: 14px;
  font-weight: 700;
  cursor: default;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* الكلك والإصبع فقط على النص نفسه */
.col-title-text {
  cursor: pointer;
  display: inline; /* مساحة الإصبع = مساحة الحروف فقط */
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
  font-size: 12px;
  color: #4b5563;
  text-decoration: none;
  text-transform: uppercase;
  display: inline-block;
  padding: 1px 0px;
}

.col a:hover,
.col a:focus-visible {
  color: #848484;
}


/* Bize Ulaşın support block */
.support-block {
  margin-top: 12px;
}

.support-label {
  font-size: 12px;
  font-weight: 700;
  color: #000000;
  text-transform: uppercase;
}

.support-phone {
  font-size: 14px;
  font-weight: 700;
  margin-top: -1px;
  text-transform: uppercase;
}

/* Social */
.col-social .social-row {
  display: flex;
  flex-wrap: nowrap;
  gap: 9px;
  margin-bottom: 1px;
}

/* خلفية سوداء مربعة وأيقونة بيضاء – مثل الصورة */
.social-btn {
  width: 50px;
  height: 40px;
  border: none;
  background: #000000;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 25px;
  transition: opacity 0.15s ease;
}

.social-btn:hover {
  opacity: 0.85;
}

/* WhatsApp شبه دائرة داخل مربع أسود */
.icon-wa {
  width: 20px;
  height: 20px;
  border-radius: 999px;
  border: 2px solid currentColor;
  position: relative;
}

.icon-wa::after {
  content: "";
  position: absolute;
  width: 7px;
  height: 4px;
  border-radius: 0 0 8px 8px;
  border: 2px solid currentColor;
  border-top: none;
  bottom: -5px;
  right: 1px;
}

/* Instagram مربع مع دائرة صغيرة داخل */
.icon-ig {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 2px solid currentColor;
  position: relative;
}

.icon-ig::before {
  content: "";
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 999px;
  border: 2px solid currentColor;
  top: 3px;
  left: 3px;
}

.icon-ig::after {
  content: "";
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 999px;
  background: currentColor;
  top: 3px;
  right: 3px;
}

.icon-fb,
.icon-x,
.icon-tt {
  font-weight: 700;
}

/* Country button */
.country-btn {
  margin-top: 10px;
  padding: 8px 11px;
  border: none;
  background: transparent;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13.5px;
  text-transform: uppercase;
  cursor: default;
}

.country-text {
  cursor: pointer;
}

.country-text:hover,
.country-text:focus-visible {
  color: #848484;
}

/* أيقونة كرة أرضية */

.country-icon {
    background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' stroke='%231c1c1c' fill='none' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><circle cx='32' cy='32' r='28'/><path d='M22 6c3 6 3 8 0 12s-4 6-4 10 3 6 5 7 4 3 4 6-2 6-4 8'/><path d='M42 6c-2 4-2 8 1 11s5 4 7 7 1 8-1 11-6 5-8 6-3 3-3 6 1 5 2 7'/></svg>");
    width: 25px;
    height: 25px;
    background-size: contain;
    background-repeat: no-repeat;
    display: inline-block;
}

/* Copy row */
.df-copy-row {
  margin-top: 20px;
  border-top: 1px solid #e5e7eb;
  padding-top: 10px;
}

.df-copy-row p {
  margin: 0;
  font-size: 11px;
  color: #6b7280;
  text-transform: uppercase;
}

/* Responsive */
@media (max-width: 1000px) {
  .df-main-row {
    flex-wrap: wrap;
  }
  .col {
    width: 50%;
  }
  .col-social {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .df-main-row {
    flex-direction: column;
  }
  .col {
    width: 100%;
  }
}
</style>
