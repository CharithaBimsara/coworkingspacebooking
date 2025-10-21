<template>
  <div class="w-full">
    <transition name="fade-slide" mode="out-in">
      <!-- Step 1: Send Reset Link -->
      <div v-if="currentStep === 1" key="step-1" class="reset-step">
        <h1 class="text-4xl font-bold mb-2 text-center animate-fade-in">Reset Password</h1>
        <p class="text-gray-500 dark:text-gray-400 text-center mb-6 animate-fade-in-delayed">Enter your email to receive a reset code</p>

        <!-- Error Message -->
        <transition name="fade-slide-down">
          <div v-if="showError" class="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-center">
            <p class="text-sm text-red-800 dark:text-red-200">{{ errorMessage }}</p>
          </div>
        </transition>

        <!-- Success Message -->
        <transition name="fade-slide-down">
          <div v-if="showSuccess" class="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg text-center">
            <p class="text-sm text-green-800 dark:text-green-200">{{ successMessage }}</p>
          </div>
        </transition>

        <form @submit.prevent="handleSendResetLink" class="space-y-4 animate-fade-in-delayed-2">
          <div>
            <input
              v-model="email"
              type="email"
              required
              class="form-input"
              placeholder="Email"
              autocomplete="email"
            >
          </div>
          
          <button type="submit" class="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-all duration-200 hover:scale-[1.02]" :disabled="isSendingLink || resendTimer > 0">
            {{ isSendingLink ? 'Sending...' : resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Send Reset Link' }}
          </button>
        </form>

        <div class="mt-5 text-center animate-fade-in-delayed-3">
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            Remember your password?
            <button @click="$emit('back-to-login')" class="font-semibold text-primary hover:text-primary-dark hover:underline transition-all">
              Sign in
            </button>
          </p>
        </div>
      </div>

      <!-- Step 2: Enter Reset Code -->
      <div v-else-if="currentStep === 2" key="step-2" class="reset-step">
        <h1 class="text-4xl font-bold mb-2 text-center animate-fade-in">Verify Code</h1>
        <p class="text-gray-500 dark:text-gray-400 text-center mb-6 animate-fade-in-delayed">We've sent a reset code to {{ email }}</p>

        <!-- Error Message -->
        <transition name="fade-slide-down">
          <div v-if="showError" class="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-center">
            <p class="text-sm text-red-800 dark:text-red-200">{{ errorMessage }}</p>
          </div>
        </transition>

        <form @submit.prevent="verifyOtpCode" class="space-y-4 animate-fade-in-delayed-2">
          <div class="flex justify-center space-x-2">
            <input
              v-for="(digit, index) in otpDigits"
              :key="index"
              v-model="otpDigits[index]"
              type="text"
              maxlength="1"
              class="w-12 h-12 text-center text-lg font-bold border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:border-primary focus:ring-1 focus:ring-primary otp-input"
              :ref="el => otpInputRefs[index] = el"
              @input="onOtpInput(index)"
              @paste="handleOtpPaste"
              @keydown="handleOtpKeydown($event, index)"
            >
          </div>

          <div class="text-center">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Didn't receive a code?</p>
            <button 
              type="button" 
              class="text-primary hover:text-primary-dark text-sm font-medium transition-all hover:underline" 
              :disabled="resendTimer > 0"
              @click="handleSendResetLink"
            >
              {{ resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code' }}
            </button>
          </div>
          
          <button type="submit" class="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-all duration-200 hover:scale-[1.02]" :disabled="isVerifying">
            {{ isVerifying ? 'Verifying...' : 'Verify Code' }}
          </button>
        </form>

        <div class="mt-5 text-center animate-fade-in-delayed-3">
          <button @click="currentStep = 1" class="text-sm text-gray-600 dark:text-gray-400 hover:underline transition-all">
            Back to Email
          </button>
        </div>
      </div>

      <!-- Step 3: Create New Password -->
      <div v-else-if="currentStep === 3" key="step-3" class="reset-step">
        <h1 class="text-4xl font-bold mb-2 text-center animate-fade-in">New Password</h1>
        <p class="text-gray-500 dark:text-gray-400 text-center mb-6 animate-fade-in-delayed">Create your new password</p>

        <!-- Error Message -->
        <transition name="fade-slide-down">
          <div v-if="showError" class="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-center">
            <p class="text-sm text-red-800 dark:text-red-200">{{ errorMessage }}</p>
          </div>
        </transition>

      <form @submit.prevent="resetPassword" class="space-y-4 animate-fade-in-delayed-2">
        <div class="relative">
          <input
            v-model="newPassword"
            :type="showNewPassword ? 'text' : 'password'"
            required
            class="form-input pr-10"
            placeholder="New Password"
          >
          <button
            type="button"
            @click="showNewPassword = !showNewPassword"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg v-if="showNewPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
            <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          </button>
        </div>

        <div class="relative">
          <input
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            required
            class="form-input pr-10"
            placeholder="Confirm Password"
          >
          <button
            type="button"
            @click="showConfirmPassword = !showConfirmPassword"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg v-if="showConfirmPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
            <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          </button>
        </div>
        
        <button type="submit" class="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-all duration-200 hover:scale-[1.02]" :disabled="isResetting">
          {{ isResetting ? 'Setting New Password...' : 'Reset Password' }}
        </button>
      </form>

      <div class="mt-5 text-center animate-fade-in-delayed-3">
        <button @click="currentStep = 2" class="text-sm text-gray-600 dark:text-gray-400 hover:underline transition-all">
          Back to Code Verification
        </button>
      </div>
    </div>

    <!-- Step 4: Success -->
      <div v-else key="step-4" class="reset-step">
        <div class="text-center py-4">
          <div class="mb-6 animate-bounce-in">
            <div class="inline-block p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
              <svg class="h-16 w-16 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <h1 class="text-4xl font-bold mb-2 text-center animate-fade-in">Success!</h1>
          <p class="text-gray-600 dark:text-gray-400 mb-6 animate-fade-in-delayed">Your password has been reset successfully</p>
          
          <button @click="$emit('back-to-login')" class="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-all duration-200 hover:scale-[1.02] animate-fade-in-delayed-2">
            Sign In
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import { apiManager } from '../api/apiManager';

// Define emits
const emit = defineEmits(['back-to-login']);

// Form state
const currentStep = ref(1);
const email = ref('');
const otpDigits = ref(['', '', '', '', '', '']);
const otpInputRefs = ref<any[]>([]);
const newPassword = ref('');
const confirmPassword = ref('');

// UI states
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const showError = ref(false);
const showSuccess = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const resendTimer = ref(0);
const timerInterval = ref<ReturnType<typeof setInterval> | null>(null);

// Loading states
const isSendingLink = ref(false);
const isVerifying = ref(false);
const isResetting = ref(false);

// Methods for handling OTP input
const onOtpInput = (index: number) => {
  if (otpDigits.value[index].length === 1 && index < 5) {
    otpInputRefs.value[index + 1]?.focus();
  }
};

const handleOtpKeydown = (event: KeyboardEvent, index: number) => {
  // Handle backspace
  if (event.key === 'Backspace') {
    if (!otpDigits.value[index] && index > 0) {
      otpDigits.value[index - 1] = '';
      otpInputRefs.value[index - 1]?.focus();
    }
  }
};

const handleOtpPaste = (event: ClipboardEvent) => {
  event.preventDefault();
  const pastedData = event.clipboardData?.getData('text');
  if (!pastedData) return;

  const digits = pastedData.slice(0, 6).split('');
  otpDigits.value = [...digits, ...Array(6 - digits.length).fill('')];

  // Focus the next empty input or the last one
  const nextEmptyIndex = otpDigits.value.findIndex(d => !d);
  if (nextEmptyIndex !== -1) {
    otpInputRefs.value[nextEmptyIndex]?.focus();
  } else {
    otpInputRefs.value[5]?.focus();
  }
};

// Form submission methods
const handleSendResetLink = async () => {
  if (!email.value) {
    showErrorMessage('Please enter your email address.');
    return;
  }

  isSendingLink.value = true;
  showError.value = false;
  showSuccess.value = false;

  try {
    const response = await apiManager.sendPasswordResetLink(email.value);

    if (response.success) {
      currentStep.value = 2;
      startResendTimer();
      showSuccessMessage('Reset code sent to your email.');
    } else {
      showErrorMessage(response.message || 'Failed to send reset link.');
    }
  } catch (error) {
    console.error('Error sending reset link:', error);
    showErrorMessage('An error occurred. Please try again.');
  } finally {
    isSendingLink.value = false;
  }
};

const verifyOtpCode = async () => {
  const code = otpDigits.value.join('');
  
  if (code.length !== 6) {
    showErrorMessage('Please enter the complete 6-digit code.');
    return;
  }

  isVerifying.value = true;
  showError.value = false;

  try {
    const response = await apiManager.verifyPasswordResetCode(email.value, code);

    if (response.success) {
      currentStep.value = 3;
    } else {
      showErrorMessage(response.message || 'Invalid verification code.');
    }
  } catch (error) {
    console.error('Error verifying code:', error);
    showErrorMessage('An error occurred. Please try again.');
  } finally {
    isVerifying.value = false;
  }
};

const resetPassword = async () => {
  if (!newPassword.value) {
    showErrorMessage('Please enter a new password.');
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    showErrorMessage('Passwords do not match.');
    return;
  }

  if (newPassword.value.length < 8) {
    showErrorMessage('Password must be at least 8 characters long.');
    return;
  }

  const code = otpDigits.value.join('');
  isResetting.value = true;
  showError.value = false;

  try {
    const response = await apiManager.resetPasswordWithCode(
      email.value,
      code,
      newPassword.value
    );

    if (response.success) {
      currentStep.value = 4; // Move to success step
    } else {
      showErrorMessage(response.message || 'Failed to reset password.');
    }
  } catch (error) {
    console.error('Error resetting password:', error);
    showErrorMessage('An error occurred. Please try again.');
  } finally {
    isResetting.value = false;
  }
};

// Helper methods
const showErrorMessage = (message: string) => {
  errorMessage.value = message;
  showError.value = true;
  showSuccess.value = false;
};

const showSuccessMessage = (message: string) => {
  successMessage.value = message;
  showSuccess.value = true;
  showError.value = false;
};

const startResendTimer = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
  
  resendTimer.value = 60;
  
  timerInterval.value = setInterval(() => {
    resendTimer.value--;
    if (resendTimer.value <= 0 && timerInterval.value) {
      clearInterval(timerInterval.value);
    }
  }, 1000);
};

// Cleanup on component unmount
onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
});
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

/* Step transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.215, 0.61, 0.355, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Alert transitions */
.fade-slide-down-enter-active,
.fade-slide-down-leave-active {
  transition: all 0.3s ease-out;
}

.fade-slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-slide-down-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Staggered entrance animations */
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

.animate-fade-in-delayed {
  animation: fadeIn 0.5s ease-out 0.1s forwards;
  opacity: 0;
}

.animate-fade-in-delayed-2 {
  animation: fadeIn 0.5s ease-out 0.2s forwards;
  opacity: 0;
}

.animate-fade-in-delayed-3 {
  animation: fadeIn 0.5s ease-out 0.3s forwards;
  opacity: 0;
}

.animate-bounce-in {
  animation: bounceIn 0.6s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  40% {
    opacity: 1;
    transform: scale(1.05);
  }
  60% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
}

/* OTP input animation */
.otp-input {
  transition: all 0.3s;
}

.otp-input:focus {
  transform: scale(1.1);
  border-color: #00fe01;
}

.form-input::placeholder {
  color: #9ca3af;
}

.dark .form-input::placeholder {
  color: #6b7280;
}
</style>