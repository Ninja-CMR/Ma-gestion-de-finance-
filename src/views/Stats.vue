<script setup lang="ts">
import { computed } from 'vue';
import { useFinanceStore } from '../stores/financeStore';
import { BarChart, PieChart, ArrowDownRight, Calendar } from 'lucide-vue-next';
import Charts from '../components/Charts.vue';

const store = useFinanceStore();

const expenseByCategory = computed(() => {
  const totals: Record<string, number> = {};
  store.transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      totals[t.category] = (totals[t.category] || 0) + t.amount;
    });
  return Object.entries(totals).sort((a, b) => b[1] - a[1]);
});
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-8 pb-20">
    <div class="flex items-center gap-4 mb-8">
      <div class="w-16 h-16 bg-pastel-pink border-2 border-black shadow-brutal flex items-center justify-center rounded-neo">
        <BarChart :size="32" />
      </div>
      <h1 class="text-4xl font-black">Statistiques</h1>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="card-brutal bg-white">
        <p class="text-sm font-black uppercase text-gray-500 mb-2">Taux d'Épargne</p>
        <div class="flex items-center justify-between">
          <h2 class="text-3xl font-black">
            {{ store.totalIncome > 0 ? Math.round(((store.totalIncome - store.totalExpenses) / store.totalIncome) * 100) : 0 }}%
          </h2>
          <PieChart :size="24" class="text-pastel-blue" />
        </div>
      </div>
      <div class="card-brutal bg-white">
        <p class="text-sm font-black uppercase text-gray-500 mb-2">Dépense Moyenne</p>
        <div class="flex items-center justify-between">
          <h2 class="text-3xl font-black">
            {{ store.formatCFA(store.transactions.filter(t => t.type==='expense').length > 0 ? store.totalExpenses / store.transactions.filter(t => t.type==='expense').length : 0) }}
          </h2>
          <ArrowDownRight :size="24" class="text-pastel-pink" />
        </div>
      </div>
    </div>

    <!-- Graphical Representations -->
    <div class="space-y-8">
      <div class="card-brutal bg-white">
        <div class="flex items-center gap-2 mb-6">
          <Calendar :size="20" class="text-pastel-mint" />
          <h2 class="text-xl font-black">Dépenses par Jour</h2>
        </div>
        <Charts mode="daily" :data="store.expensesByDate.daily" />
      </div>

      <div class="card-brutal bg-white">
        <div class="flex items-center gap-2 mb-6">
          <Calendar :size="20" class="text-pastel-yellow" />
          <h2 class="text-xl font-black">Dépenses par Mois</h2>
        </div>
        <Charts mode="monthly" :data="store.expensesByDate.monthly" />
      </div>
    </div>

    <!-- Category Breakdown -->
    <div class="card-brutal bg-white">
      <h2 class="text-xl font-black mb-6">Dépenses par Catégorie</h2>
      <div class="space-y-6">
        <div v-for="[cat, amt] in expenseByCategory" :key="cat" class="space-y-2">
          <div class="flex justify-between items-end">
            <span class="font-bold flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-pastel-pink border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"></span>
              {{ cat }}
            </span>
            <span class="font-black">{{ store.formatCFA(amt) }}</span>
          </div>
          <div class="h-4 w-full bg-gray-100 border-2 border-black rounded-full overflow-hidden">
            <div 
              class="h-full bg-pastel-pink border-r-2 border-black transition-all duration-500"
              :style="{ width: `${(amt / store.totalExpenses) * 100}%` }"
            ></div>
          </div>
        </div>
        <div v-if="expenseByCategory.length === 0" class="text-center py-8 opacity-50 font-bold">
          Aucune donnée disponible... 🌸
        </div>
      </div>
    </div>
  </div>
</template>
