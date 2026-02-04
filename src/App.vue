<script setup lang="ts">
import { LayoutDashboard, BarChart3, Wallet } from 'lucide-vue-next';
</script>

<template>
  <div class="min-h-screen p-4 md:p-8">
    <nav class="max-w-2xl mx-auto mb-12 flex justify-between gap-4">
      <router-link 
        to="/" 
        class="flex-1 btn-brutal bg-white flex justify-center items-center gap-2"
        active-class="bg-pastel-yellow"
      >
        <LayoutDashboard :size="20" />
        <span class="hidden md:inline">Dashboard</span>
      </router-link>
      
      <router-link 
        to="/stats" 
        class="flex-1 btn-brutal bg-white flex justify-center items-center gap-2"
        active-class="bg-pastel-pink"
      >
        <BarChart3 :size="20" />
        <span class="hidden md:inline">Stats</span>
      </router-link>

      <router-link 
        to="/budget" 
        class="flex-1 btn-brutal bg-white flex justify-center items-center gap-2"
        active-class="bg-pastel-blue"
      >
        <Wallet :size="20" />
        <span class="hidden md:inline">Budget</span>
      </router-link>
    </nav>

    <main class="max-w-4xl mx-auto">
      <router-view v-slot="{ Component }">
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform translate-y-4 opacity-0"
          enter-to-class="transform translate-y-0 opacity-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="transform translate-y-0 opacity-100"
          leave-to-class="transform translate-y-4 opacity-0"
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="mt-20 text-center text-sm font-bold opacity-50">
      Fait avec ❤️ pour les étudiants Kawaii
    </footer>
  </div>
</template>

<style>
.router-link-active {
  @apply shadow-brutal-hover translate-x-[2px] translate-y-[2px];
}
</style>
