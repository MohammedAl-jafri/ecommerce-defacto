<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import { useFavorites } from '../stores/useFavorites'

const router = useRouter()
const favoritesStore = useFavorites()

const searchTerm = ref('')

// عدد المفضلات
const favCount = computed(() => favoritesStore.items.length)

// فلترة المنتجات
const filteredFavorites = computed(() => {
  const q = searchTerm.value.trim().toLowerCase()
  if (!q) return favoritesStore.items

  return favoritesStore.items.filter((p) => {
    const title = (p.title || p.name || '').toLowerCase()
    return title.includes(q)
  })
})

const goToDetail = (product) => {
  const pid = product.productId || product.id
  if (!pid) return
  router.push(`/product/${pid}`)
}

// حالة قائمة Gift Club
const giftOpen = ref(false)
const toggleGift = () => {
  giftOpen.value = !giftOpen.value
}
</script>

<template>
  <div class="fav-page">
    <div class="container">
      
      <div class="breadcrumb">
        <router-link to="home" class="breadcrumb-item">ANASAYFA</router-link>
        <span class="sep"></span>
        
        <router-link to="/profile" class="breadcrumb-item">HESABIM</router-link>
        
        <span class="sep"></span>
        <span class="breadcrumb-item active">FAVORİLERİM</span>
      </div>

      <div class="layout-row">
        
        <aside class="sidebar">
          <ul class="sidebar-menu">
            <li>
              <a href="#" class="menu-link">SİPARİŞ TAKİP</a>
            </li>
            <li>
              <a href="#" class="menu-link">ÇEREZ TERCİHLERİ</a>
            </li>
            
            <li class="menu-item-gift">
              <div 
                class="gift-header" 
                :class="{ 'gift-header--active': giftOpen }" 
                @click="toggleGift"
              >
                <span class="menu-link">DEFACTO GİFT CLUB</span>
                
                <svg 
                  class="chevron-icon" 
                  viewBox="0 0 15 8"
                  width="10" 
                  height="10"
                >
                  <path fill="currentColor" d="m7.146.146-7 7a.5.5 0 0 0 .707.707L7.5 1.207l6.646 6.646a.5.5 0 0 0 .707-.707l-7-7a.5.5 0 0 0-.707 0" transform="scale(1, -1) translate(0, -8)"></path> 
                  <path fill="currentColor" d="M.5 0a.5.5 0 0 0-.354.854l7 7a.5.5 0 0 0 .707 0l7-7a.5.5 0 0 0 0-.707.5.5 0 0 0-.707 0L7.5 6.793.853.146A.5.5 0 0 0 .5 0"></path>
                </svg>
              </div>

              <div v-if="giftOpen" class="gift-submenu">
                <a href="#" class="submenu-link">HOŞ GELDİN</a>
                <a href="#" class="submenu-link">KAMPANYALAR</a>
                <a href="#" class="submenu-link">SIKÇA SORULAN SORULAR</a>
              </div>
            </li>

            <li class="menu-divider"></li>

            <li>
              <a href="#" class="menu-link">YARDIM</a>
            </li>
          </ul>
        </aside>

        <main class="main-content">
          
          <div class="content-frame">
            
            <h1 class="page-title">
              FAVORİLERİM <span v-if="favCount">({{ favCount }})</span>
            </h1>

            <div class="search-box">
              <span class="search-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9.047 0C4.056 0 0 4.056 0 9.047a9.06 9.06 0 0 0 9.047 9.049 9.06 9.06 0 0 0 9.049-9.049A9.06 9.06 0 0 0 9.047 0m0 .953a8.09 8.09 0 0 1 8.096 8.094 8.09 8.09 0 0 1-8.096 8.096A8.09 8.09 0 0 1 .953 9.047 8.085 8.085 0 0 1 9.047.953" transform="translate(2, 2)"/>
                  <path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </span>
              <input 
                type="text" 
                v-model="searchTerm" 
                placeholder="Favorilerimde Ara" 
              />
            </div>

            <div v-if="filteredFavorites.length" class="products-grid">
              <ProductCard
                v-for="p in filteredFavorites"
                :key="p.id || p.productId"
                :item="p"
                @detail="goToDetail"
              />
            </div>

            <div v-else class="empty-state">
              <div class="empty-icon-wrapper">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22242a" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <p class="empty-text">FAVORİLERİNİZDE ÜRÜN BULUNMAMAKTADIR.</p>
              <RouterLink to="/home" class="start-shopping-btn">
                ALIŞVERİŞE BAŞLA
              </RouterLink>
            </div>

          </div> 
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* =========================================
   Global & Layout
   ========================================= */
.fav-page {
  background-color: #ffffff;
  padding-bottom: 80px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #22242a;
}

.container {
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
}

