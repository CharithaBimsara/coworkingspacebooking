<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-gray-50 to-white">
      <div class="max-w-7xl mx-auto container-padding py-16">
        <div class="text-center">
          <h1 class="text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-6">
            Get in Touch
          </h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Have a question, suggestion, or just want to say hello? We'd love to hear from you.
          </p>
        </div>
      </div>
    </section>

    <!-- Contact Form & Info -->
    <section class="section-padding">
      <div class="max-w-7xl mx-auto container-padding">
        <div class="grid lg:grid-cols-2 gap-16">
          <!-- Contact Form -->
          <div class="bg-white">
            <h2 class="text-2xl font-heading font-bold text-gray-900 mb-6">Send us a Message</h2>
            
            <form @submit.prevent="submitForm" class="space-y-6">
              <div class="grid sm:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input 
                    v-model="form.firstName" 
                    type="text" 
                    required
                    :class="['input-field', errors.firstName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '']"
                    placeholder="Your first name"
                  >
                  <p v-if="errors.firstName" class="mt-1 text-sm text-red-600">{{ errors.firstName }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input 
                    v-model="form.lastName" 
                    type="text" 
                    required
                    :class="['input-field', errors.lastName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '']"
                    placeholder="Your last name"
                  >
                  <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">{{ errors.lastName }}</p>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input 
                  v-model="form.email" 
                  type="email" 
                  required
                  :class="['input-field', errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '']"
                  placeholder="your@email.com"
                >
                <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input 
                  v-model="form.phone" 
                  type="tel" 
                  class="input-field"
                  placeholder="(555) 123-4567"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                <select 
                  v-model="form.subject" 
                  required
                  :class="['input-field', errors.subject ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '']"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="booking">Booking Support</option>
                  <option value="partnership">Space Partnership</option>
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing Question</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
                <p v-if="errors.subject" class="mt-1 text-sm text-red-600">{{ errors.subject }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                <textarea 
                  v-model="form.message" 
                  rows="6"
                  required
                  :class="['input-field resize-none', errors.message ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '']"
                  placeholder="Tell us more about your inquiry..."
                ></textarea>
                <p v-if="errors.message" class="mt-1 text-sm text-red-600">{{ errors.message }}</p>
              </div>
              
              <div class="flex items-start">
                <input 
                  v-model="form.agreeToContact" 
                  type="checkbox" 
                  required
                  class="rounded border-gray-300 text-primary focus:ring-primary mt-1"
                >
                <label class="ml-3 text-sm text-gray-600">
                  I agree to be contacted by WorkSpace regarding my inquiry. *
                </label>
              </div>
              
              <button 
                type="submit" 
                :disabled="submitting"
                class="w-full btn-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="submitting" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending Message...
                </span>
                <span v-else>Send Message</span>
              </button>
            </form>
            
            <!-- Success Message -->
            <div v-if="showSuccess" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <p class="text-green-800 font-medium">Thank you for your message!</p>
              </div>
              <p class="text-green-700 text-sm mt-1">We'll get back to you within 24 hours.</p>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="space-y-8">
            <!-- Quick Contact -->
            <div>
              <h3 class="text-xl font-semibold text-gray-900 mb-6">Get in Touch</h3>
              <div class="space-y-6">
                <div class="flex items-start">
                  <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900 mb-1">Email Us</h4>
                    <p class="text-gray-600 mb-2">Get a response within 24 hours</p>
                    <a href="mailto:hello@workspace.com" class="text-primary hover:text-primary/80 font-medium">
                      hello@workspace.com
                    </a>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900 mb-1">Call Us</h4>
                    <p class="text-gray-600 mb-2">Mon-Fri, 9AM-6PM PST</p>
                    <a href="tel:+15551234567" class="text-primary hover:text-primary/80 font-medium">
                      (555) 123-4567
                    </a>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900 mb-1">Live Chat</h4>
                    <p class="text-gray-600 mb-2">Available during business hours</p>
                    <button class="text-primary hover:text-primary/80 font-medium">
                      Start Chat
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Office Locations -->
            <div>
              <h3 class="text-xl font-semibold text-gray-900 mb-6">Our Offices</h3>
              <div class="space-y-6">
                <div>
                  <h4 class="font-semibold text-gray-900 mb-2">San Francisco HQ</h4>
                  <p class="text-gray-600 leading-relaxed">
                    123 Innovation Street<br>
                    San Francisco, CA 94105<br>
                    United States
                  </p>
                </div>
                
                <div>
                  <h4 class="font-semibold text-gray-900 mb-2">New York Office</h4>
                  <p class="text-gray-600 leading-relaxed">
                    456 Broadway Avenue<br>
                    New York, NY 10013<br>
                    United States
                  </p>
                </div>
                
                <div>
                  <h4 class="font-semibold text-gray-900 mb-2">London Office</h4>
                  <p class="text-gray-600 leading-relaxed">
                    789 Tech Square<br>
                    London, EC2A 4DP<br>
                    United Kingdom
                  </p>
                </div>
              </div>
            </div>

            <!-- Support Hours -->
            <div class="bg-gray-50 p-6 rounded-xl">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Support Hours</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Monday - Friday</span>
                  <span class="font-medium text-gray-900">9:00 AM - 6:00 PM PST</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Saturday</span>
                  <span class="font-medium text-gray-900">10:00 AM - 4:00 PM PST</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Sunday</span>
                  <span class="font-medium text-gray-900">Closed</span>
                </div>
              </div>
              <div class="mt-4 p-3 bg-blue-50 rounded-lg">
                <p class="text-sm text-blue-800">
                  <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  For urgent issues outside business hours, please email us and we'll respond as soon as possible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="section-padding bg-gray-50">
      <div class="max-w-4xl mx-auto container-padding">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-heading font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p class="text-xl text-gray-600">
            Quick answers to common questions
          </p>
        </div>

        <div class="space-y-6">
          <div v-for="(faq, index) in faqs" :key="index" class="bg-white rounded-xl p-6 shadow-card">
            <button 
              @click="toggleFaq(index)"
              class="flex items-center justify-between w-full text-left"
            >
              <h3 class="text-lg font-semibold text-gray-900 pr-4">{{ faq.question }}</h3>
              <svg 
                :class="['w-5 h-5 text-gray-500 transition-transform duration-200', openFaq === index ? 'rotate-180' : '']" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div v-if="openFaq === index" class="mt-4 text-gray-600 leading-relaxed">
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Partner With Us -->
    <section class="section-padding">
      <div class="max-w-7xl mx-auto container-padding">
        <div class="bg-gradient-to-br from-primary to-primary rounded-2xl p-8 lg:p-12 text-white text-center">
          <h2 class="text-3xl lg:text-4xl font-heading font-bold mb-4">
            Partner With WorkSpace
          </h2>
          <p class="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Own a coworking space? Join our network and reach thousands of professionals looking for their perfect workspace.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button class="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Become a Partner
            </button>
            <button class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Form state
const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  agreeToContact: false
})

