<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" @click.self="closeModal">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden border border-gray-100 dark:border-gray-700">
          <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <span v-if="type === 'terms'" class="mr-2">
                <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </span>
              <span v-else class="mr-2">
                <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
                </svg>
              </span>
              {{ title }}
            </h2>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="p-6 overflow-y-auto max-h-[70vh] policy-content">
            <div v-html="content" class="prose prose-sm dark:prose-invert max-w-none"></div>
          </div>
          <div class="flex justify-end pt-1 pb-2 px-8 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <button @click="closeModal" class="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors font-medium flex items-center">
              <span>I Understand</span>
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">

const props = defineProps<{
  show: boolean;
  title: string;
  content: string;
  type: 'terms' | 'payment';
}>();

const emit = defineEmits<{
  close: [];
}>();

const closeModal = () => {
  emit('close');
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95);
}

:deep(.policy-content h3) {
  color: var(--color-primary);
  font-size: 1.5rem;
  margin-bottom: 1.25rem;
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

:deep(.policy-content h4) {
  font-size: 1.125rem;
  font-weight: 600;
  margin-top: 1.75rem;
  margin-bottom: 0.75rem;
  color: #111827;
}

.dark :deep(.policy-content h4) {
  color: #f9fafb;
}

:deep(.policy-content ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 1.25rem;
}

:deep(.policy-content li) {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

:deep(.policy-content p) {
  margin-bottom: 1.25rem;
  line-height: 1.6;
}
</style>