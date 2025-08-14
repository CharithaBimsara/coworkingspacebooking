<template>
  <div 
    v-if="show" 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click="closeOverlay"
  >
    <div 
      class="bg-white rounded-2xl p-8 max-w-md mx-4 text-center transform transition-all duration-300"
      :class="show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'"
      @click.stop
    >
      <!-- Success Icon -->
      <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <!-- Title -->
      <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ title }}</h3>
      
      <!-- Message -->
      <p class="text-gray-600 mb-6 leading-relaxed">{{ message }}</p>
      
      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <button 
          v-if="primaryAction"
          @click="handlePrimaryAction"
          class="btn-primary px-6 py-2"
        >
          {{ primaryAction.text }}
        </button>
        <button 
          @click="closeOverlay"
          class="btn-primary px-6 py-2"
        >
          {{ closeText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface PrimaryAction {
  text: string
  action: () => void
}

export default defineComponent({
  name: 'SuccessOverlay',
  
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    primaryAction: {
      type: Object as () => PrimaryAction | null,
      default: null
    },
    closeText: {
      type: String,
      default: 'Close'
    },
    autoClose: {
      type: Number,
      default: 0 // 0 means no auto close
    }
  },
  
  emits: ['close'],
  
  mounted() {
    if (this.autoClose > 0) {
      setTimeout(() => {
        this.closeOverlay()
      }, this.autoClose)
    }
  },
  
  methods: {
    closeOverlay(): void {
      this.$emit('close')
    },
    
    handlePrimaryAction(): void {
      if (this.primaryAction) {
        this.primaryAction.action()
      }
      this.closeOverlay()
    }
  }
})
</script>

<style scoped>
.btn-primary {
  background-color: #6366F1;
  color: white;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #5B5CF6;
}

.btn-primary {
  background-color: #F3F4F6;
  color: #374151;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #E5E7EB;
}
</style>