const errors = ref({
  firstName: '',
  lastName: '',
  email: '',
  subject: '',
  message: ''
})

const submitting = ref(false)
const showSuccess = ref(false)

// FAQ state
const openFaq = ref<number | null>(null)

// FAQ data
const faqs = ref([
  {
    question: "How do I book a workspace?",
    answer: "Simply search for spaces in your desired location, select your preferred space and time slot, provide your details, and complete the booking with secure payment. You'll receive a confirmation email with all the details you need."
  },
  {
    question: "Can I cancel or modify my booking?",
    answer: "Yes! You can cancel free of charge up to 24 hours before your booking. For modifications, please contact us or the space directly. Some spaces may allow you to modify your booking through our platform."
  },
  {
    question: "What's included in a workspace booking?",
    answer: "All bookings include high-speed WiFi, access to common areas, and basic amenities like coffee and tea. Specific amenities vary by space and are clearly listed on each space's detail page."
  },
  {
    question: "Do I need to bring anything?",
    answer: "Just bring your laptop and any personal items you need for work. All spaces provide the basic furniture and amenities. Some spaces may offer additional services like printing or lockers for an extra fee."
  },
  {
    question: "How do I access the space on my booking day?",
    answer: "You'll receive a QR code or access instructions via email before your booking. Most spaces have reception staff during business hours, or you can use your access code for 24/7 spaces."
  },
  {
    question: "What if I have issues with my booking?",
    answer: "Contact our support team immediately via phone, email, or live chat. We're here to help resolve any issues quickly and ensure you have a great workspace experience."
  }
])

// Methods
const toggleFaq = (index: number) => {
  openFaq.value = openFaq.value === index ? null : index
}

const validateForm = () => {
  // Clear previous errors
  Object.keys(errors.value).forEach(key => {
    errors.value[key as keyof typeof errors.value] = ''
  })
  
  let isValid = true
  
  if (!form.value.firstName.trim()) {
    errors.value.firstName = 'First name is required'
    isValid = false
  }
  
  if (!form.value.lastName.trim()) {
    errors.value.lastName = 'Last name is required'
    isValid = false
  }
  
  if (!form.value.email.trim()) {
    errors.value.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Please enter a valid email address'
    isValid = false
  }
  
  if (!form.value.subject) {
    errors.value.subject = 'Please select a subject'
    isValid = false
  }
  
  if (!form.value.message.trim()) {
    errors.value.message = 'Message is required'
    isValid = false
  } else if (form.value.message.trim().length < 10) {
    errors.value.message = 'Message must be at least 10 characters long'
    isValid = false
  }
  
  return isValid
}

const submitForm = async () => {
  if (!validateForm()) return
  
  submitting.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Show success message
    showSuccess.value = true
    
    // Reset form
    form.value = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      agreeToContact: false
    }
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      showSuccess.value = false
    }, 5000)
    
  } catch (error) {
    alert('There was an error sending your message. Please try again.')
  } finally {
    submitting.value = false
  }
}
</script>
