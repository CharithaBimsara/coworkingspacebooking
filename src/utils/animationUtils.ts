/**
 * Animation Utilities for SpaceBooking
 * Helper functions to work with the animation library
 */

// For detecting elements in viewport to trigger scroll animations
export function initScrollAnimations(): {
  refreshAnimations: () => void;
  destroyAnimations: () => void;
} {
  const animatedElements = document.querySelectorAll<HTMLElement>(
    '.scroll-fade-up, .scroll-fade-in, .scroll-scale-up'
  );
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add('in-view');
          // Once the animation has played, we can stop observing
          // Uncomment below if you want the animation to play only once
          // observer.unobserve(entry.target);
        } else {
          // Optional: remove the class when out of view for replay
          // (entry.target as HTMLElement).classList.remove('in-view');
        }
      });
    },
    {
      root: null, // viewport
      threshold: 0.1, // trigger when 10% visible
      rootMargin: '0px' // no margin
    }
  );
  
  animatedElements.forEach(el => observer.observe(el));
  
  return {
    refreshAnimations() {
      animatedElements.forEach(el => {
        el.classList.remove('in-view');
        observer.unobserve(el);
        observer.observe(el);
      });
    },
    destroyAnimations() {
      animatedElements.forEach(el => observer.unobserve(el));
    }
  };
}

// Staggered animation for multiple elements
export function staggerAnimations(selector: string, delayIncrement = 100, maxDelay = 1000): void {
  const elements = document.querySelectorAll<HTMLElement>(selector);
  elements.forEach((el, index) => {
    const delay = Math.min(index * delayIncrement, maxDelay);
    el.style.animationDelay = `${delay}ms`;
    el.style.opacity = '0';
    
    // Force a reflow to ensure the animation takes effect
    void el.offsetWidth;
    
    // Apply the animation class
    el.classList.add('stagger-item');
  });
}

// Type for hover animation
type HoverAnimationType = 'float' | 'glow' | 'pulse' | 'wobble';

// Add hover animations dynamically
export function addHoverAnimation(element: HTMLElement, animationType: HoverAnimationType): void {
  if (!element) return;
  
  const validTypes: HoverAnimationType[] = ['float', 'glow', 'pulse', 'wobble'];
  
  if (!validTypes.includes(animationType)) {
    console.error(`Invalid animation type: ${animationType}`);
    return;
  }
  
  element.classList.add(`hover-${animationType}`);
}

// Interface for blob creation options
interface BlobOptions {
  parent: HTMLElement;
  size?: string;
  color?: string;
  animationDelay?: number;
}

// Create and animate decorative blobs
export function createAnimatedBlob({
  parent,
  size = '200px',
  color = 'rgba(0, 254, 1, 0.1)',
  animationDelay = 0
}: BlobOptions): HTMLElement {
  const blob = document.createElement('div');
  blob.classList.add('animate-blob');
  blob.style.position = 'absolute';
  blob.style.width = size;
  blob.style.height = size;
  blob.style.backgroundColor = color;
  blob.style.borderRadius = '60% 40% 70% 30% / 40% 50% 60% 50%';
  blob.style.animationDelay = `${animationDelay}s`;
  blob.style.opacity = '0.7';
  blob.style.zIndex = '0';
  
  // Randomize position
  blob.style.top = `${Math.random() * 80}%`;
  blob.style.left = `${Math.random() * 80}%`;
  
  parent.appendChild(blob);
  return blob;
}

// Type for attention animations
type AttentionAnimationType = 'shake' | 'tada' | 'heartbeat' | 'pulse';

// Trigger a quick attention animation
export function triggerAttention(element: HTMLElement, animationType: AttentionAnimationType = 'pulse'): void {
  if (!element) return;
  
  const validTypes: AttentionAnimationType[] = ['shake', 'tada', 'heartbeat', 'pulse'];
  
  if (!validTypes.includes(animationType)) {
    console.error(`Invalid attention animation type: ${animationType}`);
    return;
  }
  
  // Remove any existing animation classes
  element.classList.remove('animate-shake', 'animate-tada', 'animate-heartbeat');
  
  // Force a reflow to ensure the animation takes effect
  void element.offsetWidth;
  
  // Apply the animation class
  element.classList.add(`animate-${animationType}`);
  
  // Remove the animation class after it completes
  const animationDuration = 1000; // ms
  setTimeout(() => {
    element.classList.remove(`animate-${animationType}`);
  }, animationDuration);
}

// Handle loading state animations
export const loadingAnimations = {
  addLoadingSpinner(element: HTMLElement, size = '24px'): HTMLElement | undefined {
    if (!element) return;
    
    const spinner = document.createElement('div');
    spinner.classList.add('loading-spinner');
    spinner.style.width = size;
    spinner.style.height = size;
    
    // Store original content
    element.dataset.originalContent = element.innerHTML;
    element.innerHTML = '';
    element.appendChild(spinner);
    element.classList.add('is-loading');
    
    return spinner;
  },
  
  removeLoadingSpinner(element: HTMLElement): void {
    if (!element || !element.classList.contains('is-loading')) return;
    
    // Restore original content
    element.innerHTML = element.dataset.originalContent || '';
    element.classList.remove('is-loading');
  },
  
  addLoadingDots(element: HTMLElement): void {
    if (!element) return;
    
    // Store original content
    element.dataset.originalContent = element.innerHTML;
    element.innerHTML += '<span class="loading-dots"></span>';
    element.classList.add('is-loading');
  },
  
  removeLoadingDots(element: HTMLElement): void {
    if (!element || !element.classList.contains('is-loading')) return;
    
    const dots = element.querySelector('.loading-dots');
    if (dots) dots.remove();
    
    element.classList.remove('is-loading');
  }
};
