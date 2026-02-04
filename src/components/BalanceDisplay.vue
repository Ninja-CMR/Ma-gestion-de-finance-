<script setup lang="ts">
import { computed } from 'vue';
import { useFinanceStore } from '../stores/financeStore';

const store = useFinanceStore();

const props = defineProps<{
  balance: number;
}>();

const formattedBalance = computed(() => {
  return store.formatCFA(props.balance);
});
</script>

<template>
  <div class="card-brutal bg-pastel-yellow text-center py-10">
    <p class="text-sm font-bold uppercase tracking-widest mb-2 opacity-70">Solde Total</p>
    <h1 class="text-5xl md:text-6xl font-black">{{ formattedBalance }}</h1>
  </div>
</template>
