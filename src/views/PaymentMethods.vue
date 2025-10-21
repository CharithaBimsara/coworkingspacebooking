<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto container-padding py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Payment Methods</h1>
            <p class="text-gray-600 dark:text-gray-300 mt-1">Manage your payment cards and billing information</p>
          </div>
          <router-link to="/my-bookings" class="btn-secondary dark:bg-gray-600 dark:text-white dark:border-gray-500 dark:hover:bg-gray-500">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </router-link>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto container-padding py-8">
      <!-- Payment Methods List -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 mb-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Saved Payment Methods</h2>
          <!-- Button temporarily commented out
          <button @click="showAddCardModal = true" class="btn-primary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New Card
          </button>
          -->
        </div>

        <div v-if="paymentMethods.length === 0" class="text-center py-12">
          <svg class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No payment methods</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">Add a payment method to make bookings easier</p>
          <button @click="showAddCardModal = true" class="btn-primary">
            Add Your First Card
          </button>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="method in paymentMethods"
            :key="method.id"
            class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <!-- Card Icon -->
                <div class="w-12 h-8 bg-gradient-to-r from-primary to-green-600 rounded flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                  </svg>
                </div>
                
                <div>
                  <div class="flex items-center space-x-2">
                    <span class="font-medium text-gray-900 dark:text-white">•••• •••• •••• {{ method.lastFour }}</span>
                    <span
                      v-if="method.isDefault"
                      class="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-xs font-medium px-2 py-1 rounded-full"
                    >
                      Default
                    </span>
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-300">
                    {{ method.brand.toUpperCase() }} • Expires {{ method.expiryMonth }}/{{ method.expiryYear }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ method.holderName }}</div>
                </div>
              </div>

              <!-- <div class="flex items-center space-x-2">
                <button
                  v-if="!method.isDefault"
                  @click="setDefaultPaymentMethod(method.id)"
                  class="text-primary hover:text-primary/80 text-sm font-medium"
                >
                  Set as Default
                </button>
                <button
                  @click="editPaymentMethod(method)"
                  class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-2"
                  title="Edit"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  @click="deletePaymentMethod(method.id)"
                  class="text-red-600 hover:text-red-700 p-2"
                  title="Delete"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div> -->
            </div>
          </div>
        </div>
      </div>

      <!-- Billing Address -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Billing Address</h2>
        
        <form @submit.prevent="updateBillingAddress" class="space-y-6">
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
              <input
                v-model="billingForm.firstName"
                type="text"
                required
                class="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-gray-500 dark:focus:border-gray-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
              <input
                v-model="billingForm.lastName"
                type="text"
                required
                class="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-gray-500 dark:focus:border-gray-500"
              >
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input
              v-model="billingForm.email"
              type="email"
              required
              class="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-gray-500 dark:focus:border-gray-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
            <input
              v-model="billingForm.phone"
              type="tel"
              required
              class="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-gray-500 dark:focus:border-gray-500"
            >
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="isUpdatingBilling"
              class="btn-primary"
            >
              {{ isUpdatingBilling ? 'Updating...' : 'Update Billing Address' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add/Edit Card Modal -->
    <div
      v-if="showAddCardModal || showEditCardModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeModals"
    >
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ showEditCardModal ? 'Edit Payment Method' : 'Add New Payment Method' }}
          </h3>
          <button @click="closeModals" class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="savePaymentMethod" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cardholder Name</label>
            <input
              v-model="cardForm.holderName"
              type="text"
              required
              class="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-gray-500 dark:focus:border-gray-500"
              placeholder="John Doe"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Card Number</label>
            <input
              v-model="cardForm.cardNumber"
              type="text"
              required
              class="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-gray-500 dark:focus:border-gray-500"
              placeholder="1234 5678 9012 3456"
              maxlength="19"
              @input="formatCardNumber"
            >
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Expiry Date</label>
              <input
                v-model="cardForm.expiry"
                type="text"
                required
                class="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-gray-500 dark:focus:border-gray-500"
                placeholder="MM/YY"
                maxlength="5"
                @input="formatExpiry"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CVV</label>
              <input
                v-model="cardForm.cvv"
                type="text"
                required
                class="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-gray-500 dark:focus:border-gray-500"
                placeholder="123"
                maxlength="4"
              >
            </div>
          </div>

          <div class="flex items-center">
            <input
              v-model="cardForm.isDefault"
              type="checkbox"
              id="setDefault"
              class="rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary dark:focus:ring-gray-500"
            >
            <label for="setDefault" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Set as default payment method
            </label>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeModals"
              class="btn-secondary dark:bg-gray-600 dark:text-white dark:border-gray-500 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSavingCard"
              class="btn-primary"
            >
              {{ isSavingCard ? 'Saving...' : (showEditCardModal ? 'Update Card' : 'Add Card') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Success Overlay -->
    <SuccessOverlay
      :show="showSuccessOverlay"
      :title="successTitle"
      :message="successMessage"
      @close="closeSuccessOverlay"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SuccessOverlay from '../components/SuccessOverlay.vue';
import { apiManager } from '../api/apiManager';
import { useAuthStore } from '../stores/auth';
import { useBookingStore } from '../stores/booking';

interface PaymentMethod {
  id: string;
  brand: string;
  lastFour: string;
  expiryMonth: string;
  expiryYear: string;
  holderName: string;
  isDefault: boolean;
}

interface CardForm {
  holderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  isDefault: boolean;
}

interface BillingForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export default defineComponent({
  name: 'PaymentMethodsPage',
  
  components: {
    SuccessOverlay
  },
  
  mounted() {
    // Load billing address and payment methods when component mounts
    this.loadBillingAddress();
    this.loadPaymentMethods();
  },
  
  setup() {
    const authStore = useAuthStore();
    const bookingStore = useBookingStore();
    
    return {
      authStore,
      bookingStore
    };
  },
  
  data() {
    return {
      showAddCardModal: false,
      showEditCardModal: false,
      isSavingCard: false,
      isUpdatingBilling: false,
      showSuccessOverlay: false,
      successTitle: '',
      successMessage: '',
      editingCardId: '' as string | null,
      paymentMethods: [] as PaymentMethod[],
      cardForm: {
        holderName: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
        isDefault: false
      } as CardForm,
      billingForm: {
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      } as BillingForm
    };
  },
  
  methods: {
    formatCardNumber(event: Event): void {
      const input = event.target as HTMLInputElement;
      const value = input.value.replace(/\D/g, '');
      this.cardForm.cardNumber = (value.match(/.{1,4}/g) || []).join(' ');
    },
    
    formatExpiry(event: Event): void {
      const input = event.target as HTMLInputElement;
      let value = input.value.replace(/\D/g, '');
      if (value.length > 4) value = value.slice(0, 4);
      if (value.length >= 2) {
        value = `${value.slice(0, 2)}/${value.slice(2)}`;
      }
      this.cardForm.expiry = value;
    },
    
    async savePaymentMethod(): Promise<void> {
      this.isSavingCard = true;
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const [month, year] = this.cardForm.expiry.split('/');
        const newCardData = {
          holderName: this.cardForm.holderName,
          lastFour: this.cardForm.cardNumber.slice(-4),
          expiryMonth: month,
          expiryYear: year,
          isDefault: this.cardForm.isDefault,
          brand: this.detectCardBrand(this.cardForm.cardNumber)
        };

        if (this.showEditCardModal && this.editingCardId) {
          const index = this.paymentMethods.findIndex(m => m.id === this.editingCardId);
          if (index !== -1) {
            this.paymentMethods[index] = { ...this.paymentMethods[index], ...newCardData };
          }
        } else {
          const newCard: PaymentMethod = { ...newCardData, id: Date.now().toString() };
          this.paymentMethods.push(newCard);
          this.editingCardId = newCard.id;
        }
        
        if (this.cardForm.isDefault) {
          this.paymentMethods.forEach(method => {
            method.isDefault = method.id === this.editingCardId;
          });
        }
        
        this.closeModals();
        this.showSuccessOverlay = true;
        this.successTitle = this.showEditCardModal ? 'Card Updated!' : 'Card Added!';
        this.successMessage = `Your payment method has been successfully ${this.showEditCardModal ? 'updated' : 'added'}.`;
      } catch (error) {
        console.error('Error saving payment method:', error);
      } finally {
        this.isSavingCard = false;
      }
    },
    
    detectCardBrand(cardNumber: string): string {
      const num = cardNumber.replace(/\s/g, '');
      if (/^4/.test(num)) return 'visa';
      if (/^5[1-5]/.test(num)) return 'mastercard';
      if (/^3[47]/.test(num)) return 'amex';
      return 'unknown';
    },
    
    editPaymentMethod(method: PaymentMethod): void {
      this.editingCardId = method.id;
      this.cardForm = {
        holderName: method.holderName,
        cardNumber: `•••• •••• •••• ${method.lastFour}`,
        expiry: `${method.expiryMonth}/${method.expiryYear}`,
        cvv: '',
        isDefault: method.isDefault
      };
      this.showEditCardModal = true;
    },
    
    async setDefaultPaymentMethod(id: string): Promise<void> {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        this.paymentMethods.forEach(method => (method.isDefault = method.id === id));
        this.showSuccessOverlay = true;
        this.successTitle = 'Default Payment Updated!';
        this.successMessage = 'Your default payment method has been updated.';
      } catch (error) {
        console.error('Error setting default payment method:', error);
      }
    },
    
    async deletePaymentMethod(id: string): Promise<void> {
      if (!confirm('Are you sure you want to delete this payment method?')) return;
      
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        this.paymentMethods = this.paymentMethods.filter(method => method.id !== id);
        this.showSuccessOverlay = true;
        this.successTitle = 'Card Deleted!';
        this.successMessage = 'Your payment method has been successfully removed.';
      } catch (error) {
        console.error('Error deleting payment method:', error);
      }
    },
    
    async updateBillingAddress(): Promise<void> {
      this.isUpdatingBilling = true;
      try {
        // No API call, just update the overlay
        this.showSuccessOverlay = true;
        this.successTitle = 'Billing Address Updated!';
        this.successMessage = 'Your billing address has been successfully updated.';
        
        // This is a simplified approach, in a real implementation
        // you might want to update the user profile information in the authStore
        if (this.authStore.isAuthenticated) {
          // Could update user profile here if needed
          console.log('Billing details updated:', this.billingForm);
        }
      } catch (error) {
        console.error('Error updating billing address:', error);
        alert('Failed to update billing address. Please try again.');
      } finally {
        this.isUpdatingBilling = false;
      }
    },
    
    closeModals(): void {
      this.showAddCardModal = false;
      this.showEditCardModal = false;
      this.editingCardId = null;
      this.cardForm = {
        holderName: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
        isDefault: false
      };
    },
    
    closeSuccessOverlay(): void {
      this.showSuccessOverlay = false;
    },
    
    async loadBillingAddress(): Promise<void> {
      try {
        // Use auth store to get user details
        if (this.authStore.isAuthenticated && this.authStore.currentUser) {
          const user = this.authStore.currentUser;
          // Populate billing form from user data
          this.billingForm = {
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || ''
          };
        } else {
          // Try to get data from booking store
          if (this.bookingStore.currentBooking.length > 0) {
            // Get the first booking with guest info
            const bookingWithGuestInfo = this.bookingStore.currentBooking.find(booking => booking.guestInfo);
            if (bookingWithGuestInfo?.guestInfo) {
              this.billingForm = {
                firstName: bookingWithGuestInfo.guestInfo.firstName || '',
                lastName: bookingWithGuestInfo.guestInfo.lastName || '',
                email: bookingWithGuestInfo.guestInfo.email || '',
                phone: bookingWithGuestInfo.guestInfo.phone || ''
              };
            }
          }
        }
      } catch (error) {
        console.error('Error loading billing address:', error);
        // Keep default billing form
      }
    },
    
    async loadPaymentMethods(): Promise<void> {
      try {
        // Only load payment methods if user is authenticated
        if (this.authStore.isAuthenticated && this.authStore.currentUser) {
          const userId = this.authStore.currentUser.id;
          const response = await apiManager.getPaymentMethods(userId);
          
          if (response.success && response.paymentMethods.length > 0) {
            // Map the API response to our component's format
            this.paymentMethods = response.paymentMethods.map(card => ({
              id: card.id.toString(),
              brand: card.brand || card.card_type || 'Card',
              lastFour: card.last_four || card.card_number.slice(-4),
              expiryMonth: card.expiry_month,
              expiryYear: card.expiry_year,
              holderName: card.holder_name || 'Card Holder',
              isDefault: card.is_default
            }));
          } else {
            this.paymentMethods = [];
          }
        } else {
          // Guest users don't have saved payment methods
          this.paymentMethods = [];
        }
      } catch (error) {
        console.error('Error loading payment methods:', error);
        this.paymentMethods = [];
      }
    }
  }
});
</script>

<style scoped>
.input-field {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #D1D5DB;
  border-radius: 0.5rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-field:focus {
  border-color: #6366F1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}

.btn-primary {
    background-color: var(--color-primary, #00FE01);
  color: black;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: background-color 0.2s;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
}

.btn-primary:hover {
  background-color: var(--color-primary, #00FE01);
  color: black;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #F3F4F6;
  color: #374151;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: background-color 0.2s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  border: none;
  cursor: pointer;
}

.btn-secondary:hover {
  background-color: #E5E7EB;
}
</style>