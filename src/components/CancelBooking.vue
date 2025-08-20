<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click.self="$emit('close')"
  >
    <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900">Confirm Cancellation</h2>
        <button class="text-gray-400 hover:text-gray-600" @click="$emit('close')">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div class="my-4">
        <p class="text-gray-600">
          Are you sure you want to cancel this booking? Please note that there are
          <span class="font-bold text-red-600">no refunds</span> for cancellations.
        </p>
      </div>
      <div class="flex justify-end gap-3">
        <button class="btn-secondary" @click="$emit('close')">Go Back</button>
        <button class="btn-danger" @click="$emit('confirm')">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  show: {
    type: Boolean,
    required: true
  }
})

defineEmits(['close', 'confirm'])
</script>

<style scoped>
.btn-secondary {
  @apply rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary;
}
.btn-danger {
  @apply rounded-lg border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500;
}
</style>
