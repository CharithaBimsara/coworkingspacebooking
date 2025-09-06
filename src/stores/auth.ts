import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useBookingStore } from './booking'
import { UserDto } from '../dto/response'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<UserDto | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const showSignOutMessage = ref(false) // State for sign-out message
  const showSignInMessage = ref(false) // State for sign-in success message

  // Getters
  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const currentUser = computed(() => user.value)

  // Actions
  const setUser = (userData: any, authToken: string) => {
    // Try to get saved full user details
    const savedUserDetails = localStorage.getItem('user_details')
    let fullUserData: UserDto
    
    if (savedUserDetails) {
      try {
        // Parse the saved user details
        const userDetails = JSON.parse(savedUserDetails)
        
        // Create a proper UserDto from the combination of login response and saved details
        fullUserData = new UserDto({
          id: userData.id,
          firstName: userDetails.firstName || userData.first_name || '',
          lastName: userDetails.lastName || userData.last_name || '',
          email: userData.email,
          phone: userDetails.phone || '',
          company: userDetails.company || '',
          jobTitle: userDetails.jobTitle || '',
          bio: userDetails.bio || '',
          avatar: userDetails.avatar || '',
          createdAt: userDetails.createdAt || new Date().toISOString(),
          updatedAt: userDetails.updatedAt || new Date().toISOString()
        })
      } catch (error) {
        console.error('Error parsing saved user details:', error)
        // If there's an error, create a basic UserDto from the login data
        fullUserData = new UserDto({
          id: userData.id,
          firstName: userData.first_name || '',
          lastName: userData.last_name || '',
          email: userData.email,
          avatar: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      }
    } else {
      // No saved details, create a basic UserDto from the login data
      fullUserData = new UserDto({
        id: userData.id,
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        email: userData.email,
        avatar: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    }
    
    // Set the properly formatted user in state
    user.value = fullUserData
    token.value = authToken
    
    // Persist to localStorage for session persistence
    localStorage.setItem('workspace_user', JSON.stringify(fullUserData))
    localStorage.setItem('auth_token', authToken)
    
    // Show sign-in success message
    setShowSignInMessage(true)
  }

  const clearUser = () => {
    user.value = null
    token.value = null
    
    // Clear from localStorage
    localStorage.removeItem('workspace_user')
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_details')

    // Clear booking details from sessionStorage on logout
    const bookingStore = useBookingStore();
    bookingStore.clearBookingDetails();

    // Show sign-out message
    setShowSignOutMessage(true);
  }

  const initializeAuth = () => {
    try {
      const storedUser = localStorage.getItem('workspace_user')
      const storedToken = localStorage.getItem('auth_token')
      const storedDetails = localStorage.getItem('user_details')
      
      if (storedUser && storedToken) {
        // Start with the basic stored user data
        const parsedUser = JSON.parse(storedUser)
        user.value = parsedUser
        token.value = storedToken
        
        // If we have detailed user info and the stored user doesn't have complete fields,
        // try to update it with the full details
        if (storedDetails && (!parsedUser.phone || !parsedUser.company || !parsedUser.jobTitle)) {
          try {
            const userDetails = JSON.parse(storedDetails)
            // Update user with full details
            user.value = new UserDto({
              ...parsedUser,
              phone: userDetails.phone || parsedUser.phone,
              company: userDetails.company || parsedUser.company,
              jobTitle: userDetails.jobTitle || parsedUser.jobTitle,
              bio: userDetails.bio || parsedUser.bio,
              avatar: userDetails.avatar || parsedUser.avatar
            })
            
            // Update the stored user with the enhanced data
            localStorage.setItem('workspace_user', JSON.stringify(user.value))
          } catch (detailsError) {
            console.warn('Error parsing stored user details:', detailsError)
          }
        }
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

  const setShowSignOutMessage = (value: boolean) => {
    showSignOutMessage.value = value;
  }

  const clearSignOutMessage = () => {
    showSignOutMessage.value = false;
  }
  
  const setShowSignInMessage = (value: boolean) => {
    showSignInMessage.value = value;
  }

  const clearSignInMessage = () => {
    showSignInMessage.value = false;
  }

  return {
    // State
    user,
    token,
    isLoading,
    showSignOutMessage,
    showSignInMessage,
    
    // Getters
    isAuthenticated,
    currentUser,
    
    // Actions
    setUser,
    clearUser,
    initializeAuth,
    setLoading,
    updateUser,
    setShowSignOutMessage,
    clearSignOutMessage,
    setShowSignInMessage,
    clearSignInMessage
  }
})