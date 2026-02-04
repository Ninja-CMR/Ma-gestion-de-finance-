<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { X, Save, Palette } from 'lucide-vue-next';
import { type Budget } from '../stores/financeStore';

const props = defineProps<{
  budget?: Budget;
}>();

const emit = defineEmits(['close', 'save']);

const colors = [
  { name: 'Rose', class: 'bg-pastel-pink' },
  { name: 'Jaune', class: 'bg-pastel-yellow' },
  { name: 'Menthe', class: 'bg-pastel-mint' },
  { name: 'Bleu', class: 'bg-pastel-blue' },
  { name: 'Crème', class: 'bg-cream' },
];

const form = reactive({
  category: '',
  limit: 0,
  description: '',
  color: 'bg-pastel-pink',
});

onMounted(() => {
  if (props.budget) {
    form.category = props.budget.category;
    form.limit = props.budget.limit;
    form.description = props.budget.description;
    form.color = props.budget.color;
  }
});

const submit = () => {
  if (!form.category || form.limit <= 0) return;
  emit('save', { ...form });
};
</script>

<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="card-brutal bg-cream w-full max-w-md animate-in fade-in zoom-in duration-200">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-black">{{ budget ? 'Modifier le Budget' : 'Nouveau Budget' }}</h2>
        <button @click="$emit('close')" class="hover:rotate-90 transition-transform">
          <X :size="24" />
        </button>
      </div>

      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="block font-bold mb-1 ml-1 text-sm">Nom du Budget 🏷️</label>
          <input 
            v-model="form.category"
            type="text" 
            placeholder="Ex: Alimentation, Loisirs..." 
            class="input-brutal w-full bg-white"
            required
          />
        </div>

        <div>
          <label class="block font-bold mb-1 ml-1 text-sm">Limite (F CFA) 💰</label>
          <input 
            v-model.number="form.limit"
            type="number" 
            class="input-brutal w-full bg-white font-mono"
            required
          />
        </div>

        <div>
          <label class="block font-bold mb-1 ml-1 text-sm">Description 📝</label>
          <textarea 
            v-model="form.description"
            placeholder="À quoi sert ce budget ?" 
            class="input-brutal w-full bg-white h-24 resize-none"
          ></textarea>
        </div>

        <div>
          <label class="block font-bold mb-1 ml-1 text-sm flex items-center gap-2">
            <Palette :size="16" />
            Couleur Thème
          </label>
          <div class="flex gap-3 mt-2">
            <button 
              v-for="color in colors" 
              :key="color.class"
              type="button"
              @click="form.color = color.class"
              class="w-8 h-8 rounded-full border-2 border-black shadow-brutal transition-transform active:translate-y-0.5"
              :class="[color.class, form.color === color.class ? 'ring-2 ring-black ring-offset-2 scale-110' : '']"
              :title="color.name"
            ></button>
          </div>
        </div>

        <button type="submit" class="btn-brutal w-full bg-pastel-yellow flex items-center justify-center gap-2 mt-4 py-4 text-lg">
          <Save :size="20" />
          {{ budget ? 'Mettre à jour' : 'Créer le Budget' }}
        </button>
      </form>
    </div>
  </div>
</template>
