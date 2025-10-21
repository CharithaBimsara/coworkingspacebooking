<template>
  <div class="saved-card-selector mb-6">
    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Select Payment Method</h3>
    
    <div class="space-y-3">
      <!-- Saved Cards -->
      <div v-for="card in savedCards" :key="card.id" class="card-option">
        <div class="relative">
          <input type="radio" 
            :id="`card-${card.id}`" 
            :value="card.id" 
            v-model="selectedMethod" 
            class="peer hidden" 
            name="paymentMethod" />
          
          <label :for="`card-${card.id}`" class="relative block p-4 bg-white dark:bg-gray-800 border-2 rounded-lg cursor-pointer peer-checked:border-primary transition-all">
            <div class="flex items-center">
              <!-- Card logo -->
              <div class="card-logo mr-3">
                <div class="w-10 h-8">
                  <img v-if="getCardType(card) === 'VISA'" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" class="h-full w-full object-contain">
                  <img v-else-if="getCardType(card) === 'MASTERCARD'" src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/1200px-Mastercard_2019_logo.svg.png" alt="Mastercard" class="h-full w-full object-contain">
                  <div v-else class="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded">
                    <span class="text-xs font-bold">{{ getCardType(card) }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Card details -->
              <div class="flex-1">
                <p class="font-medium text-gray-700 dark:text-gray-300">•••• •••• •••• {{ getLastFour(card) }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Expires {{ card.expiry_month }}/{{ card.expiry_year }}</p>
                <p v-if="card.holder_name" class="text-sm text-gray-500 dark:text-gray-400">{{ card.holder_name }}</p>
                <div class="flex items-center space-x-2 mt-1">
                  <span v-if="card.issuer" class="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                    {{ card.issuer }}
                  </span>
                  <span v-if="card.card_issuer_type" class="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                    {{ card.card_issuer_type }}
                  </span>
                </div>
                <!-- Hidden element with card data for debugging purposes -->
                <div class="hidden" :data-card-id="card.id" :data-wallet-id="card.wallet_id"></div>
              </div>
              
              <!-- Selection indicator -->
              <div class="w-6 h-6 border-2 rounded-full peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center ml-4 peer-checked:opacity-100 opacity-0 peer-checked:border-primary transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </label>
        </div>
      </div>
      
      <!-- Add new card option -->
      <div class="card-option">
        <div class="relative">
          <input type="radio" 
            id="add-new-card" 
            value="new-card" 
            v-model="selectedMethod" 
            class="peer hidden" 
            name="paymentMethod" />
          
          <label for="add-new-card" class="relative block p-4 bg-white dark:bg-gray-800 border-2 rounded-lg cursor-pointer peer-checked:border-primary transition-all">
            <div class="flex items-center">
              <!-- Plus icon -->
              <div class="mr-3 bg-gray-100 dark:bg-gray-700 w-10 h-8 rounded flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              
              <!-- Text -->
              <div class="flex-1">
                <p class="font-medium text-gray-700 dark:text-gray-300">
                  {{ saveCardOption ? 'Add New Card' : 'Pay with Card' }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ saveCardOption ? 'Securely add a new payment method' : 'Proceed with card payment' }}
                </p>
              </div>
              
              <!-- Selection indicator -->
              <div class="w-6 h-6 border-2 rounded-full peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center ml-4 peer-checked:opacity-100 opacity-0 peer-checked:border-primary transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
    
    <!-- Save card checkbox - only show for authenticated users -->
    <div v-if="selectedMethod === 'new-card' && saveCardOption" class="mt-4 flex items-center">
      <input type="checkbox" id="save-card" v-model="saveCard" class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
      <label for="save-card" class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        Save this card for future payments
      </label>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, toRef } from 'vue';
import type { PropType } from 'vue';

interface SavedCard {
  id: number;
  wallet_id?: number;
  card_number: string;
  card_type: string;
  expiry_month: string;
  expiry_year: string;
  is_default: boolean;
  holder_name?: string;
  brand?: string;
  last_four?: string;
  issuer?: string;
  card_issuer_type?: string; // CREDIT or DEBIT
}

export default defineComponent({
  name: 'SavedCardSelector',
  props: {
    cards: {
      type: Array as PropType<SavedCard[]>,
      required: true
    },
    modelValue: {
      type: [String, Number],
      default: ''
    },
    saveCardOption: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:modelValue', 'update:saveCard'],
  setup(props, { emit }) {
    const savedCards = toRef(props, 'cards');
    
    // Initialize with the first card if available, or 'new-card' if not
    const selectedMethod = ref(props.modelValue || 
      (savedCards.value.length > 0 ? savedCards.value[0].id : 'new-card'));
    
    const saveCard = ref(props.saveCardOption);
    
    // Watch for changes to selectedMethod and emit to parent
    watch(selectedMethod, (newValue) => {
      emit('update:modelValue', newValue);
    });
    
    // Watch for changes to saveCard and emit to parent
    watch(saveCard, (newValue) => {
      emit('update:saveCard', newValue);
    });
    
    // Watch for props changes
    watch(() => props.modelValue, (newValue) => {
      selectedMethod.value = newValue;
    });
    
    watch(() => props.saveCardOption, (newValue) => {
      saveCard.value = newValue;
    });
    
    // Helper methods to handle different card formats
    const getCardType = (card: SavedCard): string => {
      // Use brand field if available, otherwise use card_type
      if (card.brand) return card.brand.toUpperCase();
      if (card.card_type) return card.card_type.toUpperCase();
      return "CARD";
    };
    
    const getLastFour = (card: SavedCard): string => {
      // Use last_four field if available, otherwise extract from card_number
      if (card.last_four) return card.last_four;
      return card.card_number.slice(-4);
    };

    return {
      savedCards,
      selectedMethod,
      saveCard,
      getCardType,
      getLastFour
    };
  }
});
</script>

<style scoped>
.peer:checked + label {
  border-color: var(--color-primary);
}

.peer:checked + label .peer-checked\:border-primary {
  border-color: var(--color-primary);
}

.peer:checked + label .peer-checked\:bg-primary {
  background-color: var(--color-primary);
}

.peer:checked + label .peer-checked\:opacity-100 {
  opacity: 1;
}
</style>