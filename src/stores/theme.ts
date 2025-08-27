import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: false,
    isInitialized: false
  }),

  actions: {
    initTheme() {
      if (this.isInitialized) return;
      
      // Check for both 'theme' and legacy 'darkMode' keys for backwards compatibility
      const savedTheme = localStorage.getItem('theme');
      const legacyDarkMode = localStorage.getItem('darkMode');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Determine theme preference from various sources
      if (savedTheme === 'dark') {
        this.isDark = true;
      } else if (savedTheme === 'light') {
        this.isDark = false;
      } else if (legacyDarkMode === 'true') {
        this.isDark = true;
      } else if (legacyDarkMode === 'false') {
        this.isDark = false;
      } else {
        // If no preference, use system preference
        this.isDark = systemPrefersDark;
      }
      
      // Update localStorage with consistent key
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
      // Also set the legacy key for backward compatibility
      localStorage.setItem('darkMode', this.isDark ? 'true' : 'false');
      
      // Apply theme
      this.applyTheme();
      this.isInitialized = true;
      
      // Listen for system preference changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme') || localStorage.getItem('theme') === 'system') {
          this.isDark = e.matches;
          this.applyTheme();
        }
      });
    },
    
    toggleTheme() {
      this.isDark = !this.isDark;
      // Update both storage keys for consistency across the application
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
      localStorage.setItem('darkMode', this.isDark ? 'true' : 'false');
      this.applyTheme();
    },
    
    applyTheme() {
      if (this.isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }
});
