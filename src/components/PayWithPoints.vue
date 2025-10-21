<template>
  <div class="w-full">
    <!-- Main Toggle Card -->
    <div class="bg-white dark:bg-gray-900 border-2 rounded-2xl overflow-hidden transition-all duration-300"
         :class="{ 'border-primary dark:border-primary shadow-lg shadow-primary/15': isEnabled, 'border-gray-200 dark:border-gray-700': !isEnabled }">
      <!-- Header with Toggle -->
      <div class="flex items-center justify-between p-5">
        <div class="flex items-center gap-4 flex-1 cursor-pointer p-2 -m-2 rounded-lg transition-colors hover:bg-primary/5"
             @click="togglePointsPayment">
          <div class="flex items-center justify-center w-10 h-10 bg-primary rounded-xl text-black">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
              <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">Pay with Reward Points</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Available: {{ formattedAvailablePoints }} Points ({{ formattedAvailableCurrency }})</p>
          </div>
        </div>
        <label class="relative inline-block w-12 h-6" @click.stop>
          <input type="checkbox" class="peer sr-only" v-model="isEnabled" @change="handleToggle">
          <span class="toggle-slider absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 dark:bg-gray-600 rounded-full border border-black/10 transition-all duration-300"></span>
        </label>
      </div>

      <!-- Expanded Content -->
      <transition 
        enter-active-class="transition-all duration-300 ease-out max-h-[1000px] opacity-100 overflow-hidden" 
        enter-from-class="max-h-0 opacity-0" 
        leave-active-class="transition-all duration-300 ease-in max-h-0 opacity-0 overflow-hidden" 
        leave-to-class="max-h-0 opacity-0"
      >
        <div v-if="isEnabled" class="px-5 pb-5">
          <!-- Payment Summary -->
          <div class="bg-primary/5 dark:bg-gray-800 border-2 border-primary rounded-xl p-4">
            <div class="flex justify-between items-center py-2 text-base">
              <span class="text-gray-500 dark:text-gray-400">Original Total:</span>
              <span class="font-semibold line-through text-gray-500 dark:text-gray-400">{{ formattedOriginalAmount }}</span>
            </div>
            <div class="flex justify-between items-center py-3 text-xl font-bold border-t-2 border-primary pt-3">
              <span class="text-gray-900 dark:text-white">New Total:</span>
              <span class="text-gray-900 dark:text-white">{{ formattedNewTotal }}</span>
            </div>
            <div class="flex items-center justify-center gap-2 mt-3 py-2.5 bg-primary rounded-lg text-sm font-semibold text-black border border-black/10 animate-fadeIn">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              You're saving {{ formattedDiscountAmount }}!
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';

export default defineComponent({
  name: 'PayWithPoints',
  props: {
    availablePoints: {
      type: Number,
      required: true,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0
    },
    modelValue: {
      type: Number,
      default: 0
    }
  },
  emits: ['update:modelValue', 'points-changed'],
  setup(props, { emit }) {
    // Points are directly used as currency values (no conversion needed)
    
    const isEnabled = ref(false);
    const pointsToUse = ref(props.modelValue || 0);
    
    // Calculate maximum usable points (cannot exceed total amount)
    const maxUsablePoints = computed(() => {
      return Math.min(props.availablePoints, props.totalAmount);
    });
    
    // Discount amount (points used directly as currency)
    const discountAmount = computed(() => {
      return pointsToUse.value;
    });
    
    // New total after discount
    const newTotal = computed(() => {
      return Math.max(0, props.totalAmount - discountAmount.value);
    });
    
    // Remaining points after use
    const remainingPoints = computed(() => {
      return props.availablePoints - pointsToUse.value;
    });
    
    // Formatted values
    const formattedAvailablePoints = computed(() => {
      return props.availablePoints.toLocaleString();
    });
    
    const formattedAvailableCurrency = computed(() => {
      return `LKR ${props.availablePoints.toFixed(2)}`;
    });
    
    const formattedPointsToUse = computed(() => {
      return pointsToUse.value.toLocaleString();
    });
    
    const formattedDiscountAmount = computed(() => {
      return `LKR ${discountAmount.value.toFixed(2)}`;
    });
    
    const formattedRemainingPoints = computed(() => {
      return remainingPoints.value.toLocaleString();
    });
    
    const formattedOriginalAmount = computed(() => {
      return `LKR ${props.totalAmount.toFixed(2)}`;
    });
    
    const formattedNewTotal = computed(() => {
      return `LKR ${newTotal.value.toFixed(2)}`;
    });
    
    // Methods
    const togglePointsPayment = () => {
      if (!isEnabled.value) {
        isEnabled.value = true;
        // Automatically use all available points
        pointsToUse.value = maxUsablePoints.value;
        emitChange();
      }
    };
    
    const handleToggle = () => {
      if (!isEnabled.value) {
        // When turned off, reset points to 0
        pointsToUse.value = 0;
        emitChange();
      } else {
        // When turned on, use all available points
        pointsToUse.value = maxUsablePoints.value;
        emitChange();
      }
    };
    
    const emitChange = () => {
      const finalPoints = isEnabled.value ? pointsToUse.value : 0;
      emit('update:modelValue', finalPoints);
      emit('points-changed', {
        pointsUsed: finalPoints,
        discountAmount: isEnabled.value ? discountAmount.value : 0,
        newTotal: isEnabled.value ? newTotal.value : props.totalAmount
      });
    };
    
    // Watch for external changes
    watch(() => props.modelValue, (newValue) => {
      if (newValue !== pointsToUse.value) {
        pointsToUse.value = newValue;
        isEnabled.value = newValue > 0;
      }
    });
    
    // Watch for available points changes
    watch(() => props.availablePoints, () => {
      if (pointsToUse.value > maxUsablePoints.value) {
        pointsToUse.value = maxUsablePoints.value;
        emitChange();
      }
    });
    
    // Watch for total amount changes
    watch(() => props.totalAmount, () => {
      if (pointsToUse.value > maxUsablePoints.value) {
        pointsToUse.value = maxUsablePoints.value;
        emitChange();
      }
    });
    
    return {
      isEnabled,
      pointsToUse,
      maxUsablePoints,
      discountAmount,
      newTotal,
      remainingPoints,
      formattedAvailablePoints,
      formattedAvailableCurrency,
      formattedPointsToUse,
      formattedDiscountAmount,
      formattedRemainingPoints,
      formattedOriginalAmount,
      formattedNewTotal,
      togglePointsPayment,
      handleToggle
    };
  }
});
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

.toggle-slider::before {
  content: "";
  position: absolute;
  height: 1.1rem;
  width: 1.1rem;
  left: 0.2rem;
  bottom: 0.2rem;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.peer:checked + .toggle-slider {
  background-color: var(--color-primary, #00FE01);
}

.peer:checked + .toggle-slider::before {
  transform: translateX(1.5rem);
}
</style>
