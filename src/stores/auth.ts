import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserDto } from '../dto/response'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<UserDto | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const currentUser = computed(() => user.value)

  // Actions
  const setUser = (userData: UserDto, authToken: string) => {
    user.value = userData
    token.value = authToken
    
    // Persist to localStorage for session persistence
    localStorage.setItem('workspace_user', JSON.stringify(userData))
    localStorage.setItem('auth_token', authToken)
  }

  const clearUser = () => {
    user.value = null
    token.value = null
    
    // Clear from localStorage
    localStorage.removeItem('workspace_user')
    localStorage.removeItem('auth_token')
  }

  const initializeAuth = () => {
    try {
      const storedUser = localStorage.getItem('workspace_user')
      const storedToken = localStorage.getItem('auth_token')
      
      if (storedUser && storedToken) {
        user.value = JSON.parse(storedUser)
        token.value = storedToken
      }
    } catch (error) {
      console.error('Error initializing auth:', error)
      clearUser()
    }
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const updateUser = (userData: Partial<UserDto>) => {
    if (user.value) {
      user.value = { ...user.value, ...userData }
      localStorage.setItem('workspace_user', JSON.stringify(user.value))
    }
  }

  return {
    // State
    user,
    token,
    isLoading,
    
    // Getters
    isAuthenticated,
    currentUser,
    
    // Actions
    setUser,
    clearUser,
    initializeAuth,
    setLoading,
    updateUser
  }
})