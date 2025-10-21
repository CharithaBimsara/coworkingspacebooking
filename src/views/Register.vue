<template>
  <div class="w-full">
    <h1 class="text-4xl font-bold mb-2 text-center">Create Account</h1>
    <p class="text-gray-500 dark:text-gray-400 text-center mb-6">Join us today!</p>

    <div v-if="showError" class="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-center">
      <p class="text-sm text-red-800 dark:text-red-200">{{ errorMessage }}</p>
    </div>

    <form @submit.prevent="handleSignUp" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <input v-model="signUpForm.firstName" type="text" required class="form-input" placeholder="First Name">
        <input v-model="signUpForm.lastName" type="text" required class="form-input" placeholder="Last Name">
      </div>
      <input v-model="signUpForm.email" type="email" required class="form-input" placeholder="Email">
      <input v-model="signUpForm.phone" type="tel" required class="form-input" placeholder="Phone Number">
      <div class="relative">
        <input
          v-model="signUpForm.password"
          :type="showPassword ? 'text' : 'password'"
          required
          class="form-input pr-10"
          placeholder="Password"
        >
        <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
          <svg v-if="showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
          <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
        </button>
      </div>
      <div class="relative">
        <input
          v-model="signUpForm.confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          required
          class="form-input pr-10"
          placeholder="Confirm Password"
        >
        <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
          <svg v-if="showConfirmPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
          <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
        </button>
      </div>
      
      <div class="text-xs text-gray-500 dark:text-gray-400">
        <label class="flex items-center">
          <input v-model="signUpForm.agreeToTerms" type="checkbox" required class="rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary-focus">
          <span class="ml-2">I agree to the <button type="button" @click="showTerms('terms')" class="font-semibold text-primary hover:underline">Terms of Service</button> and <button type="button" @click="showTerms('privacy')" class="font-semibold text-primary hover:underline">Payment Policy</button>.</span>
        </label>
      </div>

      <button type="submit" class="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-colors duration-200" :disabled="isSigningUp">
        {{ isSigningUp ? 'Creating Account...' : 'Sign Up' }}
      </button>
    </form>

    <div class="mt-5 text-center">
      <p class="text-gray-600 dark:text-gray-300 text-sm">
        Already have an account?
        <button @click="$emit('switch-form', 'login')" class="font-semibold text-primary hover:text-primary-dark">
          Sign in
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

  <TermsModal
    :show="showTermsModal"
    :title="termsTitle"
    :content="termsContent"
    :type="termsType"
    @close="closeTermsModal"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { apiManager } from '../api/apiManager';
import { SignUpForm } from '../helpers/forms';
import SuccessOverlay from '../components/SuccessOverlay.vue';
import TermsModal from '../components/TermsModal.vue';

const emit = defineEmits(['switch-form']);

const isSigningUp = ref(false);
const signUpForm = ref(new SignUpForm());
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const showError = ref(false);
const errorMessage = ref('');
const errorTimeoutId = ref<ReturnType<typeof setTimeout> | null>(null);

const showSuccessOverlay = ref(false);
const successTitle = ref('');
const successMessage = ref('');
const successAction = ref<{ text: string; action: () => void; } | null>(null);

const showTermsModal = ref(false);
const termsTitle = ref('');
const termsContent = ref('');
const termsType = ref<'terms' | 'payment'>('terms');

const termsOfServiceContent = `
<h3>Terms and Conditions for Online Reservations</h3>
<p>By making a reservation for a hotdesk, dedicated desk, or meeting room through our online booking system, you agree to the following terms and conditions:</p>

<h4>1. Reservations</h4>
<ul>
<li>Reservations are subject to availability and are confirmed only upon receipt of full payment or valid booking confirmation.</li>
<li>Bookings must be made using the official online booking platform.</li>
</ul>

<h4>2. Payment and Fees</h4>
<ul>
<li>All fees must be paid in advance unless otherwise agreed.</li>
<li>Prices displayed are inclusive of applicable taxes (as specified at checkout).</li>
<li>Additional charges may apply for extended usage, extra services, or late check-out.</li>
</ul>

<h4>3. Cancellations and Refunds</h4>
<ul>
<li>All bookings are non-refundable.</li>
<li>If you are unable to attend, you may request to reschedule your booking to another available date and time, subject to availability.</li>
<li>Rescheduling requests must be made at least 24 hours before the original booking start time.</li>
<li>No-shows will be charged the full booking amount.</li>
</ul>

<h4>4. Usage Policy</h4>
<ul>
<li>Workspaces and meeting rooms may only be used for lawful business or professional purposes.</li>
<li>The booking is non-transferable and valid only for the individual or organization named in the reservation.</li>
<li>Users must not exceed the maximum occupancy stated for each booking type.</li>
<li>Food, beverages, and equipment brought into the premises must comply with venue policies.</li>
</ul>

<h4>5. Conduct and Responsibilities</h4>
<ul>
<li>Users are expected to maintain professional behavior and respect other occupants.</li>
<li>Noise levels must be kept at a minimum.</li>
<li>Any damage to property, equipment, or facilities will be charged to the user.</li>
<li>The provider is not responsible for loss or theft of personal belongings.</li>
</ul>

<h4>6. Access and Security</h4>
<ul>
<li>Users must check in at the designated reception or follow access instructions provided in the booking confirmation.</li>
<li>Sharing access credentials or allowing unauthorized entry is strictly prohibited.</li>
</ul>

<h4>7. Liability</h4>
<ul>
<li>The provider shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of the facilities.</li>
<li>Users assume responsibility for their own safety and that of their guests.</li>
</ul>

<h4>8. Changes to Terms</h4>
<ul>
<li>The provider reserves the right to amend these terms and conditions at any time. Updates will be posted on the booking platform and shall apply to future bookings.</li>
</ul>

<h4>9. Governing Law</h4>
<ul>
<li>These terms and conditions are governed by the laws of Sri Lanka.</li>
</ul>

<p>By confirming a booking, you acknowledge that you have read, understood, and agree to these terms and conditions.</p>
`;

