<!-- src/components/HeaderBar.vue -->
<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import useAuth from '../stores/useAuth'
import { useCart } from '../stores/useCart'

const router = useRouter()
const route = useRoute()
const { user, logout } = useAuth()
const cart = useCart()

const search = ref(route.query.q || '')
const searchOpen = ref(false)

watch(
  () => route.query.q,
  nv => (search.value = nv || '')
)

const doSearch = () => {
  router.push({
    name: 'products',
    query: {
      q: search.value || undefined,
      cat: route.query.cat || undefined,
    },
  })
  searchOpen.value = false
}

const handleLogout = async () => {
  await logout()
  router.push('/login')
}
</script>

<template>
  <!-- HEADER العادي -->
  <header class="df-header">
    <div class="df-container">
      <!-- LEFT: logo + main cats -->
      <div class="df-left">
        <RouterLink to="/" class="df-logo" aria-label="DeFacto Ana Sayfa">
          <!-- ✅ شعار DeFacto SVG -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="150"
            height="30"
            fill="none"
            class="df-logo-svg"
          >
            <g clip-path="url(#df-logo-clip)" fill="#22242a">
              <path
                d="M11.545.554C7.77-.349 3.885.074 0 .19v29.287a3.56 3.56 0 0 0 .438.05H8.46c3.471-.115 6.793-1.413 9.4-3.671a14.69 14.69 0 0 0 4.892-8.709 14.46 14.46 0 0 0-2.294-10.461A14.88 14.88 0 0 0 11.545.554zm9.464 15.274a12.92 12.92 0 0 1-4.331 8.541c-2.493 2.203-5.743 3.392-9.093 3.325H1.896V2.064c.067 0 .11-.091.152-.091 2.528 0 5.056-.108 7.584.116 6.758.622 11.949 7.106 11.376 13.74zm18.488-8.631a11.86 11.86 0 0 0-6.535.589 11.66 11.66 0 0 0-5.182 3.96 11.39 11.39 0 0 0-2.197 6.084 11.35 11.35 0 0 0 1.481 6.29 11.6 11.6 0 0 0 4.692 4.514 11.85 11.85 0 0 0 6.424 1.315 11.8 11.8 0 0 0 6.132-2.299 11.52 11.52 0 0 0 3.907-5.187l-1.626-.672c-2.756 5.92-8.233 7.081-12.101 5.945s-6.885-4.793-6.876-8.292h21.261a11.22 11.22 0 0 0-2.27-7.918c-1.736-2.267-4.273-3.812-7.109-4.33zm-11.899 10.29c.143-4.519 4.576-8.532 9.48-8.624a9.87 9.87 0 0 1 6.668 2.409c1.837 1.597 2.997 3.815 3.25 6.215H27.599zm24.345 11.999h1.846v-14.71h12.632v-1.824H53.848V1.899h13.449V.141H51.943v29.345zM90.951 7.189l-.32-.166-.32.182-.565.315v4.511c-.973-1.372-2.233-2.523-3.696-3.376a12.04 12.04 0 0 0-4.784-1.568 12.09 12.09 0 0 0-5.015.521 11.95 11.95 0 0 0-4.346 2.516c-2.233 2.073-3.546 4.928-3.655 7.946s.995 5.958 3.073 8.181a11.27 11.27 0 0 0 3.598 2.654 11.44 11.44 0 0 0 4.366 1.061c4.348.216 7.744-1.559 10.492-5.108v4.627h1.82V7.537l-.649-.348zM79.996 28.151c-1.938-.002-3.831-.568-5.442-1.629a9.68 9.68 0 0 1-3.606-4.328 9.5 9.5 0 0 1-.556-5.57c.378-1.87 1.312-3.587 2.682-4.935A9.85 9.85 0 0 1 78.09 9.05a9.95 9.95 0 0 1 5.661.547 9.77 9.77 0 0 1 4.399 3.548c1.078 1.585 1.654 3.448 1.655 5.354-.001 1.27-.257 2.527-.752 3.7a9.64 9.64 0 0 1-2.135 3.134 9.83 9.83 0 0 1-3.193 2.09 9.95 9.95 0 0 1-3.763.727h.034zm34.736-12.869h.363l.227-.29.363-.481c-.958-2.534-2.793-4.656-5.182-5.991a11.85 11.85 0 0 0-7.883-1.312c-2.703.488-5.145 1.897-6.896 3.981s-2.701 4.707-2.682 7.411c.013 2.699.99 5.307 2.761 7.368s4.222 3.442 6.925 3.903a11.84 11.84 0 0 0 7.855-1.383c2.372-1.354 4.185-3.487 5.119-6.024l-1.626-.68c-2.688 5.879-8.157 7.056-12.025 5.979a9.84 9.84 0 0 1-5.038-3.375 9.58 9.58 0 0 1-2.05-5.647 9.43 9.43 0 0 1 1.814-5.876 9.69 9.69 0 0 1 5.079-3.569 9.41 9.41 0 0 1 5.654-.058 10.24 10.24 0 0 1 3.954 2.249 10.03 10.03 0 0 1 2.56 3.721l.708.075zm23.606-8.259c-2.309-.002-4.567.671-6.487 1.932a11.53 11.53 0 0 0-4.303 5.154c-.884 2.099-1.116 4.409-.666 6.637s1.562 4.276 3.195 5.882 3.713 2.7 5.978 3.143a11.85 11.85 0 0 0 6.745-.655c2.133-.87 3.956-2.343 5.237-4.233a11.35 11.35 0 0 0 1.964-6.383 11.39 11.39 0 0 0-3.419-8.112c-2.186-2.152-5.151-3.361-8.244-3.364zm0 21.161a9.96 9.96 0 0 1-5.471-1.628 9.72 9.72 0 0 1-3.628-4.345 9.54 9.54 0 0 1-.564-5.596 9.64 9.64 0 0 1 2.692-4.961c1.376-1.355 3.13-2.279 5.039-2.653a9.99 9.99 0 0 1 5.688.55 9.81 9.81 0 0 1 4.419 3.567c1.082 1.593 1.659 3.466 1.659 5.381 0 2.567-1.036 5.029-2.88 6.845s-4.345 2.837-6.954 2.84zM119.133.149v7.338h-3.809v1.849h3.877v14.61a6.83 6.83 0 0 0 .531 3.4 4.31 4.31 0 0 0 1.685 1.849 5.97 5.97 0 0 0 2.461.73 4.8 4.8 0 0 0 1.264 0v-1.658a6.21 6.21 0 0 1-.843 0 3.97 3.97 0 0 1-1.761-.572 2.72 2.72 0 0 1-1.071-1.352 6.71 6.71 0 0 1-.353-2.413V9.311h5.561V7.462h-5.553V.149"
              />
              <path
                d="M91.592 11.642V7.023h-1.82v21.965"
              />
            </g>
            <defs>
              <clipPath id="df-logo-clip">
                <path fill="#fff" d="M0 0h150v30H0z" />
              </clipPath>
            </defs>
          </svg>
        </RouterLink>

        <nav class="df-main-nav">
          <RouterLink to="/products?cat=women">Kadın</RouterLink>
          <RouterLink to="/products?cat=men">Erkek</RouterLink>
          <RouterLink to="/products?cat=kids">Çocuk &amp; Bebek</RouterLink>
        </nav>
      </div>

      <!-- MIDDLE: search (الصغير) -->
      <div class="df-middle">
        <div class="df-search-wrap" @click="searchOpen = true">
          <span class="df-search-icon">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              class="df-search-svg"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="7.3"
                cy="7.3"
                r="6.3"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12.2002 12.2L15.0002 15"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>

          <input
            v-model="search"
            type="text"
            placeholder="NE ARAMAK İSTERSİN?"
            readonly
          />
        </div>
      </div>

      <!-- RIGHT: GİRİŞ / FAVORİLERİM / SEPETİM -->
      <div class="df-right">
        <!-- Giriş / Profil -->
        <template v-if="!user">
          <RouterLink to="/login" class="df-right-link">
            Giriş
          </RouterLink>
        </template>

        <template v-else>
          <RouterLink to="/profile" class="df-right-link">
            Profil
          </RouterLink>

          <button
            class="df-right-link df-btn-plain"
            type="button"
            @click="handleLogout"
          >
            Çıkış
          </button>
        </template>

        <!-- Favorilerim -->
        <RouterLink to="/favorites" class="df-right-link">
          Favorilerim
        </RouterLink>
        

        <!-- Sepetim -->
        <RouterLink to="/cart" class="df-right-link">
          Sepetim <span class="cart-count">({{ cart.count }})</span>
        </RouterLink>
      </div>
    </div>
  </header>

  <!-- نافذة البحث الكبيرة -->
  <div v-if="searchOpen" class="df-search-modal">
    <div class="df-search-modal-top">
      <!-- مربع البحث الكبير (الكل داخل البوكس) -->
      <div class="df-search-box">
        <!-- زر الرجوع -->
        <button class="df-search-back" type="button" @click="searchOpen = false">
          ←
        </button>

        <span class="df-search-icon">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            class="df-search-svg"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="7.3"
              cy="7.3"
              r="6.3"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12.2002 12.2L15.0002 15"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>

        <input
          v-model="search"
          type="text"
          placeholder="NE ARAMAK İSTERSİN?"
          @keyup.enter="doSearch"
          autofocus
        />

        <!-- ARA داخل المربع -->
        <button class="df-search-submit" type="button" @click="doSearch">
          ARA
        </button>

        <!-- X داخل نفس المربع -->
        <button
          class="df-search-close"
          type="button"
          @click="searchOpen = false"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- POPÜLER KATEGORİLER -->
    <div class="df-search-categories">
      <h3>🔥 POPÜLER KATEGORİLER</h3>

      <div class="cat-grid">
        <span class="cat">MONT</span>
        <span class="cat">CEKET</span>
        <span class="cat">ERKEK SWEATSHIRT</span>
        <span class="cat">KAZAK</span>
        <span class="cat">PANTOLON</span>
        <span class="cat">KADIN SWEATSHIRT</span>
        <span class="cat">HIRKA</span>
        <span class="cat">KABAN</span>
        <span class="cat">KADIN MONT</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== HEADER WRAPPER ===== */
