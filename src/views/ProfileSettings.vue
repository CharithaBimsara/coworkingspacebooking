<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto container-padding py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <p class="text-gray-600 mt-1">Manage your account information and preferences</p>
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
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
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
          <div v-if="activeTab === 'personal'" class="bg-white rounded-xl shadow-card p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
            
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
                  <h3 class="text-lg font-medium text-gray-900">{{ profileForm.firstName }} {{ profileForm.lastName }}</h3>
                  <p class="text-gray-600">{{ profileForm.email }}</p>
                  <button type="button" @click="triggerFileUpload" class="text-primary hover:text-primary/80 text-sm font-medium mt-1">
                    Change photo
                  </button>
                </div>
              </div>

              <!-- Form Fields -->
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    v-model="profileForm.firstName"
                    type="text"
                    required
                    class="input-field"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    v-model="profileForm.lastName"
                    type="text"
                    required
                    class="input-field"
                  >
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  v-model="profileForm.email"
                  type="email"
                  required
                  class="input-field"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  v-model="profileForm.phone"
                  type="tel"
                  class="input-field"
                  placeholder="+1 (555) 123-4567"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <input
                  v-model="profileForm.company"
                  type="text"
                  class="input-field"
                  placeholder="Your company name"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                <input
                  v-model="profileForm.jobTitle"
                  type="text"
                  class="input-field"
                  placeholder="Your job title"
                >
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
          <div v-if="activeTab === 'security'" class="bg-white rounded-xl shadow-card p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
            
            <form @submit.prevent="updatePassword" class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  v-model="passwordForm.currentPassword"
                  type="password"
                  required
                  class="input-field"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  v-model="passwordForm.newPassword"
                  type="password"
                  required
                  class="input-field"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  required
                  class="input-field"
                >
              </div>

              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="isUpdatingPassword"
                  class="btn-primary"
                >
                  {{ isUpdatingPassword ? 'Updating...' : 'Update Password' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Preferences -->
          <div v-if="activeTab === 'preferences'" class="bg-white rounded-xl shadow-card p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Preferences</h2>
            
            <div class="space-y-6">
              <!-- Notifications -->
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
                <div class="space-y-4">
                  <label class="flex items-center justify-between">
                    <div>
                      <div class="font-medium text-gray-900">Email Notifications</div>
                      <div class="text-sm text-gray-600">Receive booking confirmations and updates via email</div>
                    </div>
                    <input
                      v-model="preferences.emailNotifications"
                      type="checkbox"
                      class="rounded border-gray-300 text-primary focus:ring-primary"
                    >
                  </label>
                  
                  <label class="flex items-center justify-between">
                    <div>
                      <div class="font-medium text-gray-900">SMS Notifications</div>
                      <div class="text-sm text-gray-600">Receive booking reminders via SMS</div>
                    </div>
                    <input
                      v-model="preferences.smsNotifications"
                      type="checkbox"
                      class="rounded border-gray-300 text-primary focus:ring-primary"
                    >
                  </label>
                  
                  <label class="flex items-center justify-between">
                    <div>
                      <div class="font-medium text-gray-900">Marketing Emails</div>
                      <div class="text-sm text-gray-600">Receive promotional offers and workspace updates</div>
                    </div>
                    <input
                      v-model="preferences.marketingEmails"
                      type="checkbox"
                      class="rounded border-gray-300 text-primary focus:ring-primary"
                    >
                  </label>
                </div>
              </div>

              <!-- Language & Region -->
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Language & Region</h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select v-model="preferences.language" class="input-field">
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <select v-model="preferences.timezone" class="input-field">
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SuccessOverlay from '../components/SuccessOverlay.vue'
import { useAuthStore } from '../stores/auth'

export default defineComponent({
  name: 'ProfileSettings',
  
  components: {
    SuccessOverlay
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
        {
          id: 'preferences',
          name: 'Preferences',
          icon: 'CogIcon'
        }
      ],
      
      profileForm: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        company: 'Tech Startup Inc.',
        jobTitle: 'Product Manager',
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
      return `https://ui-avatars.com/api/?name=${this.profileForm.firstName}+${this.profileForm.lastName}&background=6366F1&color=fff&size=80`
    }
  },
  
  mounted() {
    this.loadUserProfile()
  },
  
  methods: {
    loadUserProfile(): void {
      const authStore = useAuthStore()
      const user = authStore.currentUser
      
      if (user) {
        this.profileForm = {
          firstName: user.firstName || 'John',
          lastName: user.lastName || 'Doe',
          email: user.email || 'john.doe@example.com',
          phone: user.phone || '',
          company: user.company || '',
          jobTitle: user.jobTitle || '',
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
        // In a real app, you would upload this to a server
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
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
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
            avatar: this.profileForm.avatar
          })
        }
        
        this.showSuccessOverlay = true
        this.successTitle = 'Profile Updated!'
        this.successMessage = 'Your profile information has been successfully updated.'
      } catch (error) {
        console.error('Error updating profile:', error)
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