const paymentPolicyContent = `
<h3>Payment Policy</h3>
<p>This Payment Policy applies to all reservations made for hotdesks, dedicated desks, and meeting rooms through our online booking platform. By confirming a booking, you agree to the following terms:</p>

<h4>1. Payment Requirement</h4>
<ul>
<li>Full payment is required at the time of booking to confirm a reservation.</li>
<li>Bookings that are not paid in full will not be secured and may be automatically canceled.</li>
</ul>

<h4>2. Accepted Payment Methods</h4>
<ul>
<li>Payments can be made through the online payment gateway provided on the booking platform.</li>
<li>We accept major credit/debit cards and other digital payment methods as displayed at checkout.</li>
<li>Cash payments are not accepted for online reservations.</li>
</ul>

<h4>3. Non-Refundable Policy</h4>
<ul>
<li>All payments are non-refundable, regardless of cancellation or no-show.</li>
<li>Customers may request to reschedule their booking to a different available date and time, provided the request is made at least 24 hours before the original start time.</li>
</ul>

<h4>4. Additional Charges</h4>
<ul>
<li>Any additional services, extended usage, or damages caused to the property will be charged separately.</li>
<li>Failure to settle outstanding charges may result in suspension of future bookings.</li>
</ul>

<h4>5. Payment Security</h4>
<ul>
<li>All online transactions are processed securely through trusted third-party payment providers.</li>
<li>We do not store credit card or banking details on our servers.</li>
</ul>

<h4>6. Invoice and Receipts</h4>
<ul>
<li>A payment receipt will be automatically generated and sent to the registered email address after successful payment.</li>
<li>Official invoices can be requested by contacting our support team.</li>
</ul>

<h4>7. Policy Updates</h4>
<ul>
<li>We reserve the right to update or amend this Payment Policy at any time. Updates will be effective immediately upon posting on the booking platform.</li>
</ul>

<p>By making a payment, you acknowledge that you have read, understood, and agree to this Payment Policy.</p>
`;

const showTerms = (type: 'terms' | 'privacy') => {
  if (type === 'terms') {
    termsTitle.value = 'Terms of Service';
    termsContent.value = termsOfServiceContent;
    termsType.value = 'terms';
  } else {
    termsTitle.value = 'Payment Policy';
    termsContent.value = paymentPolicyContent;
    termsType.value = 'payment';
  }
  showTermsModal.value = true;
};

const closeTermsModal = () => {
  showTermsModal.value = false;
};

const handleSignUp = async () => {
  if (!signUpForm.value.isValid()) {
    showErrorMessage('Please fill all fields and agree to the terms.');
    return;
  }
  if (!signUpForm.value.passwordsMatch()) {
    showErrorMessage('Passwords do not match.');
    return;
  }

  isSigningUp.value = true;

  try {
    const dto = signUpForm.value.toDto();
    const response = await apiManager.registerUser({
      FirstName: dto.firstName,
      LastName: dto.lastName,
      Email: dto.email,
      Password: dto.password,
      Phone: dto.phone || '',
      Company: "",
      JobTitle: "",
      Bio: ""
    });

    if (response.success) {
      signUpForm.value.reset();
      showSuccessOverlay.value = true;
      successTitle.value = 'Account Created!';
      successMessage.value = response.message || 'Please sign in with your new credentials.';
      successAction.value = {
        text: 'Sign In',
        action: () => {
          closeSuccessOverlay();
          emit('switch-form', 'login');
        },
      };
    } else {
      showErrorMessage(response.message || 'Failed to create account.');
    }
  } catch (error) {
    console.error('Sign up error:', error);
    showErrorMessage('An error occurred during sign up.');
  } finally {
    isSigningUp.value = false;
  }
};

const showErrorMessage = (message: string) => {
  if (errorTimeoutId.value) clearTimeout(errorTimeoutId.value);
  
  let formattedMessage = message;
  if (message.toLowerCase().includes('email already exists') || message.includes('409')) {
    formattedMessage = 'An account with this email already exists.';
  }

  errorMessage.value = formattedMessage;
  showError.value = true;
  errorTimeoutId.value = setTimeout(() => {
    showError.value = false;
  }, 6000);
};

const closeSuccessOverlay = () => {
  showSuccessOverlay.value = false;
};
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