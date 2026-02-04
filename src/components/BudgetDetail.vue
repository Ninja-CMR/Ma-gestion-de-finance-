<script setup lang="ts">
import { computed } from 'vue';
import { useFinanceStore, type Budget } from '../stores/financeStore';
import { X, TrendingDown, Clock, Info, Edit3, Trash2 } from 'lucide-vue-next';

const props = defineProps<{
  budget: Budget;
}>();

const emit = defineEmits(['close', 'edit', 'delete']);

const store = useFinanceStore();

const relatedTransactions = computed(() => {
  return store.transactions
    .filter(t => t.category === props.budget.category && t.type === 'expense')
    .slice(0, 5); // Just recent ones
});

const getProgress = (budget: any) => {
  return Math.min((budget.current / budget.limit) * 100, 100);
};
</script>

<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="card-brutal bg-cream w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div class="flex justify-between items-start mb-8">
        <div class="flex items-center gap-3">
          <div :class="['w-10 h-10 border-2 border-black rounded-neo flex items-center justify-center shadow-brutal bg-white']">
            <TrendingDown :size="20" />
          </div>
          <div>
            <h2 class="text-3xl font-black">{{ budget.category }}</h2>
            <div class="flex gap-2 mt-1">
              <button @click="$emit('edit', $event)" class="text-xs font-black uppercase text-blue-600 hover:underline flex items-center gap-1">
                <Edit3 :size="12" /> Modifier
              </button>
              <button @click="$emit('delete', $event)" class="text-xs font-black uppercase text-red-600 hover:underline flex items-center gap-1">
                <Trash2 :size="12" /> Supprimer
              </button>
            </div>
          </div>
        </div>
        <button @click="$emit('close')" class="hover:scale-110 transition-transform p-1">
          <X :size="28" />
        </button>
      </div>

      <div class="space-y-8">
        <!-- Status Card -->
        <div class="card-brutal bg-white p-4 flex justify-between items-center border-dashed">
          <div>
            <p class="text-sm font-black text-gray-400 uppercase">Utilisé / Limite</p>
            <p class="text-2xl font-black">
              {{ store.formatCFA(budget.current) }} / <span class="opacity-50 text-xl">{{ store.formatCFA(budget.limit) }}</span>
            </p>
          </div>
          <div class="w-16 h-16 rounded-full border-4 border-black flex items-center justify-center font-black text-lg shadow-brutal" :class="budget.color">
            {{ Math.round(getProgress(budget)) }}%
          </div>
        </div>

        <!-- Description -->
        <div class="flex gap-4">
          <Info :size="24" class="shrink-0 text-pastel-blue" />
          <div>
            <h4 class="font-black text-sm uppercase mb-1">À propos de ce budget</h4>
            <p class="text-sm opacity-70">{{ budget.description }}</p>
          </div>
        </div>

        <!-- Recent Transactions -->
        <div>
          <div class="flex items-center gap-2 mb-4">
            <Clock :size="18" class="text-pastel-pink" />
            <h4 class="font-black text-sm uppercase">Dernières dépenses</h4>
          </div>
          <div class="space-y-3">
            <div v-for="transaction in relatedTransactions" :key="transaction.id">
              <!-- Inline mini card to save space -->
              <div class="flex justify-between items-center p-3 border-2 border-black rounded-neo bg-white shadow-brutal-hover text-sm">
                <span class="font-bold">{{ transaction.label }}</span>
                <span class="font-black">{{ store.formatCFA(transaction.amount) }}</span>
              </div>
            </div>
            <div v-if="relatedTransactions.length === 0" class="text-center py-4 opacity-30 text-xs italic">
              Aucune dépense enregistrée ici.
            </div>
          </div>
        </div>

        <button @click="$emit('close')" class="btn-brutal w-full bg-black text-white py-4 text-center">
          Fermer 🌸
        </button>
      </div>
    </div>
  </div>
</template>
