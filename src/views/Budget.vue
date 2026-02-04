<script setup lang="ts">
import { ref } from 'vue';
import { useFinanceStore, type Budget } from '../stores/financeStore';
import { Wallet, Bell, ShieldPlus, ChevronRight, Edit3, Trash2 } from 'lucide-vue-next';
import BudgetDetail from '../components/BudgetDetail.vue';
import BudgetModal from '../components/BudgetModal.vue';

const store = useFinanceStore();
const selectedBudget = ref<Budget | null>(null);
const isModalOpen = ref(false);
const editingBudget = ref<Budget | undefined>(undefined);

const getProgress = (budget: any) => {
  return Math.min((budget.current / budget.limit) * 100, 100);
};

const openCreateModal = () => {
  editingBudget.value = undefined;
  isModalOpen.value = true;
};

const openEditModal = (budget: Budget, event: Event) => {
  event.stopPropagation();
  editingBudget.value = budget;
  isModalOpen.value = true;
};

const handleSave = (data: any) => {
  if (editingBudget.value) {
    store.updateBudget(editingBudget.value.id, data);
  } else {
    store.addBudget(data);
  }
  isModalOpen.value = false;
};

const confirmDelete = (budget: Budget, event: Event) => {
  event.stopPropagation();
  if (confirm(`Es-tu sûr de vouloir supprimer le budget "${budget.category}" ?`)) {
    store.removeBudget(budget.id);
    if (selectedBudget.value?.id === budget.id) selectedBudget.value = null;
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-8 pb-20">
    <div class="flex items-center gap-4 mb-8">
      <div class="w-16 h-16 bg-pastel-blue border-2 border-black shadow-brutal flex items-center justify-center rounded-neo">
        <Wallet :size="32" />
      </div>
      <h1 class="text-4xl font-black">Mon Budget</h1>
    </div>

    <!-- Alert Box -->
    <div class="card-brutal bg-pastel-yellow border-dashed flex items-center gap-4 animate-bounce">
      <div class="p-3 bg-white border-2 border-black rounded-neo shadow-brutal">
        <Bell :size="24" class="text-orange-500" />
      </div>
      <div>
        <h3 class="font-black text-lg">Hé toi ! 🌸</h3>
        <p class="text-sm">Vérifie tes détails de budget pour voir si tu es dans le vert ce mois-ci.</p>
      </div>
    </div>

    <!-- Budget Cards -->
    <div class="space-y-6">
      <div 
        v-for="budget in store.budgets" 
        :key="budget.id" 
        @click="selectedBudget = budget"
        class="card-brutal bg-white hover:translate-x-1 transition-transform cursor-pointer group relative"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-xl font-black">{{ budget.category }}</h3>
            <p class="text-sm opacity-60 italic">{{ budget.description }}</p>
          </div>
          <div class="text-right">
            <p class="text-2xl font-black">{{ store.formatCFA(budget.current) }}</p>
            <p class="text-xs uppercase font-black" :class="getProgress(budget) > 90 ? 'text-red-500' : 'text-gray-400'">
              {{ Math.round(getProgress(budget)) }}% Utilisé
            </p>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="h-8 w-full bg-gray-100 border-2 border-black rounded-neo overflow-hidden p-1 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)]">
          <div 
            class="h-full rounded-sm border-r-2 border-black transition-all duration-1000 ease-out"
            :class="[budget.color, getProgress(budget) > 90 ? 'animate-pulse' : '']"
            :style="{ width: `${getProgress(budget)}%` }"
          ></div>
        </div>

        <div class="mt-4 flex justify-between items-center">
          <div class="flex gap-2">
             <button 
                @click="openEditModal(budget, $event)"
                class="p-2 hover:bg-pastel-blue rounded-neo border-2 border-transparent hover:border-black transition-all"
                title="Modifier"
              >
                <Edit3 :size="16" />
              </button>
              <button 
                @click="confirmDelete(budget, $event)"
                class="p-2 hover:bg-pastel-pink rounded-neo border-2 border-transparent hover:border-black transition-all"
                title="Supprimer"
              >
                <Trash2 :size="16" class="text-red-500" />
              </button>
          </div>
          <div class="flex items-center gap-1 text-xs font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Détails</span>
            <ChevronRight :size="16" />
          </div>
        </div>
      </div>

      <!-- Add Budget Button -->
      <button 
        @click="openCreateModal"
        class="w-full btn-brutal border-dashed border-gray-400 text-gray-500 hover:text-black hover:border-black flex items-center justify-center gap-2 py-6 bg-white/50"
      >
        <ShieldPlus :size="24" />
        Nouveau Budget
      </button>
    </div>

    <!-- Budget Detail Modal -->
    <BudgetDetail 
      v-if="selectedBudget" 
      :budget="selectedBudget" 
      @close="selectedBudget = null" 
      @edit="openEditModal(selectedBudget, $event)"
      @delete="confirmDelete(selectedBudget, $event)"
    />

    <!-- Add/Edit Budget Modal -->
    <BudgetModal 
      v-if="isModalOpen" 
      :budget="editingBudget"
      @close="isModalOpen = false"
      @save="handleSave"
    />
  </div>
</template>
