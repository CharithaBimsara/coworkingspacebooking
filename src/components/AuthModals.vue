<template>
  <!-- Sign In Modal -->
  <div v-if="showSignIn" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeModals">
    <div class="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4" @click.stop>
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h2>
        <p class="text-gray-600 dark:text-gray-300">Sign in to your account</p>
        <!-- Context Message -->
        <div v-if="contextMessage" class="mt-3 p-3 bg-primary-50 dark:bg-primary-900/30 border border-black-200 dark:border-black-700 rounded-lg">
          <p class="text-sm text-primary-800 dark:text-primary-200">{{ contextMessage }}</p>
        </div>
        <!-- Error Message -->
        <div v-if="showError" class="mt-3 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-800 dark:text-red-200">{{ errorMessage }}</p>
            </div>
          </div>
        </div>
      </div>

      <form @submit.prevent="handleSignIn" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-black dark:text-white mb-1">Email</label>
          <input
            v-model="signInForm.email"
            type="email"
            required
            class="input-field"
            placeholder="Enter your email"
            autocomplete="email"
          >
        </div>
        
        <div>
          <label class="block text-sm font-medium text-black dark:text-white mb-1">Password</label>
          <input
            v-model="signInForm.password"
            type="password"
            required
            class="input-field"
            placeholder="Enter your password"
            autocomplete="current-password"
          >
        </div>

        <div class="flex items-center justify-between">
          <label class="flex items-center">
            <input type="checkbox" class="rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary">
            <span class="ml-2 text-sm text-gray-600 dark:text-gray-300">Remember me</span>
          </label>
          <a href="#" class="text-sm font-bold text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300">Forgot password?</a>
        </div>

        <button type="submit" class="w-full btn-primary" :disabled="isSigningIn">
          {{ isSigningIn ? 'Signing In...' : 'Sign In' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600 dark:text-gray-300">
          Don't have an account?
          <button @click="switchToSignUp" class="font-bold text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300">
            Sign up
          </button>
        </p>
      </div>
    </div>
  </div>

  <!-- Sign Up Modal -->
  <div v-if="showSignUp" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeModals">
    <div class="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4" @click.stop>
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h2>
        <p class="text-gray-600 dark:text-gray-300">Join our workspace community</p>
        <!-- Context Message -->
        <div v-if="contextMessage" class="mt-3 p-3 bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700 rounded-lg">
          <p class="text-sm text-primary-800 dark:text-primary-200">{{ contextMessage }}</p>
        </div>
        <!-- Error Message -->
        <div v-if="showError" class="mt-3 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-800 dark:text-red-200">{{ errorMessage }}</p>
            </div>
          </div>
        </div>
      </div>

      <form @submit.prevent="handleSignUp" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-black dark:text-white mb-1">First Name</label>
            <input
              v-model="signUpForm.firstName"
              type="text"
              required
              class="input-field"
              placeholder="First name"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-black dark:text-white mb-1">Last Name</label>
            <input
              v-model="signUpForm.lastName"
              type="text"
              required
              class="input-field"
              placeholder="Last name"
            >
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-black dark:text-white mb-1">Phone Number</label>
          <input
            v-model="signUpForm.phone"
            type="tel"
            required
            class="input-field"
            placeholder="Enter your phone number"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-black dark:text-white mb-1">Email</label>
          <input
            v-model="signUpForm.email"
            type="email"
            required
            class="input-field"
            placeholder="Enter your email"
          >
        </div>
        
        <div>
          <label class="block text-sm font-medium text-black dark:text-white mb-1">Password</label>
          <input
            v-model="signUpForm.password"
            type="password"
            required
            class="input-field"
            placeholder="Create a password"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-black dark:text-white mb-1">Confirm Password</label>
          <input
            v-model="signUpForm.confirmPassword"
            type="password"
            required
            class="input-field"
            placeholder="Confirm your password"
          >
        </div>        <div>
          <label class="flex items-center">
            <input 
              v-model="signUpForm.agreeToTerms"
              type="checkbox" 
              required
              class="rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
            >
            <span class="ml-2 text-sm text-gray-600 dark:text-gray-300">
              I agree to the <a href="#" class="font-bold text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300">Terms of Service</a> and 
              <a href="#" class="font-bold text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300">Privacy Policy</a>
            </span>
          </label>
        </div>

        <button type="submit" class="w-full btn-primary" :disabled="isSigningUp">
          {{ isSigningUp ? 'Creating Account...' : 'Create Account' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600 dark:text-gray-300">
          Already have an account?
          <button @click="switchToSignIn" class="font-bold text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300">
            Sign in
          </button>
        </p>
      </div>
    </div>
  </div>

  <!-- Success Overlay -->
  <SuccessOverlay
    :show="showSuccessOverlay"
    :title="successTitle"
    :message="successMessage"
    :primary-action="successAction"
    @close="closeSuccessOverlay"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SuccessOverlay from './SuccessOverlay.vue';
import { NetworkManager, type AuthResponse } from '../api/networkManager';
import { SignInForm, SignUpForm } from '../helpers/forms';
import { useAuthStore } from '../stores/auth';
import type { PropType } from 'vue';

export default defineComponent({
  name: 'AuthModals',
  
  components: {
    SuccessOverlay
  },
  
  emits: ['close', 'user-authenticated', 'switch-to-signup', 'switch-to-signin'],
  props: {
    showSignIn: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    showSignUp: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    redirectPath: {
      type: String as PropType<string>,
      default: '/my-bookings'
    },
    contextMessage: {
      type: String as PropType<string>,
      default: ''
    }
  },
  
  data() {
    return {
      isSigningIn: false,
      isSigningUp: false,
      signInForm: new SignInForm(),
      signUpForm: new SignUpForm(),
      showSuccessOverlay: false,
      successTitle: '',
      successMessage: '',
      successAction: null as any,
      errorMessage: '',
      showError: false,
      _errorTimeout: null as ReturnType<typeof setTimeout> | null
    };
  },
  
  methods: {
    closeModals() {
      this.$emit('close');
    },
    
    switchToSignUp() {
      this.$emit('switch-to-signup');
    },
    
    switchToSignIn() {
      this.$emit('switch-to-signin');
    },
    
    async handleSignIn() {
      console.log('Sign in attempt:', this.signInForm);
      
      // Validate form before proceeding
      if (!this.signInForm.isValid()) {
        alert('Please fill in all required fields.');
        return;
      }
      
      this.isSigningIn = true;
      
      try {
        // Use NetworkManager directly for sign in
        const dto = this.signInForm.toDto();
        const response = await NetworkManager.loginUser(dto.email, dto.password);
        
        if (response.success && response.user && response.token) {
          // Store user in Pinia store
          const authStore = useAuthStore();
          authStore.setUser(response.user, response.token);
          
          console.log('User signed in successfully:', response.user);
          
          // Emit authentication event
          this.$emit('user-authenticated', response.user);
          
          // Close modal
          this.closeModals();
          
          // Reset form using the helper method
          this.signInForm.reset();
          
          // Show success overlay
          this.showSuccessOverlay = true;
          this.successTitle = 'Welcome Back!';
          this.successMessage = response.message || 'You have successfully signed in to your account. Do you need to see your bookings?';
          this.successAction = {
            text: 'Continue',
            action: () => {
              // Navigate to dashboard or previous page
              this.$router?.push(this.redirectPath).catch(() => {});
            }
          };
        } else {
          // Show error message in a more user-friendly way
          // You could replace this with a more styled error message component
          this.showErrorMessage(response.message || 'Failed to sign in. Please check your credentials and try again.');
        }
      } catch (error) {
        console.error('Sign in error:', error);
        this.showErrorMessage('An error occurred during sign in. Please try again.');
      } finally {
        this.isSigningIn = false;
      }
    },
    
    async handleSignUp() {
      console.log('Sign up attempt:', this.signUpForm);
      
      // Validate form before proceeding
      if (!this.signUpForm.isValid()) {
        this.showErrorMessage('Please fill in all required fields and agree to the terms.');
        return;
      }
      
      // Check if passwords match using the helper method
      if (!this.signUpForm.passwordsMatch()) {
        this.showErrorMessage('Passwords do not match.');
        return;
      }
      
      this.isSigningUp = true;
      
      try {
        // Use NetworkManager directly for sign up
        const dto = this.signUpForm.toDto();
        const response = await NetworkManager.registerUser({
          FirstName: dto.firstName,
          LastName: dto.lastName,
          Email: dto.email,
          Password: dto.password,
          Phone: dto.phone,
          Company: "",
          JobTitle: "",
          Bio: ""
        });
        
        if (response.success) {
          console.log('User registered successfully');
          
          // Reset form using the helper method
          this.signUpForm.reset();
          
          // Show success overlay
          this.showSuccessOverlay = true;
          this.successTitle = 'Account Created!';
          this.successMessage = response.message || 'Your account has been created successfully. Please sign in with your new credentials.';
          this.successAction = {
            text: 'Sign In',
            action: () => {
              // Switch to sign in form
              this.closeSuccessOverlay();
              this.switchToSignIn();
            }
          };
        } else {
          // Show error message in a more user-friendly way
          this.showErrorMessage(response.message || 'Failed to create account. Please try again.');
        }
      } catch (error) {
        console.error('Sign up error:', error);
        this.showErrorMessage('An error occurred during sign up. Please try again.');
      } finally {
        this.isSigningUp = false;
      }
    },
    
    closeSuccessOverlay(): void {
      this.showSuccessOverlay = false;
      this.successTitle = '';
      this.successMessage = '';
      this.successAction = null;
    },
    
    // Method to display error messages
    showErrorMessage(message: string): void {
      // Clean up any previous error timers
      if (this._errorTimeout) {
        clearTimeout(this._errorTimeout);
      }
      
      // Format common error messages to be more user-friendly
      let formattedMessage = message;
      
      if (message.includes('401') || message.toLowerCase().includes('unauthorized')) {
        formattedMessage = 'Incorrect email or password. Please try again.';
      } else if (message.includes('404') || message.toLowerCase().includes('not found')) {
        formattedMessage = 'Account not found. Please check your email address.';
      } else if (message.includes('429') || message.toLowerCase().includes('too many')) {
        formattedMessage = 'Too many attempts. Please try again later.';
      } else if (message.includes('network error') || message.toLowerCase().includes('connection')) {
        formattedMessage = 'Network error. Please check your internet connection.';
      } else if (message.toLowerCase().includes('email already exists') || message.includes('409')) {
        formattedMessage = 'An account with this email already exists. Please use a different email or sign in.';
      } else if (message.toLowerCase().includes('password') && message.toLowerCase().includes('requirements')) {
        formattedMessage = 'Password does not meet requirements. Please use at least 8 characters with uppercase, lowercase, and numbers.';
      } else if (message.toLowerCase().includes('invalid email')) {
        formattedMessage = 'Please enter a valid email address.';
      }
      
      this.errorMessage = formattedMessage;
      this.showError = true;
      
      // Auto-hide the error after 6 seconds
      this._errorTimeout = setTimeout(() => {
        this.showError = false;
        this.errorMessage = '';
      }, 6000);
    }
  }
})
</script>

<style scoped>
.input-field {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #E5E7EB; /* Light gray border */
  border-radius: 0.5rem;
  outline: none;
  background: #FFFFFF; /* White background */
  font-size: 0.875rem;
  transition: border-color 0.2s ease-in-out;
}

.input-field:focus {
  border-color: #D1D5DB; /* Lighter gray on focus */
  outline: none;
}

/* Dark mode styles */
.dark .input-field {
  border-color: #4B5563; /* Dark gray border */
  background: #1F2937; /* Dark background */
  color: #F9FAFB; /* Light text */
}

.dark .input-field:focus {
  border-color: #6B7280; /* Lighter gray on focus in dark mode */
}

.btn-primary {
  background-color: #00FE01;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: rgba(0, 254, 1, 0.9);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 254, 1, 0.3);
}

.btn-primary:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 254, 1, 0.2);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
</style>