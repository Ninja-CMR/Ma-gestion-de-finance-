<script setup lang="ts">
import { ref } from 'vue';
import { useFinanceStore } from '../stores/financeStore';
import BalanceDisplay from '../components/BalanceDisplay.vue';
import TransactionCard from '../components/TransactionCard.vue';
import ProverbCard from '../components/ProverbCard.vue';
import AddTransactionModal from '../components/AddTransactionModal.vue';
import { Plus, TrendingDown, TrendingUp } from 'lucide-vue-next';

const store = useFinanceStore();
const isModalOpen = ref(false);
const modalMode = ref<'expense' | 'income'>('expense');

const openModal = (mode: 'expense' | 'income') => {
  modalMode.value = mode;
  isModalOpen.value = true;
};

const handleAdd = (data: any) => {
  store.addTransaction(data);
  isModalOpen.value = false;
};
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-8 pb-20">
    <!-- Proverbs Section -->
    <ProverbCard v-if="store.proverbOfTheDay" v-bind="store.proverbOfTheDay" />

    <!-- Balance Hero -->
    <BalanceDisplay :balance="store.totalBalance" />

    <!-- Summary Stats Quick View -->
    <div class="grid grid-cols-2 gap-4">
      <div class="card-brutal bg-pastel-mint py-4 flex flex-col items-center justify-center cursor-pointer hover:translate-y-1 active:translate-y-2 transition-transform" @click="openModal('income')">
        <div class="flex items-center gap-2 text-green-700 mb-1">
          <TrendingUp :size="16" />
          <span class="text-xs font-black uppercase">Entrées</span>
        </div>
        <p class="text-xl font-black">{{ store.formatCFA(store.totalIncome) }}</p>
      </div>
      <div class="card-brutal bg-pastel-pink py-4 flex flex-col items-center justify-center cursor-pointer hover:translate-y-1 active:translate-y-2 transition-transform" @click="openModal('expense')">
        <div class="flex items-center gap-2 text-red-700 mb-1">
          <TrendingDown :size="16" />
          <span class="text-xs font-black uppercase">Sorties</span>
        </div>
        <p class="text-xl font-black">{{ store.formatCFA(store.totalExpenses) }}</p>
      </div>
    </div>

    <!-- Transactions Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-3xl font-black">Historique</h2>
      <div class="flex gap-2">
        <button @click="openModal('income')" class="btn-brutal bg-pastel-mint px-3 py-2 flex items-center gap-2 text-sm">
          <Plus :size="16" />
          Revenu
        </button>
        <button @click="openModal('expense')" class="btn-brutal bg-pastel-pink px-3 py-2 flex items-center gap-2 text-sm">
          <Plus :size="16" />
          Dépense
        </button>
      </div>
    </div>

    <!-- Transactions List -->
    <div class="space-y-4">
      <div v-if="store.transactions.length === 0" class="text-center py-10 opacity-50 font-bold">
        Aucune transaction pour le moment... 🌸
      </div>
      <TransactionCard
        v-for="transaction in store.transactions"
        :key="transaction.id"
        v-bind="transaction"
        @delete="store.removeTransaction"
      />
    </div>

    <!-- Add Transaction Modal -->
    <AddTransactionModal 
      v-if="isModalOpen" 
      :initial-type="modalMode"
      @close="isModalOpen = false"
      @add="handleAdd"
    />
  </div>
</template>
