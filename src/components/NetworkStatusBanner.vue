<template>
  <transition name="slide-fade">
    <div
      v-if="shouldShow"
      class="fixed top-0 inset-x-0 z-[70] flex justify-center px-4"
    >
      <div
        class="mt-2 w-full max-w-4xl rounded-2xl border border-red-200 bg-red-50/90 p-4 text-red-800 shadow-lg backdrop-blur"
        role="alert"
      >
        <div class="flex items-start gap-3">
          <svg
            class="h-5 w-5 flex-shrink-0 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <div class="flex-1 text-sm">
            <p class="font-semibold">
              {{ titleText }}
            </p>
            <p class="mt-1 leading-snug">
              {{ messageText }}
            </p>
            <div v-if="hasTechnicalDetails" class="mt-3 space-y-1 text-xs text-red-600/80">
              <button
                type="button"
                class="font-medium underline underline-offset-2 transition hover:text-red-700"
                @click="toggleDetails"
              >
                {{ showTechnicalDetails ? 'Hide technical details' : 'Show technical details' }}
              </button>
              <div
                v-if="showTechnicalDetails"
                class="rounded-lg border border-red-200/80 bg-white/60 p-2 text-[11px] text-red-700"
              >
                <p v-if="systemStore.lastApiError?.endpoint">
                  <span class="font-semibold">Endpoint:</span>
                  {{ systemStore.lastApiError?.endpoint }}
                </p>
                <p v-if="systemStore.lastApiError?.statusCode">
                  <span class="font-semibold">Status:</span>
                  {{ systemStore.lastApiError?.statusCode }}
                </p>
                <p v-if="formattedTimestamp">
                  <span class="font-semibold">Detected:</span>
                  {{ formattedTimestamp }}
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            class="rounded-full bg-red-100/60 p-1.5 text-red-600 transition hover:bg-red-200"
            @click="dismiss"
          >
            <span class="sr-only">Dismiss</span>
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSystemStore } from '../stores/system'

const systemStore = useSystemStore()
const { showErrorBanner, lastApiError, isOnline } = storeToRefs(systemStore)

const showTechnicalDetails = ref(false)

const shouldShow = computed(() => showErrorBanner.value && !!lastApiError.value)

const titleText = computed(() => {
  if (!isOnline.value) {
    return 'You are currently offline'
  }
  return 'We are having trouble reaching the servers'
})

const messageText = computed(() => {
  if (!lastApiError.value) return ''
  return lastApiError.value.message || 'Please check your connection or try again in a moment.'
})

const hasTechnicalDetails = computed(() => {
  if (!lastApiError.value) return false
  return Boolean(lastApiError.value.endpoint || lastApiError.value.statusCode)
})

const formattedTimestamp = computed(() => {
  if (!lastApiError.value?.timestamp) return ''
  return new Date(lastApiError.value.timestamp).toLocaleString()
})

const toggleDetails = () => {
  showTechnicalDetails.value = !showTechnicalDetails.value
}

const dismiss = () => {
  systemStore.clearErrorBanner()
  showTechnicalDetails.value = false
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.25s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
