// Hide AppHeader if inside iframe (for payment gateway)
if (window.self !== window.top) {
  document.body.setAttribute('iframe-mode', 'true');
}
import './assets/base.css'
import './assets/custom-select.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useSystemStore } from './stores/system'

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

const systemStore = useSystemStore()
systemStore.setOnlineStatus(navigator.onLine)

window.addEventListener('online', () => {
  systemStore.setOnlineStatus(true)
})

window.addEventListener('offline', () => {
  systemStore.setOnlineStatus(false)
})

app.mount('#app')