.df-header {
  background: #ffffff;
  border-bottom: 1px solid #eeeeee;
  padding: 12px 0;
}

.df-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: auto minmax(0, 2fr) auto;
  align-items: center;
  column-gap: 32px;
}

/* LEFT */
.df-left {
  display: flex;
  align-items: center;
  gap: 28px;
}

/* ✅ logo كسفج */
.df-logo {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
}

.df-logo-svg {
  height: 30px; /* عدّلها إذا أردت تكبير/تصغير الشعار */
  width: auto;
  display: block;
}

.df-main-nav {
  display: flex;
  gap: 18px;
  font-size: 13px;
}

.df-main-nav a {
  text-decoration: none;
  color: #2b2b35;
}

.df-main-nav a.router-link-active {
  font-weight: 600;
}

/* MIDDLE: small search */
.df-middle {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  padding-left: 170px; 
}

.df-search-wrap {
  width: 100%;
  max-width: 206px;
  height: 36px;
  background: transparent;
  border-radius: 0;
  display: flex;
  align-items: center;
  padding: 0 10px;
  gap: 8px;
  border: 1px solid #22242a;
  cursor: text;
}

.df-search-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.df-search-svg {
  width: 16px;
  height: 16px;
  color: #22242a;
}

.df-search-wrap input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 11.6px;
  color: #444;
}

