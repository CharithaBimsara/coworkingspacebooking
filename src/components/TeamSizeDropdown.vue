<template>
  <div class="relative" ref="dropdownContainer">
    <!-- <label v-if="label" class="block text-sm font-medium text-black-600 mb-1.5">{{ label }}</label> -->
    <button
      @click="toggleDropdown"
      :class="['input-field flex items-center justify-between w-full px-3 py-2', heightClass, 'bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-100']"
      type="button"
    >
      <span class="flex items-center">
        <span class="mr-2">
          <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </span>
        <span class="text-black text-xs">{{ selectedOption.label }}</span>
      </span>
      <svg class="w-4 h-4 ml-2 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <div
      v-if="showDropdown"
      :class="['absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg z-50 max-h-48 overflow-y-auto custom-scrollbar', compact ? 'min-w-[140px]' : 'min-w-[220px]']"
    >
      <button
        v-for="option in teamSizeOptions"
        :key="option.value"
        @mousedown="selectOption(option)"
        class="w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-b-0 flex items-center text-xs"
      >
        <span class="mr-2">
          <svg class="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </span>
        <span class="text-black text-xs">{{ option.label }}</span>
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
    
    const teamSizeOptions = computed(() => [
      { value: '1-5', label: '1-5 people' },
      { value: '6-15', label: '6-15 people' },
      { value: '16-30', label: '16-30 people' },
      { value: `30-${props.maxCapacity}`, label: `30-${props.maxCapacity} people` }
    ])
    
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

.input-field:focus {
  border-color: #D1D5DB; /* Lighter gray on focus */
}

.custom-scrollbar::-webkit-scrollbar {
  width: 10px !important;
  background: #FFFFFF !important; /* White scrollbar track */
  border-radius: 10px !important;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #000000 40%, #4A4A4A 100%) !important; /* Black to dark gray gradient */
  border-radius: 10px !important;
  min-height: 40px !important;
  border: 2px solid #FFFFFF !important; /* White border to match track */
  transition: background 0.2s;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #1A1A1A 40%, #333333 100%) !important; /* Darker black on hover */
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #000000 #FFFFFF; /* Black thumb, white track */
}
</style>
