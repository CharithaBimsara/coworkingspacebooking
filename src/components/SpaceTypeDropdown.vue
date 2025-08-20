<template>
  <div class="relative" ref="dropdownContainer">
    <label v-if="label" class="block text-sm font-medium text-black mb-3">{{ label }}</label>
    <button
      @click="toggleDropdown"
      class="input-field flex items-center justify-between w-full px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
      type="button"
    >
      <span class="flex items-center">
        <span v-if="selectedOption.icon" class="mr-2" v-html="selectedOption.icon"></span>
        <span class="text-black">{{ selectedOption.label }}</span>
      </span>
      <svg class="w-4 h-4 ml-2 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <div
      v-if="showDropdown"
      class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-24 overflow-y-auto custom-scrollbar min-w-[220px]"
    >
      <button
        v-for="option in options"
        :key="option.value"
        @mousedown="selectOption(option)"
        class="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-b-0 flex items-center"
      >
        <span v-if="option.icon" class="mr-2" v-html="option.icon"></span>
        <span class="text-black">{{ option.label }}</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
  name: 'SpaceTypeDropdown',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: 'Space Type'
    },
    options: {
      type: Array as PropType<Array<{ value: string, label: string, icon?: any }>>,
      required: true
    }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const showDropdown = ref(false)
    const selectedOption = computed(() => {
      return props.options.find(opt => opt.value === props.modelValue) || props.options[0]
    })
    const dropdownContainer = ref<HTMLElement | null>(null)

    function toggleDropdown() {
      showDropdown.value = !showDropdown.value
    }

    function selectOption(option: { value: string, label: string, icon?: any }) {
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
  transition: border-color 0.2s, box-shadow 0.2s;
  background: #FFFFFF; /* White background */
}
.input-field:focus {
  border-color: #D1D5DB; /* Lighter gray on focus */
  box-shadow: 0 0 0 2px rgba(209, 213, 219, 0.3); /* Subtle light gray shadow */
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