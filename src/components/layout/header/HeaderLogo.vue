<template>
  <router-link to="/" class="flex items-center gap-2 lg:hidden">
    <div
      class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white"
    >
      <Car class="h-4 w-4" />
    </div>
    <span class="text-lg font-bold text-gray-800 dark:text-white">
      AutoFleet
    </span>
  </router-link>
</template>

<script setup lang="ts">
import { Car } from 'lucide-vue-next'
</script>
