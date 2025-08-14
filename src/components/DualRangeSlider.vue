<template>
  <div class="dual-range-slider">
    <div class="slider-track"></div>
    <div 
      class="slider-range"
      :style="{ left: rangeLeft + '%', width: rangeWidth + '%' }"
    ></div>
    <input 
      type="range" 
      :min="minVal" 
      :max="maxVal" 
      v-model.number="currentMin" 
      class="range-input range-min"
      @input="emitChange"
    >
    <input 
      type="range" 
      :min="minVal" 
      :max="maxVal" 
      v-model.number="currentMax" 
      class="range-input range-max"
      @input="emitChange"
    >
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';

export default defineComponent({
  name: 'DualRangeSlider',
  props: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    minVal: { type: Number, default: 0 },
    maxVal: { type: Number, default: 100 },
  },
  emits: ['update:min', 'update:max', 'change'],
  setup(props, { emit }) {
    const currentMin = ref(props.min);
    const currentMax = ref(props.max);

    // Ensure min is always less than or equal to max
    watch(currentMin, (newMin) => {
      if (newMin > currentMax.value) {
        currentMax.value = newMin;
      }
    });

    watch(currentMax, (newMax) => {
      if (newMax < currentMin.value) {
        currentMin.value = newMax;
      }
    });

    const rangeLeft = computed(() => {
      return ((currentMin.value - props.minVal) / (props.maxVal - props.minVal)) * 100;
    });

    const rangeWidth = computed(() => {
      return ((currentMax.value - currentMin.value) / (props.maxVal - props.minVal)) * 100;
    });

    const emitChange = () => {
      emit('update:min', currentMin.value);
      emit('update:max', currentMax.value);
      emit('change'); // Emit a generic change event for parent to react
    };

    // Sync internal refs with prop changes from parent
    watch(() => props.min, (newMin) => {
      currentMin.value = newMin;
    });
    watch(() => props.max, (newMax) => {
      currentMax.value = newMax;
    });

    return {
      currentMin,
      currentMax,
      rangeLeft,
      rangeWidth,
      emitChange,
    };
  },
});
</script>

<style scoped>
.dual-range-slider {
  position: relative;
  width: 100%;
  height: 20px;
  display: flex;
  align-items: center;
}

.slider-track {
  position: absolute;
  width: 100%;
  height: 4px;
  background-color: #e0e0e0;
  border-radius: 2px;
}

.slider-range {
  position: absolute;
  height: 4px;
  background-color:#00fe01 ; /* primary color */
  border-radius: 2px;
}

.range-input {
  position: absolute;
  width: 100%;
  height: 20px;
  top: 0;
  background: none;
  -webkit-appearance: none;
  pointer-events: none; /* Default to none, then enable for thumbs */
}

.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background-color: #00fe01; /* primary color */
  border-radius: 50%;
  cursor: grab;
  pointer-events: all; /* Make thumbs interactive */
  margin-top: -3px; /* Adjust to center vertically */
}

.range-input::-moz-range-thumb {
  -moz-appearance: none;
  width: 20px;
  height: 20px;
  background-color: #4f46e5; /* primary color */
  border-radius: 50%;
  cursor: grab;
  pointer-events: all; /* Make thumbs interactive */
}

.range-input::-webkit-slider-runnable-track {
  background: none;
}

.range-input::-moz-range-track {
  background: none;
}

.range-min {
  z-index: 2;
}

.range-max {
  z-index: 2;
}
</style>