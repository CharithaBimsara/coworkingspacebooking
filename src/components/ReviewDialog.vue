<template>
  <div @click="$emit('close')" class="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
    <div @click.stop class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg overflow-hidden shadow-xl transform transition-all">
      <!-- Header -->
      <div class="bg-gradient-to-r from-primary/10 to-primary/20 dark:from-primary/20 dark:to-primary/30 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <h3 class="font-semibold text-lg text-gray-900 dark:text-white">
          <span class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Write a Review
          </span>
        </h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Content -->
      <div class="px-6 py-4">
        <!-- Login notification if not logged in -->
        <div v-if="!isLoggedIn" class="mb-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 text-yellow-800 dark:text-yellow-300">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium">
                You need to be logged in to write a review. 
                <button @click="showLoginForm = true" class="font-bold underline hover:text-primary">
                  Log in now
                </button>
              </p>
            </div>
          </div>
        </div>
        
        <!-- Login form -->
        <div v-if="!isLoggedIn && showLoginForm" class="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <h4 class="font-medium text-gray-900 dark:text-white mb-3">Login to continue</h4>
          
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input 
                v-model="loginForm.email"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="email@example.com"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <input 
                v-model="loginForm.password"
                type="password"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="********"
              >
            </div>
            <div v-if="loginError" class="text-red-500 text-sm">{{ loginError }}</div>
            <div class="flex space-x-3">
              <button 
                @click="handleLogin"
                :disabled="isLoggingIn"
                class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50">
                {{ isLoggingIn ? 'Logging in...' : 'Login' }}
              </button>
              <button 
                @click="showLoginForm = false"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
        
        <!-- Review form (for logged in users) -->
        <form v-if="isLoggedIn" @submit.prevent="submitReview" class="space-y-4">
          <!-- Rating Stars -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Rating</label>
            <div class="flex space-x-2">
              <button 
                v-for="star in 5" 
                :key="star"
                type="button"
                @click="rating = star"
                class="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full p-1"
              >
                <svg :class="['w-8 h-8 transition-all duration-200', star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600 hover:text-yellow-200']" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            </div>
            <p v-if="!rating && formSubmitted" class="mt-1 text-sm text-red-600 dark:text-red-500">Please select a rating</p>
          </div>
          
          <!-- Review Text -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Review</label>
            <textarea
              v-model="reviewText"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Share your experience with this space..."
            ></textarea>
            <p v-if="reviewText.trim() === '' && formSubmitted" class="mt-1 text-sm text-red-600 dark:text-red-500">Please write a review</p>
          </div>
          
          <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-3 text-red-800 dark:text-red-300 text-sm">
            {{ error }}
          </div>
        </form>
        
        <!-- Guest Review Form (if showing guest form) -->
        <form v-if="!isLoggedIn && showGuestForm" @submit.prevent="submitReview" class="space-y-4">
          <!-- Name input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Name</label>
            <input
              v-model="guestName"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter your name"
            >
            <p v-if="guestName.trim() === '' && formSubmitted" class="mt-1 text-sm text-red-600 dark:text-red-500">Please enter your name</p>
          </div>
          
          <!-- Rating Stars -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Rating</label>
            <div class="flex space-x-2">
              <button 
                v-for="star in 5" 
                :key="star"
                type="button"
                @click="rating = star"
                class="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full p-1"
              >
                <svg :class="['w-8 h-8 transition-all duration-200', star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600 hover:text-yellow-200']" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            </div>
            <p v-if="!rating && formSubmitted" class="mt-1 text-sm text-red-600 dark:text-red-500">Please select a rating</p>
          </div>
          
          <!-- Review Text -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Review</label>
            <textarea
              v-model="reviewText"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Share your experience with this space..."
            ></textarea>
            <p v-if="reviewText.trim() === '' && formSubmitted" class="mt-1 text-sm text-red-600 dark:text-red-500">Please write a review</p>
          </div>
          
          <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-3 text-red-800 dark:text-red-300 text-sm">
            {{ error }}
          </div>
        </form>
        
        <!-- Login or create account option -->
        <div v-if="!isLoggedIn && !showLoginForm && !showGuestForm" class="flex flex-col space-y-3 items-center py-4">
          <p class="text-gray-600 dark:text-gray-400 text-center">
            You need to be logged in to write a review
          </p>
          <div class="flex flex-col sm:flex-row gap-3">
            <button 
              @click="$emit('show-signup')"
              class="px-4 py-2 bg-white border border-black text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              Create Account
            </button>
            <button 
              @click="showLoginForm = true"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              Login Now
            </button>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-end border-t border-gray-100 dark:border-gray-700 space-x-3">
        <button 
          @click="$emit('close')"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          Cancel
        </button>
        <button 
          v-if="isLoggedIn || showGuestForm"
          @click="submitReview"
          :disabled="isSubmitting"
          class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors">
          {{ isSubmitting ? 'Submitting...' : 'Submit Review' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { apiManager } from '../api/apiManager';

const props = defineProps({
  spaceId: {
    type: Number,
    required: true
  },
  spaceName: {
    type: String,
    default: 'this space'
  }
});

const emit = defineEmits(['close', 'show-signup', 'review-submitted']);

// State
const authStore = useAuthStore();
const isLoggedIn = computed(() => !!authStore.currentUser);
const rating = ref(0);
const reviewText = ref('');
const guestName = ref('');
const error = ref('');
const isSubmitting = ref(false);
const showLoginForm = ref(false);
const showGuestForm = ref(false);
const formSubmitted = ref(false);
const loginForm = ref({
  email: '',
  password: ''
});
const isLoggingIn = ref(false);
const loginError = ref('');

// Methods
const submitReview = async () => {
  formSubmitted.value = true;
  
  // Validate inputs
  if (!rating.value) {
    error.value = 'Please select a rating';
    return;
  }
  
  if (!reviewText.value.trim()) {
    error.value = 'Please write a review';
    return;
  }
  
  if (!isLoggedIn.value && showGuestForm.value && !guestName.value.trim()) {
    error.value = 'Please enter your name';
    return;
  }
  
  error.value = '';
  isSubmitting.value = true;
  
  try {
    // Prepare review data
    const reviewData = {
      product_id: props.spaceId,
      user_id: isLoggedIn.value && authStore.currentUser ? authStore.currentUser.id : 0,
      first_name: isLoggedIn.value && authStore.currentUser ? authStore.currentUser.firstName : guestName.value,
      value: rating.value,
      review_description: reviewText.value.trim()
    };
    
    // Submit review
    const response = await apiManager.addRating(reviewData);
    
    if (response.success) {
      emit('review-submitted', response.review);
      emit('close');
    } else {
      error.value = response.message;
    }
  } catch (e) {
    error.value = 'An error occurred while submitting your review. Please try again.';
    console.error('Review submission error:', e);
  } finally {
    isSubmitting.value = false;
  }
};

const handleLogin = async () => {
  loginError.value = '';
  
  if (!loginForm.value.email.trim() || !loginForm.value.password.trim()) {
    loginError.value = 'Please enter both email and password';
    return;
  }
  
  isLoggingIn.value = true;
  
  try {
    const response = await apiManager.loginUser(
      loginForm.value.email.trim(), 
      loginForm.value.password.trim()
    );
    
    if (response.success && response.user && response.token) {
      // Update auth store
      authStore.setUser(response.user, response.token);
      
      // Hide login form
      showLoginForm.value = false;
    } else {
      loginError.value = response.message || 'Login failed';
    }
  } catch (e) {
    loginError.value = 'An error occurred during login. Please try again.';
    console.error('Login error:', e);
  } finally {
    isLoggingIn.value = false;
  }
};
</script>