@media (min-width: 1200px) {
  .container {
    max-width: 1360px;
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .container {
    max-width: 960px;
  }
}

.layout-row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
}

/* =========================================
   Breadcrumb
   ========================================= */
.breadcrumb {
  display: flex;
  align-items: center;
  padding: 20px 0;
  font-size: 9px;
  text-transform: uppercase;
  color: #777;
  letter-spacing: 0.5px;
}

.breadcrumb-item {
  color: #555;
  text-decoration: none;
  transition: color 0.2s;
  cursor: pointer; /* لإظهار أنه قابل للنقر */
}

.breadcrumb-item:hover {
  color: #000;
}

.breadcrumb-item.active {
  color: #22242a;
  font-weight: 400;
  cursor: default;
}

.sep::after {
  content: '→';
  margin: 0 8px;
  font-family: sans-serif;
  color: #999;
  font-size: 10px;
}

/* =========================================
   Sidebar (Left Menu)
   ========================================= */
.sidebar {
  width: 100%;
  padding: 0 15px;
  margin-bottom: 30px;
}

@media (min-width: 992px) {
  .sidebar {
    flex: 0 0 22%;
    max-width: 22%;
  }
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-menu li {
  margin-bottom: 16px;
}

.menu-link {
  display: block;
  font-size: 14px;
  color: #22242a;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0;
  cursor: pointer;
  transition: color 0.2s ease;
}

.menu-link:hover {
  color: #848484; 
}

/* Gift Club */
.gift-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

/* عند الفتح، يصبح الخط أغمق */
.gift-header--active .menu-link {
  font-weight: 700; /* Bold */
  color: #000000;
}

/* السهم */
.chevron-icon {
  color: #22242a;
  /* ألغينا الـ transform ليبقى متجهاً للأسفل دائماً */
}

.gift-submenu {
  padding-left: 0;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.submenu-link {
  font-size: 12px;
  color: #555;
  text-decoration: none;
  text-transform: uppercase;
  transition: color 0.2s;
}

.submenu-link:hover {
  color: #848484;
}

.menu-divider {
  border-bottom: 1px solid #e5e5e5;
  margin: 24px 0 !important;
  width: 100%;
}

/* =========================================
   Main Content (Right)
   ========================================= */
.main-content {
  width: 100%;
  padding: 0 15px;
}

@media (min-width: 992px) {
  .main-content {
    flex: 0 0 78%;
    max-width: 78%;
  }
}

/* ✅ الإطار الرمادي (Border) */
.content-frame {
  border: 1px solid #e5e7eb; /* رمادي فاتح مثل الصورة */
  border-radius: 2px; /* انحناء خفيف جداً */
  padding: 24px; /* مسافة داخلية بين الإطار والمحتوى */
  min-height: 600px;
}

.page-title {
  font-size: 17px;
  font-weight: 700;
  color: #22242a;
  text-transform: uppercase;
  margin: 0 0 24px 0;
  letter-spacing: 0.5px;
}

/* ✅ Search Box */
.search-box {
  background-color: #f8f8f9;
  height: 35px;
  display: flex;
  align-items: center;
  padding: 0 9px;
  margin-bottom: 30px;
  
  /* ✅ تقصير العرض ليكون بحجم صورة واحدة تقريباً */
  width: 100%;
  max-width: 500px; /* العرض التقريبي للكرت في الشاشات الكبيرة */
}

.search-icon {
  color: #b0b0b0;
  display: flex;
  align-items: center;
  margin-right: 16px;
}

.search-box input {
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  color: #22242a;
  width: 100%;
  font-family: inherit;
}

.search-box input::placeholder {
  color: #999;
}

/* =========================================
   Products Grid
   ========================================= */
.products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); 
  column-gap: 10px;
  row-gap: 48px;
}

:deep(.product-card) {
  width: 100%;
}

@media (max-width: 768px) {
  .products-grid {
    column-gap: 16px;
    row-gap: 30px
  }
}

@media (max-width: 900px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  /* في الموبايل، قد تحتاج لإلغاء الإطار أو تقليل المسافات */
  .content-frame {
    border: none;
    padding: 15px;
  }
}

@media (max-width: 500px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
  text-align: center;
}

.empty-icon-wrapper {
  margin-bottom: 20px;
  color: #22242a;
}

.empty-text {
  font-size: 14px;
  color: #22242a;
  font-weight: 500;
  margin: 0 0 25px 0;
  letter-spacing: 0.5px;
}

.start-shopping-btn {
  background-color: #22242a; /* اللون الأسود للزر */
  color: #fff;
  border: 1px solid #22242a;
  padding: 10px 100px; /* مساحة عريضة للزر */
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.2px;
  cursor: pointer;
  transition: background-color 0.4s;
}

.start-shopping-btn:hover {
    background-color: #fff;
    color: #22242a;
    font-weight: 500;
}
</style>
