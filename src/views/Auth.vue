<template>
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 font-sans -mt-8">
        <div
            class="relative w-full max-w-4xl h-[600px] md:h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            <!-- Form Container -->
            <div class="absolute top-0 left-0 h-full w-full md:w-1/2 transition-all duration-700 ease-in-out z-30"
                :style="{ 
                  transform: currentView === 'login' || currentView === 'reset-password' ? 'translateX(0)' : 
                            currentView === 'register' ? 'translateX(100%)' : 
                            'translateX(0)'
                }">
                <div class="h-full w-full relative overflow-y-auto">
                    <transition 
                        name="fade-slide-up" 
                        mode="out-in"
                    >
                        <div v-if="currentView === 'login'" key="login" class="absolute inset-0 p-6 md:p-8 lg:p-12 flex flex-col justify-center text-gray-800 dark:text-gray-200">
                            <Login @switch-form="switchView" @forgot-password="switchView('reset-password')" />
                        </div>
                        <div v-else-if="currentView === 'register'" key="register" class="absolute inset-0 p-6 md:p-8 lg:p-12 flex flex-col justify-center text-gray-800 dark:text-gray-200">
                            <Register @switch-form="switchView" />
                        </div>
                        <div v-else-if="currentView === 'reset-password'" key="reset-password" class="absolute inset-0 p-6 md:p-8 lg:p-12 flex flex-col justify-center text-gray-800 dark:text-gray-200">
                            <PasswordReset @back-to-login="switchView('login')" />
                        </div>
                    </transition>
                </div>
            </div>

            <!-- Mobile Navigation -->
            <div class="md:hidden fixed bottom-4 w-full flex justify-center z-50">
                <div class="bg-white dark:bg-gray-700 rounded-full shadow-lg px-2 py-1.5 flex space-x-1">
                    <button 
                        @click="switchView('login')" 
                        class="px-4 py-1.5 rounded-full transition-all duration-300" 
                        :class="currentView === 'login' ? 'bg-primary text-white transform scale-105' : 'text-gray-700 dark:text-gray-200'">
                        Login
                    </button>
                    <button 
                        @click="switchView('register')" 
                        class="px-4 py-1.5 rounded-full transition-all duration-300" 
                        :class="currentView === 'register' ? 'bg-primary text-white transform scale-105' : 'text-gray-700 dark:text-gray-200'">
                        Register
                    </button>
                    <button 
                        @click="switchView('reset-password')" 
                        class="px-4 py-1.5 rounded-full transition-all duration-300" 
                        :class="currentView === 'reset-password' ? 'bg-primary text-white transform scale-105' : 'text-gray-700 dark:text-gray-200'">
                        Reset
                    </button>
                </div>
            </div>

            <!-- Overlay Container -->
            <div class="hidden md:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-40"
                :style="{
                  transform: currentView === 'login' || currentView === 'reset-password' ? 'translateX(0)' : 
                            currentView === 'register' ? 'translateX(-100%)' : 
                            'translateX(0)'
                }">
                <div
                    class="bg-gradient-to-br from-primary to-secondary h-full text-white relative transition-transform duration-700 ease-in-out">
                    <transition name="fade-scale" mode="out-in">
                        <!-- Sign In Overlay -->
                        <div v-if="currentView === 'login'" key="login-overlay" class="absolute top-0 h-full w-full flex flex-col items-center justify-center text-center p-10">
                            <div class="overlay-content">
                                <h1 class="text-3xl font-bold mb-3">Welcome Back!</h1>
                                <p class="text-base mb-6">To keep connected with us please login with your personal info</p>
                                <button @click.prevent.stop="switchView('register')" class="btn-secondary-outline z-50">
                                    Sign Up
                                </button>
                            </div>
                        </div>

                        <!-- Sign Up Overlay -->
                        <div v-else-if="currentView === 'register'" key="register-overlay" class="absolute top-0 h-full w-full flex flex-col items-center justify-center text-center p-10">
                            <div class="overlay-content">
                                <h1 class="text-3xl font-bold mb-3">Hello, Friend!</h1>
                                <p class="text-base mb-6">Enter your personal details and start your journey with us</p>
                                <button @click.prevent.stop="switchView('login')" class="btn-secondary-outline z-50">
                                    Sign In
                                </button>
                            </div>
                        </div>

                        <!-- Password Reset Overlay -->
                        <div v-else-if="currentView === 'reset-password'" key="reset-overlay" class="absolute top-0 h-full w-full flex flex-col items-center justify-center text-center p-10">
                            <div class="overlay-content">
                                <h1 class="text-3xl font-bold mb-3">Reset Password</h1>
                                <p class="text-base mb-6">Let us help you recover your account</p>
                                <button @click.prevent.stop="switchView('login')" class="btn-secondary-outline z-50">
                                    Back to Sign In
                                </button>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Login from './Login.vue';
import Register from './Register.vue';
import PasswordReset from './PasswordReset.vue';

const route = useRoute();
const router = useRouter();
const isRegister = ref(false);

type ViewType = 'login' | 'register' | 'reset-password';
const currentView = ref<ViewType>('login');

onMounted(() => {
    if (route.path.includes('/register')) {
        currentView.value = 'register';
    } else if (route.path.includes('/reset-password')) {
        currentView.value = 'reset-password';
    } else {
        currentView.value = 'login';
    }
});

watch(() => route.path, (newPath) => {
    if (newPath.includes('/register')) {
        currentView.value = 'register';
    } else if (newPath.includes('/reset-password')) {
        currentView.value = 'reset-password';
    } else {
        currentView.value = 'login';
    }
});

const switchView = (view: ViewType) => {
    if (view === 'register') {
        router.push('/register');
    } else if (view === 'reset-password') {
        router.push('/reset-password');
    } else {
        router.push('/login');
    }
    currentView.value = view;
};
</script>

<style scoped>
.btn-secondary-outline {
    background-color: transparent;
    color: white;
    padding: 0.75rem 2.5rem;
    border-radius: 2rem;
    font-weight: 600;
    transition: all 0.2s ease-in-out;
    border: 2px solid white;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.btn-secondary-outline:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
}

.btn-secondary-outline:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
}

/* Form transitions */
.fade-slide-up-enter-active,
.fade-slide-up-leave-active {
    transition: all 0.4s ease;
}

.fade-slide-up-enter-from {
    opacity: 0;
    transform: translateY(20px);
}

.fade-slide-up-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

/* Overlay transitions */
.fade-scale-enter-active,
.fade-scale-leave-active {
    transition: all 0.5s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
    opacity: 0;
    transform: scale(0.95);
}

.overlay-content {
    animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 768px) {
    .min-h-screen {
        padding-bottom: 4rem;
    }
}
</style>
