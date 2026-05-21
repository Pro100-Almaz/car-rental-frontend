<template>
  <Teleport to="body">
    <div class="pointer-events-none fixed right-4 top-4 z-[99999] flex flex-col gap-2">
      <TransitionGroup
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="translate-x-8 opacity-0"
        enter-to-class="translate-x-0 opacity-100"
        leave-from-class="translate-x-0 opacity-100"
        leave-to-class="translate-x-8 opacity-0"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'pointer-events-auto flex w-80 items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-sm',
            styles[toast.type],
          ]"
        >
          <component :is="icons[toast.type]" class="mt-0.5 h-4 w-4 shrink-0" />
          <p class="flex-1 text-sm font-medium">{{ toast.message }}</p>
          <button
            class="shrink-0 opacity-60 transition-opacity hover:opacity-100"
            @click="removeToast(toast.id)"
          >
            <X class="h-4 w-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()

const styles: Record<string, string> = {
  success: 'border-success-200 bg-success-50/95 text-success-700 dark:border-success-800/50 dark:bg-success-900/90 dark:text-success-300',
  error: 'border-error-200 bg-error-50/95 text-error-700 dark:border-error-800/50 dark:bg-error-900/90 dark:text-error-300',
  warning: 'border-warning-200 bg-warning-50/95 text-warning-700 dark:border-warning-800/50 dark:bg-warning-900/90 dark:text-warning-300',
  info: 'border-brand-200 bg-brand-50/95 text-brand-700 dark:border-brand-800/50 dark:bg-brand-900/90 dark:text-brand-300',
}

const icons: Record<string, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}
</script>
