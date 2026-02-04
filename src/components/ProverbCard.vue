<script setup lang="ts">
import { Quote } from 'lucide-vue-next';

interface Props {
  text: string;
  origin: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="card-brutal bg-white border-dashed border-pastel-pink relative overflow-hidden">
    <div class="absolute -right-4 -top-4 opacity-10">
      <Quote :size="80" />
    </div>
    <p class="text-xl font-bold italic mb-2 relative z-10">"{{ props.text }}"</p>
    <div class="flex items-center gap-2">
      <span class="px-2 py-1 bg-pastel-pink rounded-neo text-xs font-black uppercase tracking-wider">
        Sagesse {{ props.origin }}
      </span>
    </div>
  </div>
</template>
