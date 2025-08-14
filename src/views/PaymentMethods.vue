<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto container-padding py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Payment Methods</h1>
            <p class="text-gray-600 mt-1">Manage your payment cards and billing information</p>
          </div>
          <router-link to="/my-bookings" class="btn-primary">
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
      <div class="bg-white rounded-xl shadow-card p-6 mb-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900">Saved Payment Methods</h2>
          <button @click="showAddCardModal = true" class="btn-primary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New Card
          </button>
        </div>

        <div v-if="paymentMethods.length === 0" class="text-center py-12">
          <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No payment methods</h3>
          <p class="text-gray-600 mb-4">Add a payment method to make bookings easier</p>
          <button @click="showAddCardModal = true" class="btn-primary">
            Add Your First Card
          </button>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="method in paymentMethods"
            :key="method.id"
            class="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <!-- Card Icon -->
                <div class="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                  </svg>
                </div>
                
                <div>
                  <div class="flex items-center space-x-2">
                    <span class="font-medium text-gray-900">•••• •••• •••• {{ method.lastFour }}</span>
                    <span
                      v-if="method.isDefault"
                      class="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full"
                    >
                      Default
                    </span>
                  </div>
                  <div class="text-sm text-gray-600">
                    {{ method.brand.toUpperCase() }} • Expires {{ method.expiryMonth }}/{{ method.expiryYear }}
                  </div>
                  <div class="text-sm text-gray-500">{{ method.holderName }}</div>
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <button
                  v-if="!method.isDefault"
                  @click="setDefaultPaymentMethod(method.id)"
                  class="text-primary hover:text-primary/80 text-sm font-medium"
                >
                  Set as Default
                </button>
                <button
                  @click="editPaymentMethod(method)"
                  class="text-gray-600 hover:text-gray-900 p-2"
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
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Billing Address -->
      <div class="bg-white rounded-xl shadow-card p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Billing Address</h2>
        
        <form @submit.prevent="updateBillingAddress" class="space-y-6">
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                v-model="billingForm.firstName"
                type="text"
                required
                class="input-field"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                v-model="billingForm.lastName"
                type="text"
                required
                class="input-field"
              >
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Company (Optional)</label>
            <input
              v-model="billingForm.company"
              type="text"
              class="input-field"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Address Line 1</label>
            <input
              v-model="billingForm.addressLine1"
              type="text"
              required
              class="input-field"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Address Line 2 (Optional)</label>
            <input
              v-model="billingForm.addressLine2"
              type="text"
              class="input-field"
            >
          </div>

          <div class="grid md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                v-model="billingForm.city"
                type="text"
                required
                class="input-field"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">State</label>
              <select v-model="billingForm.state" required class="input-field">
                <option value="">Select State</option>
                <option value="CA">California</option>
                <option value="NY">New York</option>
                <option value="TX">Texas</option>
                <option value="FL">Florida</option>
                <!-- Add more states as needed -->
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
              <input
                v-model="billingForm.zipCode"
                type="text"
                required
                class="input-field"
              >
            </div>
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
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ showEditCardModal ? 'Edit Payment Method' : 'Add New Payment Method' }}
          </h3>
          <button @click="closeModals" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="savePaymentMethod" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
            <input
              v-model="cardForm.holderName"
              type="text"
              required
              class="input-field"
              placeholder="John Doe"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
            <input
              v-model="cardForm.cardNumber"
              type="text"
              required
              class="input-field"
              placeholder="1234 5678 9012 3456"
              maxlength="19"
              @input="formatCardNumber"
            >
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
              <input
                v-model="cardForm.expiry"
                type="text"
                required
                class="input-field"
                placeholder="MM/YY"
                maxlength="5"
                @input="formatExpiry"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">CVV</label>
              <input
                v-model="cardForm.cvv"
                type="text"
                required
                class="input-field"
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
              class="rounded border-gray-300 text-primary focus:ring-primary"
            >
            <label for="setDefault" class="ml-2 text-sm text-gray-700">
              Set as default payment method
            </label>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeModals"
              class="btn-primary"
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
import { defineComponent } from 'vue'
import SuccessOverlay from '../components/SuccessOverlay.vue'

interface PaymentMethod {
  id: string
  brand: string
  lastFour: string
  expiryMonth: string
  expiryYear: string
  holderName: string
  isDefault: boolean
}

