import './assets/main.css'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'jsvectormap/dist/jsvectormap.css'
import 'flatpickr/dist/flatpickr.css'

import { createApp } from 'vue'
import { pinia } from './stores'
import App from './App.vue'
import router from './router'
import VueApexCharts from 'vue3-apexcharts'
import { useAuthStore } from './stores/auth.ts'

const app = createApp(App)


app.use(pinia)

const authStore = useAuthStore()
await authStore.initialize()

app.use(router)
app.use(VueApexCharts)

app.mount('#app')
