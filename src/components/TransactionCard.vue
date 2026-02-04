<script setup lang="ts">
import { computed } from 'vue';
import { Trash2, ShoppingBag, Coffee, Utensils, Zap, Heart, MoreHorizontal } from 'lucide-vue-next';
import { useFinanceStore } from '../stores/financeStore';

const store = useFinanceStore();

const props = defineProps<{
  id: string;
  label: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
}>();

defineEmits(['delete']);

const formattedAmount = computed(() => {
  return store.formatCFA(props.amount);
});

const formattedDate = computed(() => {
  return new Date(props.date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  });
});

const icon = computed(() => {
  switch (props.category.toLowerCase()) {
    case 'food': return Utensils;
    case 'coffee': return Coffee;
    case 'shopping': return ShoppingBag;
    case 'bills': return Zap;
    case 'health': return Heart;
    default: return MoreHorizontal;
  }
});

const bgColor = computed(() => {
  if (props.type === 'income') return 'bg-pastel-mint';
  switch (props.category.toLowerCase()) {
    case 'food': return 'bg-pastel-pink';
    case 'coffee': return 'bg-pastel-yellow';
    case 'shopping': return 'bg-pastel-blue';
    default: return 'bg-white';
  }
});
</script>

<template>
  <div class="card-brutal group flex items-center gap-4 transition-transform hover:-translate-y-1" :class="bgColor">
    <div class="w-12 h-12 border-2 border-black rounded-neo flex items-center justify-center bg-white shadow-brutal">
      <component :is="icon" :size="24" />
    </div>
    
    <div class="flex-1">
      <h3 class="font-bold text-lg leading-tight">{{ label }}</h3>
      <p class="text-sm opacity-70">{{ formattedDate }} • {{ category }}</p>
    </div>

    <div class="text-right flex items-center gap-4">
      <p class="font-bold text-xl" :class="type === 'income' ? 'text-green-600' : 'text-black'">
        {{ type === 'income' ? '+' : '-' }}{{ formattedAmount }}
      </p>
      <button 
        @click="$emit('delete', props.id)"
        class="opacity-0 group-hover:opacity-100 p-2 hover:bg-black/5 rounded-neo transition-all"
        title="Supprimer"
      >
        <Trash2 :size="18" class="text-red-500" />
      </button>
    </div>
  </div>
</template>
