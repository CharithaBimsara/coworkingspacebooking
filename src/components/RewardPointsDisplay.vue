<template>
  <div class="inline-flex items-center relative">
    <div
      class="flex items-center gap-1.5 px-2.5 py-1.5 bg-primary rounded-full shadow-sm shadow-primary/25 transition-all duration-200 cursor-pointer border border-white/50 dark:border-black/20 h-7"
      :class="{ 'animate-pulse': showPointsUpdate }"
      @click="$emit('click')"
      @mouseenter="showTooltip = true"
      @mouseleave="showTooltip = false"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5 text-black">
        <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
      </svg>
      <span class="text-xs font-bold text-black leading-none">{{ formattedPoints }}</span>
    </div>

    <!-- Tooltip -->
    <Transition name="tooltip">
      <div
        v-if="showTooltip"
        class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs rounded-lg shadow-lg z-50 whitespace-nowrap border border-gray-200 dark:border-gray-700"
      >
        <div class="text-center">
          <div class="font-semibold">Reward Points</div>
          <div class="text-gray-600 dark:text-gray-300 mt-1">Earn points on bookings & use them to pay</div>
        </div>
        <!-- Arrow -->
        <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-white dark:border-b-gray-900"></div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';

defineEmits(['click']);

const authStore = useAuthStore();
const showPointsUpdate = ref(false);
const showTooltip = ref(false);

const rewardPoints = computed(() => {
  return authStore.currentUser?.rewardPoints || 0;
});

const formattedPoints = computed(() => {
  return rewardPoints.value.toLocaleString();
});

// Fetch fresh reward points when component mounts
onMounted(async () => {
  if (authStore.currentUser?.id) {
    await authStore.fetchUserRewards(authStore.currentUser.id);
  }
});

// Watch for points changes and trigger animation
watch(rewardPoints, (newValue, oldValue) => {
  if (newValue !== oldValue && oldValue !== 0) {
    showPointsUpdate.value = true;
    setTimeout(() => {
      showPointsUpdate.value = false;
    }, 800);
  }
});
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 8px var(--color-primary, #00FE01);
  }
}

.animate-pulse {
  animation: pulse 0.8s ease-in-out;
}

.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: translate(-50%, -4px);
}
</style>
