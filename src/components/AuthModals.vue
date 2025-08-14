<template>
  <!-- Sign In Modal -->
  <div v-if="showSignIn" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeModals">
    <div class="bg-white rounded-xl p-8 max-w-md w-full mx-4" @click.stop>
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p class="text-gray-600">Sign in to your account</p>
      </div>

      <form @submit.prevent="handleSignIn" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            v-model="signInForm.email"
            type="email"
            required
            class="input-field"
            placeholder="Enter your email"
          >
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            v-model="signInForm.password"
            type="password"
            required
            class="input-field"
            placeholder="Enter your password"
          >
        </div>

        <div class="flex items-center justify-between">
          <label class="flex items-center">
            <input type="checkbox" class="rounded border-gray-300 text-primary focus:ring-primary">
            <span class="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <a href="#" class="text-sm text-primary hover:text-primary/80">Forgot password?</a>
        </div>

        <button type="submit" class="w-full btn-primary" :disabled="isSigningIn">
          {{ isSigningIn ? 'Signing In...' : 'Sign In' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600">
          Don't have an account?
          <button @click="switchToSignUp" class="text-primary hover:text-primary/80 font-medium">
            Sign up
          </button>
        </p>
      </div>
    </div>
  </div>

  <!-- Sign Up Modal -->
  <div v-if="showSignUp" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeModals">
    <div class="bg-white rounded-xl p-8 max-w-md w-full mx-4" @click.stop>
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
        <p class="text-gray-600">Join our workspace community</p>
      </div>

      <form @submit.prevent="handleSignUp" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              v-model="signUpForm.firstName"
              type="text"
              required
              class="input-field"
              placeholder="First name"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
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
          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            v-model="signUpForm.email"
            type="email"
            required
            class="input-field"
            placeholder="Enter your email"
          >
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            v-model="signUpForm.password"
            type="password"
            required
            class="input-field"
            placeholder="Create a password"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
          <input
            v-model="signUpForm.confirmPassword"
            type="password"
            required
            class="input-field"
            placeholder="Confirm your password"
          >
        </div>

        <div>
          <label class="flex items-center">
            <input 
              v-model="signUpForm.agreeToTerms"
              type="checkbox" 
              required
              class="rounded border-gray-300 text-primary focus:ring-primary"
            >
            <span class="ml-2 text-sm text-gray-600">
              I agree to the <a href="#" class="text-primary hover:text-primary/80">Terms of Service</a> and 
              <a href="#" class="text-primary hover:text-primary/80">Privacy Policy</a>
            </span>
          </label>
        </div>

        <button type="submit" class="w-full btn-primary" :disabled="isSigningUp">
          {{ isSigningUp ? 'Creating Account...' : 'Create Account' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600">
          Already have an account?
          <button @click="switchToSignIn" class="text-primary hover:text-primary/80 font-medium">
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
import { AuthAPI } from '../api';
import { SignInForm, SignUpForm } from '../helpers/forms';
import { useAuthStore } from '../stores/auth';
import type { PropType } from 'vue';

export default defineComponent({
  name: 'AuthModals',
  
  components: {
    SuccessOverlay
  },
  
  emits: ['close', 'user-authenticated'],
  props: {
    showSignIn: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    showSignUp: {
      type: Boolean as PropType<boolean>,
      default: false
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
      successAction: null as any
    };
  },
  
  methods: {
    closeModals() {
      this.$emit('close');
    },
    
    switchToSignUp() {
      this.$emit('close');
      this.$nextTick(() => {
        // @ts-ignore
        this.$parent.showSignUpModal = true;
      });
    },
    
    switchToSignIn() {
      this.$emit('close');
      this.$nextTick(() => {
        // @ts-ignore
        this.$parent.showSignInModal = true;
      });
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
        // Use the API function for sign in
        const response = await AuthAPI.signIn(this.signInForm.toDto());
        
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
          this.successMessage = response.message || 'You have successfully signed in to your account.';
          this.successAction = {
            text: 'Continue',
            action: () => {
              // Navigate to dashboard or previous page
              this.$router?.push('/my-bookings').catch(() => {});
            }
          };
        } else {
          // Show error message
          alert(response.message || 'Failed to sign in. Please try again.');
        }
      } catch (error) {
        console.error('Sign in error:', error);
        alert('An error occurred during sign in. Please try again.');
      } finally {
        this.isSigningIn = false;
      }
    },
    
    async handleSignUp() {
      console.log('Sign up attempt:', this.signUpForm);
      
      // Validate form before proceeding
      if (!this.signUpForm.isValid()) {
        alert('Please fill in all required fields and agree to the terms.');
        return;
      }
      
      // Check if passwords match using the helper method
      if (!this.signUpForm.passwordsMatch()) {
        alert('Passwords do not match.');
        return;
      }
      
      this.isSigningUp = true;
      
      try {
        // Use the API function for sign up
        const response = await AuthAPI.signUp(this.signUpForm.toDto());
        
        if (response.success && response.user && response.token) {
          // Store user in Pinia store
          const authStore = useAuthStore();
          authStore.setUser(response.user, response.token);
          
          console.log('User registered successfully:', response.user);
          
          // Emit authentication event
          this.$emit('user-authenticated', response.user);
          
          // Close modal
          this.closeModals();
          
          // Reset form using the helper method
          this.signUpForm.reset();
          
          // Show success overlay
          this.showSuccessOverlay = true;
          this.successTitle = 'Account Created!';
          this.successMessage = response.message || 'Your account has been created successfully. Welcome to our workspace community!';
          this.successAction = {
            text: 'Get Started',
            action: () => {
              // Navigate to onboarding or dashboard
              this.$router?.push('/my-bookings').catch(() => {});
            }
          };
        } else {
          // Show error message
          alert(response.message || 'Failed to create account. Please try again.');
        }
      } catch (error) {
        console.error('Sign up error:', error);
        alert('An error occurred during sign up. Please try again.');
      } finally {
        this.isSigningUp = false;
      }
    },
    
    closeSuccessOverlay(): void {
      this.showSuccessOverlay = false;
      this.successTitle = '';
      this.successMessage = '';
      this.successAction = null;
    }
  }
})
</script>

<style scoped>
.input-field {
  width: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border: 1px solid #D1D5DB; /* gray-300 */
  border-radius: 0.5rem; /* rounded-lg */
  outline: none;
  transition: box-shadow 0.2s, border-color 0.2s;
}
.input-field:focus {
  border-color: #6366F1; /* primary (example: indigo-500) */
  box-shadow: 0 0 0 2px #6366F1;
}

.btn-primary {
  background-color: #6366F1; /* primary (example: indigo-500) */
  color: #fff;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: background 0.2s, box-shadow 0.2s;
  outline: none;
  border: none;
}
.btn-primary:hover {
  background-color: #4F46E5; /* primary/90 (example: indigo-600) */
}
.btn-primary:focus {
  box-shadow: 0 0 0 2px #6366F1;
}
.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>