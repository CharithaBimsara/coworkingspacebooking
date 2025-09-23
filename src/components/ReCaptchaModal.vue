<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md shadow-xl transform transition-all">
      <div class="text-center mb-6">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">Security Verification</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Please complete the security check to proceed with your payment
        </p>
      </div>
      
      <!-- reCAPTCHA container -->
      <div class="flex justify-center mb-6">
        <div id="recaptcha-container" ref="recaptchaElement"></div>
      </div>
      
      <div class="flex justify-center space-x-4">
        <button
          @click="cancel"
          class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          @click="verify"
          :disabled="!recaptchaVerified"
          class="px-4 py-2 bg-primary text-black rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

declare global {
  interface Window {
    grecaptcha?: any;
    onRecaptchaLoad?: () => void;
  }
}

export default defineComponent({
  name: 'ReCaptchaModal',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['verified', 'cancel'],
  setup(props, { emit }) {
    const recaptchaElement = ref<HTMLElement | null>(null);
    const recaptchaVerified = ref(false);
    const recaptchaWidgetId = ref<number | null>(null);
    const recaptchaToken = ref('');
    
    // Load reCAPTCHA script if not already loaded
    const loadRecaptchaScript = () => {
      if (window.grecaptcha) {
        initRecaptcha();
        return;
      }
      
      // Create script element
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit`;
      script.async = true;
      script.defer = true;
      
      // Define callback when script is loaded
      window.onRecaptchaLoad = () => {
        initRecaptcha();
      };
      
      // Append script to document
      document.head.appendChild(script);
    };
    
    // Initialize reCAPTCHA
    const initRecaptcha = () => {
      if (!window.grecaptcha || !recaptchaElement.value) return;
      
      // Remove any existing reCAPTCHA if already rendered
      if (recaptchaWidgetId.value !== null) {
        window.grecaptcha.reset(recaptchaWidgetId.value);
      } else {
        // Render new reCAPTCHA
        recaptchaWidgetId.value = window.grecaptcha.render(recaptchaElement.value, {
          'sitekey': '6LcQQMwrAAAAADW-o6l-NTd5zdU6M_-g32klG52M', // Replace with your actual site key
          'theme': 'light',
          'size': 'normal',
          'callback': onRecaptchaVerified,
          'expired-callback': onRecaptchaExpired
        });
      }
    };
    
    // Callback when reCAPTCHA is verified
    const onRecaptchaVerified = (token: string) => {
      recaptchaToken.value = token;
      recaptchaVerified.value = true;
    };
    
    // Callback when reCAPTCHA expires
    const onRecaptchaExpired = () => {
      recaptchaToken.value = '';
      recaptchaVerified.value = false;
    };
    
    // Verify and emit event with token
    const verify = () => {
      if (!recaptchaVerified.value) return;
      emit('verified', recaptchaToken.value);
    };
    
    // Cancel and emit cancel event
    const cancel = () => {
      emit('cancel');
    };
    
    // Watch for show prop changes to initialize reCAPTCHA when modal becomes visible
    watch(() => props.show, (newValue) => {
      if (newValue) {
        loadRecaptchaScript();
      }
    }, { immediate: true });
    
    return {
      recaptchaElement,
      recaptchaVerified,
      verify,
      cancel
    };
  }
});
</script>

<style scoped>
/* You can add any custom styles here if needed */
</style>