export default defineComponent({
  name: 'PaymentMethods',
  
  components: {
    SuccessOverlay
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
      editingCardId: '',
      
      paymentMethods: [
        {
          id: '1',
          brand: 'visa',
          lastFour: '4242',
          expiryMonth: '12',
          expiryYear: '25',
          holderName: 'John Doe',
          isDefault: true
        },
        {
          id: '2',
          brand: 'mastercard',
          lastFour: '8888',
          expiryMonth: '08',
          expiryYear: '26',
          holderName: 'John Doe',
          isDefault: false
        }
      ] as PaymentMethod[],
      
      cardForm: {
        holderName: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
        isDefault: false
      },
      
      billingForm: {
        firstName: 'John',
        lastName: 'Doe',
        company: 'Tech Startup Inc.',
        addressLine1: '123 Main Street',
        addressLine2: 'Suite 100',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105'
      }
    }
  },
  
  methods: {
    formatCardNumber(event: Event): void {
      const input = event.target as HTMLInputElement
      let value = input.value.replace(/\s/g, '').replace(/[^0-9]/gi, '')
      const formattedValue = value.match(/.{1,4}/g)?.join(' ') || value
      this.cardForm.cardNumber = formattedValue
    },
    
    formatExpiry(event: Event): void {
      const input = event.target as HTMLInputElement
      let value = input.value.replace(/\D/g, '')
      if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4)
      }
      this.cardForm.expiry = value
    },
    
    async savePaymentMethod(): Promise<void> {
      this.isSavingCard = true
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        if (this.showEditCardModal) {
          // Update existing card
          const index = this.paymentMethods.findIndex(m => m.id === this.editingCardId)
          if (index !== -1) {
            const [month, year] = this.cardForm.expiry.split('/')
            this.paymentMethods[index] = {
              ...this.paymentMethods[index],
              holderName: this.cardForm.holderName,
              lastFour: this.cardForm.cardNumber.slice(-4),
              expiryMonth: month,
              expiryYear: year,
              isDefault: this.cardForm.isDefault
            }
          }
        } else {
          // Add new card
          const [month, year] = this.cardForm.expiry.split('/')
          const newCard: PaymentMethod = {
            id: Date.now().toString(),
            brand: this.detectCardBrand(this.cardForm.cardNumber),
            lastFour: this.cardForm.cardNumber.slice(-4),
            expiryMonth: month,
            expiryYear: year,
            holderName: this.cardForm.holderName,
            isDefault: this.cardForm.isDefault
          }
          
          this.paymentMethods.push(newCard)
        }
        
        // If setting as default, update other cards
        if (this.cardForm.isDefault) {
          this.paymentMethods.forEach(method => {
            if (method.id !== this.editingCardId) {
              method.isDefault = false
            }
          })
        }
        
        this.closeModals()
        this.showSuccessOverlay = true
        this.successTitle = this.showEditCardModal ? 'Card Updated!' : 'Card Added!'
        this.successMessage = `Your payment method has been successfully ${this.showEditCardModal ? 'updated' : 'added'}.`
      } catch (error) {
        console.error('Error saving payment method:', error)
      } finally {
        this.isSavingCard = false
      }
    },
    
    detectCardBrand(cardNumber: string): string {
      const number = cardNumber.replace(/\s/g, '')
      if (number.startsWith('4')) return 'visa'
      if (number.startsWith('5') || number.startsWith('2')) return 'mastercard'
      if (number.startsWith('3')) return 'amex'
      return 'unknown'
    },
    
    editPaymentMethod(method: PaymentMethod): void {
      this.editingCardId = method.id
      this.cardForm = {
        holderName: method.holderName,
        cardNumber: `•••• •••• •••• ${method.lastFour}`,
        expiry: `${method.expiryMonth}/${method.expiryYear}`,
        cvv: '',
        isDefault: method.isDefault
      }
      this.showEditCardModal = true
    },
    
    async setDefaultPaymentMethod(id: string): Promise<void> {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        this.paymentMethods.forEach(method => {
          method.isDefault = method.id === id
        })
        
        this.showSuccessOverlay = true
        this.successTitle = 'Default Payment Updated!'
        this.successMessage = 'Your default payment method has been updated.'
      } catch (error) {
        console.error('Error setting default payment method:', error)
      }
    },
    
    async deletePaymentMethod(id: string): Promise<void> {
      if (!confirm('Are you sure you want to delete this payment method?')) {
        return
      }
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        this.paymentMethods = this.paymentMethods.filter(method => method.id !== id)
        
        this.showSuccessOverlay = true
        this.successTitle = 'Card Deleted!'
        this.successMessage = 'Your payment method has been successfully removed.'
      } catch (error) {
        console.error('Error deleting payment method:', error)
      }
    },
    
    async updateBillingAddress(): Promise<void> {
      this.isUpdatingBilling = true
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.showSuccessOverlay = true
        this.successTitle = 'Billing Address Updated!'
        this.successMessage = 'Your billing address has been successfully updated.'
      } catch (error) {
        console.error('Error updating billing address:', error)
      } finally {
        this.isUpdatingBilling = false
      }
    },
    
    closeModals(): void {
      this.showAddCardModal = false
      this.showEditCardModal = false
      this.editingCardId = ''
      this.cardForm = {
        holderName: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
        isDefault: false
      }
    },
    
    closeSuccessOverlay(): void {
      this.showSuccessOverlay = false
      this.successTitle = ''
      this.successMessage = ''
    }
  }
})
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
  background-color: #6366F1;
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
  background-color: #5B5CF6;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
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

.btn-primary:hover {
  background-color: #E5E7EB;
}
</style>
