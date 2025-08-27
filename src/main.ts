import './assets/base.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Prevent flash of wrong theme by adding a class immediately
document.documentElement.classList.add('theme-initializing')

// Remove initializing class after a short delay
setTimeout(() => {
  document.documentElement.classList.remove('theme-initializing')
}, 50)

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')
