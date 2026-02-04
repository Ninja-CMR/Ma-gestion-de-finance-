<script setup lang="ts">
import { computed } from 'vue';
import { useFinanceStore } from '../stores/financeStore';

const props = defineProps<{
  mode: 'daily' | 'monthly';
  data: [string, number][];
}>();

const store = useFinanceStore();

const maxValue = computed(() => {
  if (props.data.length === 0) return 1;
  return Math.max(...props.data.map(d => d[1]));
});

const formatLabel = (label: string) => {
  if (props.mode === 'daily') {
    const date = new Date(label);
    return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
  } else {
    const parts = label.split('-');
    if (parts.length < 2) return label;
    const year = parts[0]!;
    const month = parts[1]!;
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('fr-FR', { month: 'short' });
  }
};
</script>

<template>
  <div class="w-full pt-4">
    <div v-if="data.length === 0" class="text-center py-10 opacity-30 font-black italic">
      Pas encore assez de données pour le graphique... 📈
    </div>
    
    <div v-else class="flex items-end justify-between gap-2 h-48 px-2 overflow-x-auto">
      <div 
        v-for="[label, value] in data" 
        :key="label"
        class="flex-1 flex flex-col items-center group cursor-help min-w-[50px]"
      >
        <!-- The Bar -->
        <div class="relative w-full flex flex-col items-center justify-end h-32">
          <!-- Tooltip -->
          <div class="absolute -top-8 px-2 py-1 bg-black text-white text-[10px] rounded shadow-brutal opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
            {{ store.formatCFA(value) }}
          </div>
          
          <div 
            class="w-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-700 ease-out"
            :class="mode === 'daily' ? 'bg-pastel-mint' : 'bg-pastel-yellow'"
            :style="{ height: `${(value / maxValue) * 100}%` }"
          ></div>
        </div>
        
        <!-- Label -->
        <span class="text-[10px] font-black uppercase mt-4 text-center leading-none">
          {{ formatLabel(label) }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Hide scrollbar but keep functionality */
.overflow-x-auto {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.overflow-x-auto::-webkit-scrollbar {
  display: none;
}
</style>
