import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createPinia } from 'pinia'
import AppHeader from '../AppHeader.vue'

// Mock window.matchMedia for theme store
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

// Create router instance for testing
const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', name: 'Home', component: { template: '<div>Home</div>' } },
    { path: '/search', name: 'Search', component: { template: '<div>Search</div>' } }
  ]
})

// Create Pinia store instance
const pinia = createPinia()

describe('AppHeader', () => {
  it('renders properly with logo and navigation', () => {
    const wrapper = mount(AppHeader, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Check if the component renders
    expect(wrapper.exists()).toBe(true)

    // Check if logo is present
    const logo = wrapper.find('img[alt="Company Logo"]')
    expect(logo.exists()).toBe(true)

    // Check if navigation links exist
    const navLinks = wrapper.findAll('a')
    expect(navLinks.length).toBeGreaterThan(0)

    // Check if home link exists
    const homeLink = wrapper.find('a[href="/"]')
    expect(homeLink.exists()).toBe(true)
  })

  it('displays navigation links correctly', async () => {
    const wrapper = mount(AppHeader, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Wait for component to load
    await wrapper.vm.$nextTick()

    // Check if navigation links are displayed
    const navText = wrapper.text()
    expect(navText).toContain('Home')
    expect(navText).toContain('My Bookings')
    expect(navText).toContain('About')
    expect(navText).toContain('Contact')
  })

  it('has responsive navigation elements', () => {
    const wrapper = mount(AppHeader, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Check for mobile menu button (hamburger menu) - look for button with @click="toggleMobileMenu"
    const mobileMenuButton = wrapper.find('button[class*="md:hidden"]')
    expect(mobileMenuButton.exists()).toBe(true)

    // Check for desktop navigation
    const desktopNav = wrapper.find('.hidden.md\\:flex')
    expect(desktopNav.exists()).toBe(true)
  })
})