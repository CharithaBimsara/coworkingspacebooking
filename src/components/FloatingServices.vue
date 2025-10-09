<template>
  <div class="floating-services-container" :class="{ 'minimized': isMinimized }">
    <div class="panel-header">
      <h3>{{ isMinimized ? 'Add Service' : 'Choose a Service' }}</h3>
      <div>
        <button @click="toggleMinimized" class="panel-header-btn">{{ isMinimized ? 'Expand' : 'Minimize' }}</button>
        <button @click="closePanel" class="panel-header-btn">Close</button>
      </div>
    </div>
    <div class="panel-content">
      <SpaceList v-if="!isLoading" :spaces="spaces" />
      <div v-else class="loading-spinner">
        <div class="spinner"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SpaceList from './SpaceList.vue';
import { apiManager } from '../api/apiManager';
import type { SpaceDto } from '../dto/response';

export default defineComponent({
  name: 'FloatingServices',
  components: {
    SpaceList,
  },
  data() {
    return {
      isMinimized: false,
      isLoading: false,
      spaces: [] as SpaceDto[],
    };
  },
  mounted() {
    this.loadSpaces();
  },
  methods: {
    toggleMinimized() {
      this.isMinimized = !this.isMinimized;
    },
    closePanel() {
      this.$emit('close');
    },
    async loadSpaces() {
      this.isLoading = true;
      try {
        const response = await apiManager.getSpaces({});
        if (response.success) {
          this.spaces = response.spaces || [];
        } else {
          console.error('Failed to load spaces:', response.message);
        }
      } catch (error) {
        console.error('Error loading spaces:', error);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
</script>

<style scoped>
.floating-services-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 800px; /* Increased width to accommodate 3 cards */
  height: 600px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  z-index: 100;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dark .floating-services-container {
  background-color: #1f2937;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.floating-services-container.minimized {
  width: 200px;
  height: 60px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.dark .panel-header {
  border-bottom-color: #374151;
  background-color: #111827;
}

.panel-header-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    color: #6b7280;
}

.dark .panel-header-btn {
  color: #9ca3af;
}

.panel-content {
  padding: 1rem;
  overflow-y: auto;
  flex-grow: 1;
}

.floating-services-container.minimized .panel-content {
  display: none;
}

.loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border-left-color: #09f;
    animation: spin 1s ease infinite;
}

.dark .spinner {
  border-color: rgba(255, 255, 255, 0.1);
  border-left-color: #00fe01;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

</style>
