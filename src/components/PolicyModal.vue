<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click="closeOnOverlayClick ? close() : null">
    <div class="absolute inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm transition-opacity" 
      :class="{ 'opacity-0': isClosing, 'opacity-100': !isClosing }"></div>
    
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col transform transition-all"
      :class="{ 'opacity-0 scale-95': isClosing, 'opacity-100 scale-100': !isClosing }"
      @click.stop>
      
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ title }}</h2>
        <button @click="close" class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <svg class="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Content -->
      <div class="flex-1 overflow-y-auto px-6 py-4 policy-content">
        <div v-if="type === 'terms'">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Terms and Conditions for Online Reservations</h3>
          <p class="mb-4 text-gray-700 dark:text-gray-300">By making a reservation for a hotdesk, dedicated desk, or meeting room through our online booking system, you agree to the following terms and conditions:</p>
          
          <div v-for="(section, index) in termsSections" :key="index" class="mb-6">
            <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-2">{{ section.title }}</h4>
            <ul class="list-disc pl-5 space-y-1">
              <li v-for="(item, itemIndex) in section.items" :key="itemIndex" class="text-gray-700 dark:text-gray-300">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
        
        <div v-else-if="type === 'privacy'">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Policy</h3>
          <p class="mb-4 text-gray-700 dark:text-gray-300">This Payment Policy applies to all reservations made for hotdesks, dedicated desks, and meeting rooms through our online booking platform. By confirming a booking, you agree to the following terms:</p>
          
          <div v-for="(section, index) in privacySections" :key="index" class="mb-6">
            <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-2">{{ section.title }}</h4>
            <ul class="list-disc pl-5 space-y-1">
              <li v-for="(item, itemIndex) in section.items" :key="itemIndex" class="text-gray-700 dark:text-gray-300">
                {{ item }}
              </li>
            </ul>
          </div>
          
          <p class="mt-6 text-gray-700 dark:text-gray-300">By making a payment, you acknowledge that you have read, understood, and agree to this Payment Policy.</p>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
        <button @click="close" class="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg shadow-sm transition-colors">
          I Understand
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';

export default defineComponent({
  name: 'PolicyModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String as PropType<'terms' | 'privacy'>,
      required: true,
      validator: (value: string) => ['terms', 'privacy'].includes(value)
    },
    closeOnOverlayClick: {
      type: Boolean,
      default: true
    }
  },
  
  emits: ['close'],
  
  data() {
    return {
      isClosing: false,
      termsSections: [
        {
          title: '1. Reservations',
          items: [
            'Reservations are subject to availability and are confirmed only upon receipt of full payment or valid booking confirmation.',
            'Bookings must be made using the official online booking platform.'
          ]
        },
        {
          title: '2. Payment and Fees',
          items: [
            'All fees must be paid in advance unless otherwise agreed.',
            'Prices displayed are inclusive of applicable taxes (as specified at checkout).',
            'Additional charges may apply for extended usage, extra services, or late check-out.'
          ]
        },
        {
          title: '3. Cancellations and Refunds',
          items: [
            'All bookings are non-refundable.',
            'If you are unable to attend, you may request to reschedule your booking to another available date and time, subject to availability.',
            'Rescheduling requests must be made at least 24 hours before the original booking start time.',
            'No-shows will be charged the full booking amount.'
          ]
        },
        {
          title: '4. Usage Policy',
          items: [
            'Workspaces and meeting rooms may only be used for lawful business or professional purposes.',
            'The booking is non-transferable and valid only for the individual or organization named in the reservation.',
            'Users must not exceed the maximum occupancy stated for each booking type.',
            'Food, beverages, and equipment brought into the premises must comply with venue policies.'
          ]
        },
        {
          title: '5. Conduct and Responsibilities',
          items: [
            'Users are expected to maintain professional behavior and respect other occupants.',
            'Noise levels must be kept at a minimum.',
            'Any damage to property, equipment, or facilities will be charged to the user.',
            'The provider is not responsible for loss or theft of personal belongings.'
          ]
        },
        {
          title: '6. Access and Security',
          items: [
            'Users must check in at the designated reception or follow access instructions provided in the booking confirmation.',
            'Sharing access credentials or allowing unauthorized entry is strictly prohibited.'
          ]
        },
        {
          title: '7. Liability',
          items: [
            'The provider shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of the facilities.',
            'Users assume responsibility for their own safety and that of their guests.'
          ]
        },
        {
          title: '8. Changes to Terms',
          items: [
            'The provider reserves the right to amend these terms and conditions at any time. Updates will be posted on the booking platform and shall apply to future bookings.'
          ]
        },
        {
          title: '9. Governing Law',
          items: [
            'These terms and conditions are governed by the laws of Sri Lanka.'
          ]
        }
      ],
      
      privacySections: [
        {
          title: '1. Payment Requirement',
          items: [
            'Full payment is required at the time of booking to confirm a reservation.',
            'Bookings that are not paid in full will not be secured and may be automatically canceled.'
          ]
        },
        {
          title: '2. Accepted Payment Methods',
          items: [
            'Payments can be made through the online payment gateway provided on the booking platform.',
            'We accept major credit/debit cards and other digital payment methods as displayed at checkout.',
            'Cash payments are not accepted for online reservations.'
          ]
        },
        {
          title: '3. Non-Refundable Policy',
          items: [
            'All payments are non-refundable, regardless of cancellation or no-show.',
            'Customers may request to reschedule their booking to a different available date and time, provided the request is made at least 24 hours before the original start time.'
          ]
        },
        {
          title: '4. Additional Charges',
          items: [
            'Any additional services, extended usage, or damages caused to the property will be charged separately.',
            'Failure to settle outstanding charges may result in suspension of future bookings.'
          ]
        },
        {
          title: '5. Payment Security',
          items: [
            'All online transactions are processed securely through trusted third-party payment providers.',
            'We do not store credit card or banking details on our servers.'
          ]
        },
        {
          title: '6. Invoice and Receipts',
          items: [
            'A payment receipt will be automatically generated and sent to the registered email address after successful payment.',
            'Official invoices can be requested by contacting our support team.'
          ]
        },
        {
          title: '7. Policy Updates',
          items: [
            'We reserve the right to update or amend this Payment Policy at any time. Updates will be effective immediately upon posting on the booking platform.'
          ]
        }
      ]
    };
  },
  
  computed: {
    title(): string {
      return this.type === 'terms' ? 'Terms and Conditions' : 'Payment Policy';
    }
  },
  
  methods: {
    close() {
      this.isClosing = true;
      
      setTimeout(() => {
        this.isClosing = false;
        this.$emit('close');
      }, 200); // Animation duration
    }
  }
});
</script>

<style scoped>
.policy-content {
  scroll-behavior: smooth;
  scroll-padding: 1rem;
}

.policy-content::-webkit-scrollbar {
  width: 6px;
}

.policy-content::-webkit-scrollbar-track {
  background: transparent;
}

.policy-content::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.policy-content::-webkit-scrollbar-thumb:hover {
  background-color: rgba(107, 114, 128, 0.7);
}

/* Animation classes */
.opacity-0 {
  opacity: 0;
}

.opacity-100 {
  opacity: 1;
}

.scale-95 {
  transform: scale(0.95);
}

.scale-100 {
  transform: scale(1);
}

/* Fix tailwind transition */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.transition-opacity {
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>