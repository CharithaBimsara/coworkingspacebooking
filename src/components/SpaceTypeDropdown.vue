<template>
  <div class="relative">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-3">{{ label }}</label>
    <button
      @click="toggleDropdown"
      class="input-field flex items-center justify-between w-full px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
      type="button"
    >
      <span class="flex items-center">
  <span v-if="selectedOption.icon" class="mr-2" v-html="selectedOption.icon"></span>
        <span>{{ selectedOption.label }}</span>
      </span>
      <svg class="w-4 h-4 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <div
      v-if="showDropdown"
      class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto custom-scrollbar min-w-[220px]"
    >
      <button
        v-for="option in options"
        :key="option.value"
        @mousedown="selectOption(option)"
        class="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center"
      >
  <span v-if="option.icon" class="mr-2" v-html="option.icon"></span>
        <span>{{ option.label }}</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
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
    function toggleDropdown() {
      showDropdown.value = !showDropdown.value
    }
    function selectOption(option: { value: string, label: string, icon?: any }) {
      emit('update:modelValue', option.value)
      emit('change', option)
      showDropdown.value = false
    }
    return {
      showDropdown,
      selectedOption,
      toggleDropdown,
      selectOption
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
  background: #fff;
}
.input-field:focus {
  border-color: #6366F1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}
.custom-scrollbar::-webkit-scrollbar {
  width: 10px !important;
  background: #f3f4f6 !important;
  border-radius: 10px !important;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #6366f1 40%, #a5b4fc 100%) !important;
  border-radius: 10px !important;
  min-height: 40px !important;
  border: 2px solid #f3f4f6 !important;
  transition: background 0.2s;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #4338ca 40%, #818cf8 100%) !important;
}
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #6366f1 #f3f4f6;
}
</style>
