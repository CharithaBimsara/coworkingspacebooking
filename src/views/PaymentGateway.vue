<template>
  <div class="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
    <iframe
      :src="gatewayUrl"
      class="w-full h-screen border-0"
      allow="payment"
    ></iframe>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'PaymentGateway',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const gatewayUrl = route.query.link as string || '';

    // Optionally, listen for postMessage from gateway to redirect after payment
    window.addEventListener('message', (event) => {
      // Example: if gateway sends { type: 'payment-complete' }
      if (event.data?.type === 'payment-complete') {
        router.replace({ name: 'BookingConfirmation' });
      }
    });

    return { gatewayUrl };
  }
});
</script>

<style scoped>
iframe {
  min-height: 100vh;
  background: #fff;
}
</style>
