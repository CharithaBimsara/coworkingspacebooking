<template>
  <div class="relative" ref="dropdownContainer">
    <!-- <label v-if="label" class="block text-sm font-medium text-black-600 mb-1.5">{{ label }}</label> -->
    <button
      @click="toggleDropdown"
      :class="['input-field flex items-center justify-between w-full px-3 py-2', heightClass, 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-600 text-black dark:text-white']"
      type="button"
    >
      <span class="flex items-center">
        <span class="mr-2">
          <svg class="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </span>
        <span class="text-black dark:text-white text-xs">{{ selectedOption.label }}</span>
      </span>
      <svg class="w-4 h-4 ml-2 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <div
      v-if="showDropdown"
      :class="['absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg z-50 max-h-48 overflow-y-auto custom-scrollbar', compact ? 'min-w-[140px]' : 'min-w-[220px]']"
    >
      <button
        v-for="option in teamSizeOptions"
        :key="option.value"
        @mousedown="selectOption(option)"
        class="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-600 last:border-b-0 flex items-center text-xs"
      >
        <span class="mr-2">
          <svg class="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </span>
        <span class="text-black dark:text-white text-xs">{{ option.label }}</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue'

export default defineComponent({
  name: 'TeamSizeDropdown',
  props: {
    modelValue: {
      type: String,
      default: '1-5'
    },
    label: {
      type: String,
      default: 'Team Size'
    },
    maxCapacity: {
      type: Number,
      default: 50
    },
    compact: {
      type: Boolean,
      default: false
    },
    heightClass: {
      type: String,
      default: 'h-11'
    }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const showDropdown = ref(false)
    
    const teamSizeOptions = computed(() => {
      // Dynamically create team size options based on max capacity
      const maxCapacity = props.maxCapacity || 50;
      
      if (maxCapacity <= 5) {
        return [{ value: `1-${maxCapacity}`, label: `1-${maxCapacity} people` }];
      }
      
      if (maxCapacity <= 10) {
        return [
          { value: '1-5', label: '1-5 people' },
          { value: `6-${maxCapacity}`, label: `6-${maxCapacity} people` }
        ];
      }
      
      if (maxCapacity <= 15) {
        return [
          { value: '1-5', label: '1-5 people' },
          { value: '6-10', label: '6-10 people' },
          { value: `11-${maxCapacity}`, label: `11-${maxCapacity} people` }
        ];
      }
      
      if (maxCapacity <= 30) {
        return [
          { value: '1-5', label: '1-5 people' },
          { value: '6-15', label: '6-15 people' },
          { value: `16-${maxCapacity}`, label: `16-${maxCapacity} people` }
        ];
      }
      
      // Default ranges for larger capacities
      return [
        { value: '1-5', label: '1-5 people' },
        { value: '6-15', label: '6-15 people' },
        { value: '16-30', label: '16-30 people' },
        { value: `31-${maxCapacity}`, label: `31-${maxCapacity} people` }
      ];
    })
    
    const selectedOption = computed(() => {
      return teamSizeOptions.value.find(opt => opt.value === props.modelValue) || teamSizeOptions.value[0]
    })
    
    const dropdownContainer = ref<HTMLElement | null>(null)

    function toggleDropdown() {
      showDropdown.value = !showDropdown.value
    }

    function selectOption(option: { value: string, label: string }) {
      emit('update:modelValue', option.value)
      emit('change', option)
      showDropdown.value = false
    }

    // Handle click outside to close dropdown
    function handleClickOutside(event: MouseEvent) {
      if (dropdownContainer.value && !dropdownContainer.value.contains(event.target as Node)) {
        showDropdown.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('mousedown', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('mousedown', handleClickOutside)
    })

    return {
      showDropdown,
      selectedOption,
      teamSizeOptions,
      toggleDropdown,
      selectOption,
      dropdownContainer
    }
  }
})
</script>

<style scoped>
.input-field {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #E5E7EB; /* Light gray border */
  border-radius: 0.5rem;
  outline: none;
  background: #FFFFFF; /* White background */
}

.dark .input-field {
  background: #1F2937; /* Dark gray background */
  border-color: #374151; /* Darker gray border */
  color: #FFFFFF; /* White text */
}

.input-field:focus {
  border-color: #D1D5DB; /* Lighter gray on focus */
}

.dark .input-field:focus {
  border-color: #6B7280; /* Darker gray on focus */
}

.custom-scrollbar::-webkit-scrollbar {
  width: 10px !important;
  background: #FFFFFF !important; /* White scrollbar track */
  border-radius: 10px !important;
}

.dark .custom-scrollbar::-webkit-scrollbar {
  background: #1F2937 !important; /* Dark scrollbar track */
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #000000 40%, #4A4A4A 100%) !important; /* Black to dark gray gradient */
  border-radius: 10px !important;
  min-height: 40px !important;
  border: 2px solid #FFFFFF !important; /* White border to match track */
  transition: background 0.2s;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #6B7280 40%, #9CA3AF 100%) !important; /* Gray gradient for dark mode */
  border: 2px solid #1F2937 !important; /* Dark border to match track */
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #1A1A1A 40%, #333333 100%) !important; /* Darker black on hover */
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #4B5563 40%, #6B7280 100%) !important; /* Darker gray on hover */
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #000000 #FFFFFF; /* Black thumb, white track */
}

.dark .custom-scrollbar {
  scrollbar-color: #6B7280 #1F2937; /* Gray thumb, dark track */
}
</style>
