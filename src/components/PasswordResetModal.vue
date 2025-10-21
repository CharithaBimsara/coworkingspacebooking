<template>
  <!-- Password Reset Modal -->
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 min-h-[28rem] flex flex-col justify-center relative" @click.stop>
      <!-- Close Button -->
      <button
        @click="closeModal"
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Step 1: Send Reset Link -->
      <div v-if="currentStep === 1" class="text-left px-2">
        <div class="mb-1">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">Reset Password</h2>
          <p class="text-gray-600 dark:text-gray-300">Enter your email address and we'll send you a reset link</p>
        </div>

        <!-- Error Message -->
        <div v-if="showError" class="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg">
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

        <!-- Success Message -->
        <div v-if="showSuccess" class="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-green-800 dark:text-green-200">{{ successMessage }}</p>
            </div>
          </div>
        </div>

        <form @submit.prevent="handleSendResetLink" class="space-y-6 mt-8">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
            <input
              v-model="email"
              type="email"
              required
              class="form-input w-full"
              placeholder="Enter your email"
            >
          </div>

          <button type="submit" class="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-colors duration-200" :disabled="isSendingLink || resendTimer > 0">
            {{ isSendingLink ? 'Sending...' : resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Send Reset Link' }}
          </button>
        </form>

        <div class="mt-6 text-left">
          <p class="text-gray-600 dark:text-gray-300">
            Remember your password?
            <button @click="switchToSignIn" class="font-bold text-primary hover:text-primary-600 ml-1">
              Sign in
            </button>
          </p>
        </div>
      </div>

      <!-- Step 2: Enter Reset Code -->
      <div v-if="currentStep === 2" class="text-center">
        <div class="mb-4">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Enter Reset Code</h2>
          <p class="text-gray-600 dark:text-gray-300">We've sent a reset code to {{ email }}</p>
        </div>

        <!-- Error Message -->
        <div v-if="showError" class="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg">
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

        <form @submit.prevent="verifyOtpCode" class="space-y-6 mt-8">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Reset Code</label>
            <div class="flex gap-2 justify-center">
              <input
                v-for="(digit, index) in resetCodeDigits"
                :key="index"
                v-model="resetCodeDigits[index]"
                type="text"
                maxlength="1"
                class="otp-input"
                @input="handleOtpInput(index, $event)"
                @keydown="handleOtpKeydown(index, $event)"
                @paste="handleOtpPaste($event)"
                :ref="(el) => setOtpInputRef(index, el)"
              >
            </div>
          </div>

          <button type="submit" class="w-full btn-primary py-3 text-base font-semibold" :disabled="isVerifyingCode || isTransitioningToPassword">
            {{ isVerifyingCode ? 'Verifying...' : isTransitioningToPassword ? 'Code Verified!' : 'Verify Code' }}
          </button>
        </form>

        <div class="mt-4 text-center">
          <p class="text-gray-600 dark:text-gray-300">
            Didn't receive the code?
            <button @click="goBackToStep1" class="font-bold text-primary hover:text-primary-600 ml-1">
              Send again
            </button>
          </p>
        </div>
      </div>

      <!-- Step 3: Enter New Password -->
      <div v-if="currentStep === 3" class="text-center">
        <div class="mb-4">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Set New Password</h2>
          <p class="text-gray-600 dark:text-gray-300">Enter your new password</p>
        </div>

        <!-- Error Message -->
        <div v-if="showError" class="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg">
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

        <form @submit.prevent="handleResetPassword" class="space-y-6 mt-8">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
            <div class="relative">
              <input
                v-model="newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                required
                class="form-input pr-10"
                placeholder="Enter new password"
              >
              <button
                type="button"
                @click="toggleNewPasswordVisibility"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              >
                <svg v-if="showNewPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
                <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
            <div class="relative">
              <input
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                class="form-input pr-10"
                placeholder="Confirm new password"
              >
              <button
                type="button"
                @click="toggleConfirmPasswordVisibility"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              >
                <svg v-if="showConfirmPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
                <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          <button type="submit" class="w-full btn-primary py-3 text-base font-semibold" :disabled="isResettingPassword">
            {{ isResettingPassword ? 'Resetting...' : 'Reset Password' }}
          </button>
        </form>

        <div class="mt-4 text-center">
          <button @click="goBackToStep2" class="text-sm text-gray-600 dark:text-gray-300 hover:text-primary">
            ← Back
          </button>
        </div>
      </div>

      <!-- Step 4: Success -->
      <div v-if="currentStep === 4" class="text-center">
        <div class="mb-4">
          <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Password Reset Complete</h2>
          <p class="text-gray-600 dark:text-gray-300">Your password has been successfully reset</p>
        </div>

        <button @click="completeReset" class="w-full btn-primary py-3 text-base font-semibold">
          Sign In
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { apiManager } from '../api/apiManager';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'PasswordResetModal',

  emits: ['close', 'switch-to-signin'],

  props: {
    show: {
      type: Boolean,
      default: false
    },
    userEmail: {
      type: String,
      default: ''
    }
  },

  setup() {
    const router = useRouter();
    return {
      router
    };
  },

  data() {
    return {
      currentStep: 1,
      email: '',
      resetCode: '',
      resetCodeDigits: ['', '', '', '', '', ''],
      newPassword: '',
      confirmPassword: '',
      isSendingLink: false,
      isVerifyingCode: false,
      isResettingPassword: false,
      isTransitioningToPassword: false,
      resendTimer: 0,
      showError: false,
      showSuccess: false,
      errorMessage: '',
      successMessage: '',
      timerInterval: null as ReturnType<typeof setInterval> | null,
      otpInputs: [] as HTMLInputElement[],
      showNewPassword: false,
      showConfirmPassword: false
    };
  },

  watch: {
    show(newVal: boolean) {
      if (newVal) {
        this.resetModal();
        this.email = this.userEmail;
      }
    }
  },

  methods: {
    resetModal() {
      this.currentStep = 1;
      this.resetCode = '';
      this.resetCodeDigits = ['', '', '', '', '', ''];
      this.newPassword = '';
      this.confirmPassword = '';
      this.isSendingLink = false;
      this.isVerifyingCode = false;
      this.isResettingPassword = false;
      this.isTransitioningToPassword = false;
      this.resendTimer = 0;
      this.showError = false;
      this.showSuccess = false;
      this.errorMessage = '';
      this.successMessage = '';

      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    },

    closeModal() {
      this.$emit('close');
    },

    switchToSignIn() {
      this.$emit('switch-to-signin');
    },

    startResendTimer() {
      this.resendTimer = 60; // 60 seconds
      this.timerInterval = setInterval(() => {
        this.resendTimer--;
        if (this.resendTimer <= 0) {
          if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
          }
        }
      }, 1000);
    },

    async handleSendResetLink() {
      if (!this.email) {
        this.showErrorMessage('Please enter your email address');
        return;
      }

      this.isSendingLink = true;
      this.showError = false;
      this.showSuccess = false;

      try {
        const response = await apiManager.sendPasswordResetLink(this.email);

        if (response.success) {
          this.showSuccessMessage(response.message || 'Password reset instructions sent to your email');
          this.currentStep = 2;
          this.startResendTimer();
        } else {
          this.showErrorMessage(response.message || 'Failed to send reset link');
        }
      } catch (error) {
        console.error('Error sending reset link:', error);
        this.showErrorMessage('Network error. Please try again.');
      } finally {
        this.isSendingLink = false;
      }
    },

    async verifyOtpCode() {
      if (this.resetCode.length !== 6) {
        this.showErrorMessage('Please enter the complete 6-digit code');
        return;
      }

      this.isVerifyingCode = true;
      this.showError = false;

      try {
        const response = await apiManager.verifyPasswordResetCode(this.email, this.resetCode);

        if (response.success) {
          // Show success message and start transition loading
          this.showSuccessMessage('Code verified successfully!');
          this.isTransitioningToPassword = true;
          
          // Add a small delay for better UX before moving to next step
          setTimeout(() => {
            this.currentStep = 3;
            this.showSuccess = false; // Hide success message when moving to next step
            this.isTransitioningToPassword = false;
          }, 1500);
        } else {
          this.showErrorMessage(response.message || 'Invalid code. Please try again.');
        }
      } catch (error) {
        console.error('Error verifying code:', error);
        this.showErrorMessage('Network error. Please try again.');
      } finally {
        this.isVerifyingCode = false;
      }
    },

    async handleResetPassword() {
      if (!this.resetCode || !this.newPassword || !this.confirmPassword) {
        this.showErrorMessage('Please fill in all fields');
        return;
      }

      if (this.newPassword !== this.confirmPassword) {
        this.showErrorMessage('Passwords do not match');
        return;
      }

      if (this.newPassword.length < 6) {
        this.showErrorMessage('Password must be at least 6 characters long');
        return;
      }

      this.isResettingPassword = true;
      this.showError = false;

      try {
        const response = await apiManager.resetPasswordWithCode(
          this.email,
          this.resetCode,
          this.newPassword
        );

        if (response.success) {
          this.currentStep = 4;
        } else {
          this.showErrorMessage(response.message || 'Failed to reset password');
        }
      } catch (error) {
        console.error('Error resetting password:', error);
        this.showErrorMessage('Network error. Please try again.');
      } finally {
        this.isResettingPassword = false;
      }
    },

    goBackToStep1() {
      this.currentStep = 1;
      this.resetCode = '';
      this.resetCodeDigits = ['', '', '', '', '', ''];
      this.newPassword = '';
      this.confirmPassword = '';
      this.showError = false;
      this.showSuccess = false;
    },

    goBackToStep2() {
      this.currentStep = 2;
      this.newPassword = '';
      this.confirmPassword = '';
      this.showError = false;
    },

    completeReset() {
      this.$emit('close');
      this.router.push('/my-bookings');
    },

    showErrorMessage(message: string) {
      this.errorMessage = message;
      this.showError = true;
      this.showSuccess = false;
    },

    showSuccessMessage(message: string) {
      this.successMessage = message;
      this.showSuccess = true;
      this.showError = false;
    },

    setOtpInputRef(index: number, el: any) {
      if (el && el instanceof HTMLInputElement) {
        this.otpInputs[index] = el;
      }
    },

    handleOtpInput(index: number, event: Event) {
      const target = event.target as HTMLInputElement;
      const value = target.value;

      // Only allow digits
      if (!/^\d*$/.test(value)) {
        this.resetCodeDigits[index] = '';
        return;
      }

      // Update the digit
      this.resetCodeDigits[index] = value;

      // Auto-focus next input if a digit was entered
      if (value && index < 5) {
        this.$nextTick(() => {
          const nextInput = this.otpInputs[index + 1];
          if (nextInput) {
            nextInput.focus();
          }
        });
      }

      // Update the combined resetCode
      this.resetCode = this.resetCodeDigits.join('');
    },

    handleOtpKeydown(index: number, event: KeyboardEvent) {
      if (event.key === 'Backspace' && !this.resetCodeDigits[index] && index > 0) {
        // Move to previous input on backspace if current is empty
        this.$nextTick(() => {
          const prevInput = this.otpInputs[index - 1];
          if (prevInput) {
            prevInput.focus();
          }
        });
      }
    },

    handleOtpPaste(event: ClipboardEvent) {
      event.preventDefault();
      const paste = event.clipboardData?.getData('text');
      
      if (paste) {
        // Extract only digits from the pasted text
        const digits = paste.replace(/\D/g, '');
        
        if (digits.length > 0) {
          // Fill inputs with available digits (up to 6)
          for (let i = 0; i < Math.min(digits.length, 6); i++) {
            this.resetCodeDigits[i] = digits[i];
          }
          
          // Update the combined resetCode
          this.resetCode = this.resetCodeDigits.join('');
          
          // Focus the next empty input or the last filled input
          this.$nextTick(() => {
            const nextEmptyIndex = this.resetCodeDigits.findIndex(digit => !digit);
            const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
            const targetInput = this.otpInputs[focusIndex];
            if (targetInput) {
              targetInput.focus();
            }
          });
        }
      }
    },

    toggleNewPasswordVisibility() {
      this.showNewPassword = !this.showNewPassword;
    },

    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  },

  beforeUnmount() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
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

.form-input::placeholder {
  color: #9ca3af;
}

.dark .form-input::placeholder {
  color: #6b7280;
}

.btn-primary {
  background-color: #00FE01;
  color: black;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  border: none;
  cursor: pointer;
}

.btn-primary:hover:not(:disabled) {
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

.otp-input {
  width: 3rem;
  height: 3rem;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  border: 2px solid #E5E7EB;
  border-radius: 0.5rem;
  outline: none;
  background: #FFFFFF;
  transition: border-color 0.2s ease-in-out;
}

.otp-input:focus {
  border-color: #00FE01;
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 254, 1, 0.1);
}

/* Dark mode styles for OTP inputs */
.dark .otp-input {
  border-color: #4B5563;
  background: #1F2937;
  color: #F9FAFB;
}

.dark .otp-input:focus {
  border-color: #00FE01;
}
</style>