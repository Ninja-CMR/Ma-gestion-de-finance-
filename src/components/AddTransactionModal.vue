<script setup lang="ts">
import { reactive, watch } from 'vue';
import { X, Send, TrendingDown, TrendingUp } from 'lucide-vue-next';

const props = defineProps<{
  initialType?: 'expense' | 'income';
}>();

const emit = defineEmits(['close', 'add']);

const form = reactive({
  label: '',
  amount: 0,
  category: 'Food',
  type: props.initialType || 'expense' as 'expense' | 'income',
  date: new Date().toISOString().split('T')[0]
});

// Sync type if it changes externally (not really needed but good practice)
watch(() => props.initialType, (newVal) => {
  if (newVal) form.type = newVal;
});

const submit = () => {
  if (!form.label || form.amount <= 0) return;
  emit('add', { ...form });
  form.label = '';
  form.amount = 0;
};
</script>

<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="card-brutal bg-cream w-full max-w-md animate-in fade-in zoom-in duration-200">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-black flex items-center gap-2">
          <TrendingDown v-if="form.type === 'expense'" class="text-pastel-pink" />
          <TrendingUp v-else class="text-pastel-mint" />
          {{ form.type === 'expense' ? 'Nouvelle Dépense' : 'Nouveau Revenu' }}
        </h2>
        <button @click="$emit('close')" class="hover:rotate-90 transition-transform">
          <X :size="24" />
        </button>
      </div>

      <form @submit.prevent="submit" class="space-y-4">
        <div class="flex gap-2 p-1 bg-white border-2 border-black rounded-neo mb-4">
          <button 
            type="button"
            @click="form.type = 'expense'"
            class="flex-1 py-2 text-sm font-black transition-all rounded-sm flex items-center justify-center gap-2"
            :class="form.type === 'expense' ? 'bg-pastel-pink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -translate-x-0.5 -translate-y-0.5' : 'text-gray-400'"
          >
            <TrendingDown :size="16" />
            Sortie
          </button>
          <button 
            type="button"
            @click="form.type = 'income'"
            class="flex-1 py-2 text-sm font-black transition-all rounded-sm flex items-center justify-center gap-2"
            :class="form.type === 'income' ? 'bg-pastel-mint shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -translate-x-0.5 -translate-y-0.5' : 'text-gray-400'"
          >
            <TrendingUp :size="16" />
            Entrée
          </button>
        </div>

        <div>
          <label class="block font-bold mb-1 ml-1 text-sm">Libellé 🌸</label>
          <input 
            v-model="form.label"
            type="text" 
            placeholder="Ex: Salaire, Courses..." 
            class="input-brutal w-full bg-white"
            required
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block font-bold mb-1 ml-1 text-sm">Montant (F CFA) 💰</label>
            <input 
              v-model.number="form.amount"
              type="number" 
              class="input-brutal w-full bg-white font-mono"
              required
            />
          </div>
          <div v-if="form.type === 'expense'">
            <label class="block font-bold mb-1 ml-1 text-sm">Catégorie</label>
            <select v-model="form.category" class="input-brutal w-full bg-white">
              <option>Food</option>
              <option>Coffee</option>
              <option>Shopping</option>
              <option>Bills</option>
              <option>Other</option>
            </select>
          </div>
          <div v-else>
            <label class="block font-bold mb-1 ml-1 text-sm">Source</label>
            <select v-model="form.category" class="input-brutal w-full bg-white">
              <option>Income</option>
              <option>Gift</option>
              <option>Refund</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <button 
          type="submit" 
          class="btn-brutal w-full flex items-center justify-center gap-2 mt-4 py-4 text-lg"
          :class="form.type === 'expense' ? 'bg-pastel-pink' : 'bg-pastel-mint'"
        >
          <Send :size="20" />
          {{ form.type === 'expense' ? 'Enregistrer la dépense' : 'Enregistrer le revenu' }}
        </button>
      </form>
    </div>
  </div>
</template>
