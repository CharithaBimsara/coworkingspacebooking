<template>
  <div class="w-full">
    <h1 class="text-4xl font-bold mb-2 text-center">Sign In</h1>
    <p class="text-gray-500 dark:text-gray-400 text-center mb-6">Use your registered account</p>

    <div v-if="showError" class="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-center">
      <p class="text-sm text-red-800 dark:text-red-200">{{ errorMessage }}</p>
    </div>

    <form @submit.prevent="handleSignIn" class="space-y-4">
      <div>
        <input
          v-model="signInForm.email"
          type="email"
          required
          class="form-input"
          placeholder="Email"
          autocomplete="email"
        >
      </div>
      
      <div class="relative">
        <input
          v-model="signInForm.password"
          :type="showSignInPassword ? 'text' : 'password'"
          required
          class="form-input pr-10"
          placeholder="Password"
          autocomplete="current-password"
        >
        <button
          type="button"
          @click="toggleSignInPasswordVisibility"
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        >
          <svg v-if="showSignInPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
          <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
        </button>
      </div>

      <div class="flex items-center justify-between text-xs">
        <label class="flex items-center">
          <input type="checkbox" class="rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary-focus">
          <span class="ml-2 text-gray-600 dark:text-gray-300">Remember me</span>
        </label>
        <button @click.prevent="$emit('forgot-password')" class="font-semibold text-primary hover:text-primary-dark">Forgot password?</button>
      </div>

      <button type="submit" class="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-colors duration-200" :disabled="isSigningIn">
        {{ isSigningIn ? 'Signing In...' : 'Sign In' }}
      </button>
    </form>

    <div class="mt-5 text-center">
      <p class="text-gray-600 dark:text-gray-300 text-sm">
        Don't have an account?
        <button @click="$emit('switch-form', 'register')" class="font-semibold text-primary hover:text-primary-dark">
          Sign up
        </button>
      </p>
    </div>
  </div>

  <SuccessOverlay
    :show="showSuccessOverlay"
    :title="successTitle"
    :message="successMessage"
    :primary-action="successAction"
    @close="closeSuccessOverlay"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { apiManager } from '../api/apiManager';
import { SignInForm } from '../helpers/forms';
import SuccessOverlay from '../components/SuccessOverlay.vue';

const emit = defineEmits(['switch-form', 'forgot-password']);

const router = useRouter();
const authStore = useAuthStore();

const isSigningIn = ref(false);
const signInForm = ref(new SignInForm());
const showSignInPassword = ref(false);

const showError = ref(false);
const errorMessage = ref('');
const errorTimeoutId = ref<ReturnType<typeof setTimeout> | null>(null);

const showSuccessOverlay = ref(false);
const successTitle = ref('');
const successMessage = ref('');
const successAction = ref<{ text: string; action: () => void; } | null>(null);

const toggleSignInPasswordVisibility = () => {
  showSignInPassword.value = !showSignInPassword.value;
};

const handleSignIn = async () => {
  if (!signInForm.value.isValid()) {
    showErrorMessage('Please fill in all required fields.');
    return;
  }

  isSigningIn.value = true;
  showError.value = false; // Clear any previous errors

  try {
    const dto = signInForm.value.toDto();
    const response = await apiManager.loginUser(dto.email, dto.password);

    if (response.success && response.user && response.token) {
      authStore.setUser(response.user, response.token);
      signInForm.value.reset();

      // Check if there's a redirect path stored
      const redirectPath = authStore.getRedirectPath();
      authStore.clearRedirectPath(); // Clear it after use

      showSuccessOverlay.value = true;
      successTitle.value = 'Welcome Back!';
      successMessage.value = response.message || 'You have successfully signed in.';
      successAction.value = {
        text: 'OK',
        action: () => {
          if (redirectPath) {
            router.push(redirectPath);
          } else {
            router.push('/');
          }
        },
      };
    } else {
      // Display the error message directly from API response
      showErrorMessage(response.message);
    }
  } catch (error) {
    console.error('Sign in error:', error);
    showErrorMessage('An unexpected error occurred. Please try again.');
  } finally {
    isSigningIn.value = false;
  }
};

const showErrorMessage = (message: string) => {
  if (errorTimeoutId.value) clearTimeout(errorTimeoutId.value);

  errorMessage.value = message;
  showError.value = true;
  errorTimeoutId.value = setTimeout(() => {
    showError.value = false;
  }, 6000);
};



const closeSuccessOverlay = () => {
  showSuccessOverlay.value = false;
};

// Password reset is now handled by the parent Auth component
</script>

<style scoped>
.form-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #1f2937;
  transition: all 0.2s;
  height: 40px;
}

.dark .form-input {
  background-color: #1f2937;
  border-color: #4b5563;
  color: white;
}

.form-input:focus {
  outline: none;
  border-color: #00fe01;
  box-shadow: 0 0 0 2px rgba(0, 254, 1, 0.1);
}

.form-input::placeholder {
  color: #9ca3af;
}

.dark .form-input::placeholder {
  color: #6b7280;
}
</style>
