// Hide AppHeader if inside iframe (for payment gateway)
if (window.self !== window.top) {
  document.body.setAttribute('iframe-mode', 'true');
}
import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useSystemStore } from './stores/system'

// Import FontAwesome core
import { library } from '@fortawesome/fontawesome-svg-core'
// Import the WhatsApp icon
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
// Import font awesome component
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Add the WhatsApp icon to the library
library.add(faWhatsapp)

// Prevent flash of wrong theme by adding a class immediately
document.documentElement.classList.add('theme-initializing')

// Remove initializing class after a short delay
setTimeout(() => {
  document.documentElement.classList.remove('theme-initializing')
}, 50)

const app = createApp(App)
const pinia = createPinia()

// Register FontAwesome component globally
app.component('font-awesome-icon', FontAwesomeIcon)

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