.df-search-wrap input::placeholder {
  color: #22242a;
}

/* RIGHT */
.df-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

/* روابط اليمين */
.df-right-link {
  position: relative;
  font-size: 13px;
  color: #22242a;
  text-decoration: none;
  text-transform: uppercase;
  padding-bottom: 2px;
  background: transparent;
  border: none;
  cursor: pointer;
}

/* خط متحرك من اليسار لليمين */
.df-right-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 1px;
  background: #22242a;
  transition: width 0.25s ease;
}

.df-right-link:hover::after,
.df-right-link:focus-visible::after {
  width: 100%;
}

.df-right-link.router-link-active {
  font-weight: 600;
}

.df-right-link.router-link-active::after {
  width: 100%;
}

/* عدد السلة */
.cart-count {
  font-weight: 400;
}

/* ===== SEARCH MODAL ===== */
.df-search-modal {
  position: fixed;
  inset: 0;
  background: #ffffff;
  z-index: 2000;
  padding: 20px;
  overflow-y: auto;
}

.df-search-modal-top {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* ← */
.df-search-back {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 0 4px;
}

/* المربع الكبير */
.df-search-box {
  flex: 1;
  height: 36px;
  border: 1px solid #22242a;
  display: flex;
  align-items: center;
  padding: 0 10px;
  gap: 8px;
}

.df-search-box input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
}

/* ARA */
.df-search-submit {
  background: transparent;
  border: none;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  text-decoration: underline;
  color: #22242a;
  cursor: pointer;
  padding: 0 4px;
}

/* X داخل البوكس */
.df-search-close {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding-left: 10px;
  display: flex;
  align-items: center;
}

/* POPULER KATEGORILER */
.df-search-categories {
  margin-top: 24px;
}

.df-search-categories h3 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 14px;
  text-transform: uppercase;
}

.cat-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.cat {
  padding: 8px 12px;
  background: #f3f3f3;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
}

/* Responsive */
@media (max-width: 900px) {
  .df-container {
    grid-template-columns: auto auto;
    grid-template-rows: auto auto;
    row-gap: 10px;
  }

  .df-middle {
    grid-column: 1 / -1;
    order: 2;
  }

  .df-left {
    gap: 10px;
  }

  .df-main-nav {
    display: none;
  }

  .df-search-modal {
    padding: 16px;
  }
}
</style>
