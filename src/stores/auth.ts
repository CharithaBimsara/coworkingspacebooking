import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useBookingStore } from './booking'
import { UserDto } from '../dto/response'

// Define interface for user data from API
interface UserDataDto {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  company_id?: number;
  [key: string]: unknown;
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<UserDto | null>(null)
  const userDetails = ref<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    jobTitle?: string;
    bio?: string;
    avatar?: string;
    rewardPoints?: number;
    isActive?: boolean;
  } | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const showSignOutMessage = ref(false) // State for sign-out message
  const showSignInMessage = ref(false) // State for sign-in success message
  const redirectPath = ref<string | null>(null) // Store redirect path after login

  // Getters
  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const currentUser = computed(() => user.value)
  const currentUserDetails = computed(() => userDetails.value)

  // Actions
  const setUser = (userData: UserDataDto, authToken: string, fullUserDetails?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    jobTitle?: string;
    bio?: string;
    avatar?: string;
    rewardPoints?: number;
    isActive?: boolean;
  }) => {
    // If full user details are provided, save them to the store
    if (fullUserDetails) {
      userDetails.value = fullUserDetails
    } else {
      // Try to get saved full user details from localStorage (for backward compatibility)
      const savedUserDetails = localStorage.getItem('user_details')
      if (savedUserDetails) {
        try {
          userDetails.value = JSON.parse(savedUserDetails)
        } catch (error) {
          console.error('Error parsing saved user details:', error)
        }
      }
    }

    // Create UserDto from the combination of login response and user details
    let fullUserData: UserDto
    
    if (userDetails.value) {
      // Use the full user details from the store
      fullUserData = new UserDto({
        id: userData.id,
        firstName: userDetails.value.firstName || userData.first_name || '',
        lastName: userDetails.value.lastName || userData.last_name || '',
        email: userData.email,
        phone: userDetails.value.phone || '',
        company: userDetails.value.company || '',
        jobTitle: userDetails.value.jobTitle || '',
        bio: userDetails.value.bio || '',
        avatar: userDetails.value.avatar || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
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
    userDetails.value = null
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
        // Clear reward points from stored data - always fetch fresh from API
        parsedUser.rewardPoints = 0
        user.value = parsedUser
        token.value = storedToken
        
        // Load user details from localStorage and set in store
        if (storedDetails) {
          try {
            userDetails.value = JSON.parse(storedDetails)
            // Clear reward points from stored details - always fetch fresh from API
            if (userDetails.value) {
              userDetails.value.rewardPoints = 0
            }
          } catch (detailsError) {
            console.warn('Error parsing stored user details:', detailsError)
          }
        }
        
        // If we have detailed user info and the stored user doesn't have complete fields,
        // try to update it with the full details
        if (userDetails.value && (!parsedUser.phone || !parsedUser.company || !parsedUser.jobTitle)) {
          // Update user with full details
          user.value = new UserDto({
            ...parsedUser,
            phone: userDetails.value.phone || parsedUser.phone,
            company: userDetails.value.company || parsedUser.company,
            jobTitle: userDetails.value.jobTitle || parsedUser.jobTitle,
            bio: userDetails.value.bio || parsedUser.bio,
            avatar: userDetails.value.avatar || parsedUser.avatar
          })
          
          // Update the stored user with the enhanced data
          localStorage.setItem('workspace_user', JSON.stringify(user.value))
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

  const setUserDetails = (details: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    jobTitle?: string;
    bio?: string;
    avatar?: string;
    isActive?: boolean;
  }) => {
    userDetails.value = details
    // Also persist to localStorage for page reload persistence
    localStorage.setItem('user_details', JSON.stringify(details))
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

  const updateRewardPoints = (points: number) => {
    if (user.value) {
      user.value.rewardPoints = points
      // Removed localStorage storing - always fetch fresh from API
    }
    if (userDetails.value) {
      userDetails.value.rewardPoints = points
      // Removed localStorage storing - always fetch fresh from API
    }
  }

  const deductRewardPoints = (pointsUsed: number) => {
    if (user.value && user.value.rewardPoints) {
      user.value.rewardPoints = Math.max(0, user.value.rewardPoints - pointsUsed)
      // Removed localStorage storing - always fetch fresh from API
    }
    if (userDetails.value && userDetails.value.rewardPoints) {
      userDetails.value.rewardPoints = Math.max(0, userDetails.value.rewardPoints - pointsUsed)
      // Removed localStorage storing - always fetch fresh from API
    }
  }

  const fetchUserRewards = async (userId: number) => {
    try {
      const { apiManager } = await import('../api/apiManager')
      const response = await apiManager.getUserRewards(userId)
      
      if (response.success) {
        updateRewardPoints(response.rewardPoints)
        return response.rewardPoints
      } else {
        console.warn('Failed to fetch user rewards:', response.message)
        return 0
      }
    } catch (error) {
      console.error('Error fetching user rewards:', error)
      return 0
    }
  }

  const setRedirectPath = (path: string | null) => {
    redirectPath.value = path;
  }

  const getRedirectPath = () => {
    return redirectPath.value;
  }

  const clearRedirectPath = () => {
    redirectPath.value = null;
  }

  return {
    // State
    user,
    userDetails,
    token,
    isLoading,
    showSignOutMessage,
    showSignInMessage,
    redirectPath,
    
    // Getters
    isAuthenticated,
    currentUser,
    currentUserDetails,
    
    // Actions
    setUser,
    setUserDetails,
    clearUser,
    initializeAuth,
    setLoading,
    updateUser,
    setShowSignOutMessage,
    clearSignOutMessage,
    setShowSignInMessage,
    clearSignInMessage,
    updateRewardPoints,
    deductRewardPoints,
    fetchUserRewards,
    setRedirectPath,
    getRedirectPath,
    clearRedirectPath
  }
});