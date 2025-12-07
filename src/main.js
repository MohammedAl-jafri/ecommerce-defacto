import { createApp } from "vue"
import { createPinia } from "pinia"   // ⬅️ أضفنا هذا السطر فقط
import App from './App.vue'
import router from './router/index.js'

const app = createApp(App)

app.use(createPinia())   // ⬅️ مهم جداً لكي تعمل المفضلات والسلة
app.use(router)

app.mount('#app')
