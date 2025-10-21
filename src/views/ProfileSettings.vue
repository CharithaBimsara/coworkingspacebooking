<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto container-padding py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
            <p class="text-gray-600 dark:text-gray-300 mt-1">Manage your account information and preferences</p>
          </div>
          <router-link to="/my-bookings" class="btn-primary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </router-link>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto container-padding py-8">
      <div class="grid lg:grid-cols-4 gap-8">
        <!-- Sidebar Navigation -->
        <div class="lg:col-span-1">
          <nav class="space-y-1">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              ]"
            >
              <div class="flex items-center">
                <component :is="tab.icon" class="w-4 h-4 mr-3" />
                {{ tab.name }}
              </div>
            </button>
          </nav>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-3">
          <!-- Personal Information -->
          <div v-if="activeTab === 'personal'" class="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Personal Information</h2>
            
            <form @submit.prevent="updateProfile" class="space-y-6">
              <!-- Profile Picture -->
              <div class="flex items-center space-x-6">
                <div class="relative">
                  <img
                    :src="profileForm.avatar || defaultAvatar"
                    :alt="profileForm.firstName"
                    class="w-20 h-20 rounded-full object-cover"
                  >
                  <button
                    type="button"
                    @click="triggerFileUpload"
                    class="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full hover:bg-primary/90 transition-colors"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    @change="handleFileUpload"
                    class="hidden"
                  >
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ profileForm.firstName }} {{ profileForm.lastName }}</h3>
                  <p class="text-gray-600 dark:text-gray-300">{{ profileForm.email }}</p>
                  <button type="button" @click="triggerFileUpload" class="text-primary hover:text-primary/80 text-sm font-medium mt-1">
                    Change photo
                  </button>
                </div>
              </div>

              <!-- Form Fields -->
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                  <input
                    v-model="profileForm.firstName"
                    type="text"
                    required
                    class="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-gray-500 dark:focus:border-gray-500"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                  <input
                    v-model="profileForm.lastName"
                    type="text"
                    required
                    class="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-gray-500 dark:focus:border-gray-500"
                  >
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input
                  v-model="profileForm.email"
                  type="email"
                  required
                  class="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-gray-500 dark:focus:border-gray-500"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                <input
                  v-model="profileForm.phone"
                  type="tel"
                  class="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-gray-500 dark:focus:border-gray-500"
                  placeholder="+1 (555) 123-4567"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company</label>
                <input
                  v-model="profileForm.company"
                  type="text"
                  class="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-gray-500 dark:focus:border-gray-500"
                  placeholder="Your company name"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Title</label>
                <input
                  v-model="profileForm.jobTitle"
                  type="text"
                  class="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-gray-500 dark:focus:border-gray-500"
                  placeholder="Your job title"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                <textarea
                  v-model="profileForm.bio"
                  rows="3"
                  class="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-gray-500 dark:focus:border-gray-500"
                  placeholder="Tell us about yourself"
                ></textarea>
              </div>

              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="isUpdating"
                  class="btn-primary"
                >
                  {{ isUpdating ? 'Updating...' : 'Update Profile' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Security Settings -->
          <div v-if="activeTab === 'security'" class="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Security Settings</h2>
            
            <!-- Password Reset Option -->
            <div class="mb-6">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">Password</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Need to change your password? Reset it securely.
                  </p>
                </div>
                <button
                  @click="openPasswordResetModal"
                  class="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                >
                  Reset Password
                </button>
              </div>
            </div>          
         
          </div>

          <!-- Sign Out -->
          <div v-if="activeTab === 'signout'" class="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Sign Out</h2>
            
            <div class="mb-6">
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                Are you sure you want to sign out? You will be redirected to the homepage.
              </p>
              
              <div class="flex items-center">
                <button 
                  @click="handleSignOut" 
                  class="btn-danger"
                >
                  <span class="flex items-center">
                    <LogOutIcon class="w-4 h-4 mr-2" />
                    Sign Out
                  </span>
                </button>
              </div>
            </div>
          </div>

          <!-- Preferences -->
          <div v-if="activeTab === 'preferences'" class="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Preferences</h2>
            
            <div class="space-y-6">
              <!-- Notifications -->
              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Notifications</h3>
                <div class="space-y-4">
                  <label class="flex items-center justify-between">
                    <div>
                      <div class="font-medium text-gray-900 dark:text-white">Email Notifications</div>
                      <div class="text-sm text-gray-600 dark:text-gray-300">Receive booking confirmations and updates via email</div>
                    </div>
                    <input
                      v-model="preferences.emailNotifications"
                      type="checkbox"
                      class="rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary dark:focus:ring-gray-500"
                    >
                  </label>
                  
                  <label class="flex items-center justify-between">
                    <div>
                      <div class="font-medium text-gray-900 dark:text-white">SMS Notifications</div>
                      <div class="text-sm text-gray-600 dark:text-gray-300">Receive booking reminders via SMS</div>
                    </div>
                    <input
                      v-model="preferences.smsNotifications"
                      type="checkbox"
                      class="rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary dark:focus:ring-gray-500"
                    >
                  </label>
                  
                  <label class="flex items-center justify-between">
                    <div>
                      <div class="font-medium text-gray-900 dark:text-white">Marketing Emails</div>
                      <div class="text-sm text-gray-600 dark:text-gray-300">Receive promotional offers and workspace updates</div>
                    </div>
                    <input
                      v-model="preferences.marketingEmails"
                      type="checkbox"
                      class="rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary dark:focus:ring-gray-500"
                    >
                  </label>
                </div>
              </div>

              <!-- Language & Region -->
              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Language & Region</h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
                    <select v-model="preferences.language" class="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-gray-500 dark:focus:border-gray-500">
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Timezone</label>
                    <select v-model="preferences.timezone" class="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-gray-500 dark:focus:border-gray-500">
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="flex justify-end">
                <button
                  @click="updatePreferences"
                  :disabled="isUpdatingPreferences"
                  class="btn-primary"
                >
                  {{ isUpdatingPreferences ? 'Updating...' : 'Save Preferences' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Overlay -->
    <SuccessOverlay
      :show="showSuccessOverlay"
      :title="successTitle"
      :message="successMessage"
      @close="closeSuccessOverlay"
    />

    <!-- Password Reset Modal -->
    <PasswordResetModal
      :show="showPasswordResetModal"
      :user-email="profileForm.email"
      @close="closePasswordResetModal"
      @switch-to-signin="handlePasswordResetSwitchToSignIn"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SuccessOverlay from '../components/SuccessOverlay.vue'
import PasswordResetModal from '../components/PasswordResetModal.vue'
import { useAuthStore } from '../stores/auth'
// Note: NetworkManager is dynamically imported in the updateProfile method to avoid circular dependencies

// Define the LogOutIcon component
const LogOutIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-log-out">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  `
}

export default defineComponent({
  name: 'ProfileSettings',
  
  components: {
    SuccessOverlay,
    PasswordResetModal,
    LogOutIcon
  },
  
  data() {
    return {
      activeTab: 'personal',
      isUpdating: false,
      isUpdatingPassword: false,
      isUpdatingPreferences: false,
      showSuccessOverlay: false,
      successTitle: '',
      successMessage: '',
      avatarFile: null as File | null,
      showPasswordResetModal: false,
      
      tabs: [
        {
          id: 'personal',
          name: 'Personal Info',
          icon: 'UserIcon'
        },
        {
          id: 'security',
          name: 'Security',
          icon: 'LockIcon'
        },
        
        // {
        //   id: 'preferences',
        //   name: 'Preferences',
        //   icon: 'CogIcon'
        // }
      ],
      
      profileForm: {
        id: 0,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        jobTitle: '',
        bio: '',
        avatar: ''
      },
      
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        marketingEmails: true,
        language: 'en',
        timezone: 'America/Los_Angeles'
      }
    }
  },
  
  computed: {
    defaultAvatar(): string {
      return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face&auto=format'
    }
  },
  
  mounted() {
    this.loadUserProfile()
  },
  
  methods: {
    handleSignOut(): void {
      const authStore = useAuthStore()
      
      // Clear user data
      authStore.clearUser()
      
      // Redirect to home page using Vue Router instance
      this.$router.push('/')
    },
    
    loadUserProfile(): void {
      const authStore = useAuthStore()
      const user = authStore.currentUser
      
      if (user) {
        this.profileForm = {
          id: user.id || 0,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.phone || '',
          company: user.company || '',
          jobTitle: user.jobTitle || '',
          bio: user.bio || '',
          avatar: user.avatar || ''
        }
      }
    },
    
    triggerFileUpload(): void {
      (this.$refs.fileInput as HTMLInputElement).click()
    },
    
    handleFileUpload(event: Event): void {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (file) {
        // Store the original file for sending to API
        this.avatarFile = file;
        
        // Create a preview for display
        const reader = new FileReader()
        reader.onload = (e) => {
          this.profileForm.avatar = e.target?.result as string
        }
        reader.readAsDataURL(file)
      }
    },
    
    async updateProfile(): Promise<void> {
      this.isUpdating = true
      
      try {
        // Import apiManager
        const { apiManager } = await import('../api/apiManager');
        
        // Call the API
        const result = await apiManager.updateUserProfile({
          Id: this.profileForm.id,
          FirstName: this.profileForm.firstName,
          LastName: this.profileForm.lastName,
          Email: this.profileForm.email,
          Phone: this.profileForm.phone,
          Company: this.profileForm.company,
          JobTitle: this.profileForm.jobTitle,
          Bio: this.profileForm.bio,
          Avatar: this.avatarFile || this.profileForm.avatar
        });
        
        if (result.success) {
          // Update auth store
          const authStore = useAuthStore()
          if (authStore.currentUser) {
            authStore.updateUser({
              ...authStore.currentUser,
              firstName: this.profileForm.firstName,
              lastName: this.profileForm.lastName,
              email: this.profileForm.email,
              phone: this.profileForm.phone,
              company: this.profileForm.company,
              jobTitle: this.profileForm.jobTitle,
              bio: this.profileForm.bio,
              avatar: this.profileForm.avatar
            })
          }
          
          // Reset avatar file after successful update
          this.avatarFile = null;
          
          // Show success message
          this.showSuccessOverlay = true
          this.successTitle = 'Profile Updated!'
          this.successMessage = result.message || 'Your profile information has been successfully updated.'
        } else {
          // Show error message
          this.showSuccessOverlay = true
          this.successTitle = 'Update Failed'
          this.successMessage = result.message || 'Failed to update profile. Please try again.'
        }
      } catch (error) {
        console.error('Error updating profile:', error)
        
        // Show error message
        this.showSuccessOverlay = true
        this.successTitle = 'Error'
        this.successMessage = error instanceof Error ? error.message : 'An unknown error occurred. Please try again.'
      } finally {
        this.isUpdating = false
      }
    },
    
    async updatePassword(): Promise<void> {
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        alert('New passwords do not match')
        return
      }
      
      this.isUpdatingPassword = true
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.passwordForm = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
        
        this.showSuccessOverlay = true
        this.successTitle = 'Password Updated!'
        this.successMessage = 'Your password has been successfully changed.'
      } catch (error) {
        console.error('Error updating password:', error)
      } finally {
        this.isUpdatingPassword = false
      }
    },
    
    async updatePreferences(): Promise<void> {
      this.isUpdatingPreferences = true
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.showSuccessOverlay = true
        this.successTitle = 'Preferences Saved!'
        this.successMessage = 'Your preferences have been successfully updated.'
      } catch (error) {
        console.error('Error updating preferences:', error)
      } finally {
        this.isUpdatingPreferences = false
      }
    },
    
    closeSuccessOverlay(): void {
      this.showSuccessOverlay = false
      this.successTitle = ''
      this.successMessage = ''
    },

    openPasswordResetModal(): void {
      const authStore = useAuthStore()
      const user = authStore.currentUser
      this.showPasswordResetModal = true
    },

    closePasswordResetModal(): void {
      this.showPasswordResetModal = false
    },

    handlePasswordResetSwitchToSignIn(): void {
      this.closePasswordResetModal()
      // Since we're in profile settings, we might want to redirect to home or show a message
      this.showSuccessOverlay = true
      this.successTitle = 'Password Reset Complete'
      this.successMessage = 'Your password has been successfully reset. You can now use your new password to sign in.'
    }
  }
})
</script>

<style scoped>
.input-field {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #D1D5DB;
  border-radius: 0.5rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-field:focus {
  border-color: #6366F1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}

.btn-primary {
  background-color: #6366F1;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: background-color 0.2s;
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #5B5CF6;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #F3F4F6;
  color: #374151;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: background-color 0.2s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.btn-primary:hover {
  background-color: #E5E7EB;
}
</style>
