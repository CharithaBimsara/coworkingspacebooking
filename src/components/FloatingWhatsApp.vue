<template>
  <div
    class="whatsapp-floating-button"
    :class="{ 'expanded': isExpanded }"
    @mouseover="isExpanded = true"
    @mouseleave="isExpanded = false"
    @click="openWhatsApp"
  >
    <div class="whatsapp-icon">
      <font-awesome-icon :icon="['fab', 'whatsapp']" />
    </div>
    <div class="whatsapp-text" v-if="isExpanded">
      {{ message }}
    </div>
    <div class="pulse-animation"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Props for customization
interface Props {
  phoneNumber: string; // WhatsApp phone number with country code
  message?: string; // Default message to display in the bubble
  defaultText?: string; // Text to pre-fill in WhatsApp
}

const props = withDefaults(defineProps<Props>(), {
  phoneNumber: '+94785366196', // Default phone number (replace with your actual support number)
  message: 'Chat with us!',
  defaultText: 'Hello! I have a question about co-working space booking.'
});

const isExpanded = ref(false);

// Function to open WhatsApp
const openWhatsApp = () => {
  const formattedPhone = props.phoneNumber.replace(/\D/g, ''); // Remove non-digit characters
  const encodedText = encodeURIComponent(props.defaultText);
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedText}`;
  
  // Open WhatsApp in a new tab
  window.open(whatsappUrl, '_blank');
};
</script>

<style scoped>
.whatsapp-floating-button {
  position: fixed;
  bottom: 20px; /* Moved to bottom, same as FloatingBookingSummary */
  right: 20px; /* Aligned with FloatingBookingSummary (20px) exactly */
  z-index: 998; /* Set to 998 to be below FloatingBookingSummary's z-index of 1000 */
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 50px;
  box-shadow: 0 3px 15px rgba(37, 211, 102, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
  background-color: #25D366;
  color: white;
}

.whatsapp-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 54px; /* Matched with FloatingBookingSummary size (54px) */
  height: 54px; /* Matched with FloatingBookingSummary size (54px) */
  font-size: 28px; /* Reduced font size proportionally */
  border-radius: 50%;
  background-color: #25D366;
  border: 2px solid rgba(255, 255, 255, 0.8); /* Added border to match FloatingBookingSummary */
}

.whatsapp-text {
  padding-right: 20px;
  padding-left: 5px;
  white-space: nowrap;
  font-weight: 500;
  font-size: 14px;
  max-width: 0;
  overflow: hidden;
  transition: max-width 0.3s ease, padding 0.3s ease;
}

.whatsapp-floating-button.expanded {
  border-radius: 50px;
}

.whatsapp-floating-button.expanded .whatsapp-text {
  max-width: 200px;
}

.pulse-animation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  border: 2px solid #25D366;
  animation: pulse 2s infinite;
  pointer-events: none;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  70% {
    transform: scale(1.2);
    opacity: 0;
  }
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
}

/* Dark mode support */
.dark .whatsapp-floating-button {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
}

/* Responsive design */
@media (max-width: 768px) {
  .whatsapp-floating-button {
    bottom: 15px; /* Position at bottom on mobile */
    right: 15px; /* Keep consistent with FloatingBookingSummary on mobile */
  }

  .whatsapp-icon {
    width: 50px;
    height: 50px;
    font-size: 28px;
  }
}
</style>