<template>
  <div ref="containerRef" class="relative w-full">
    <!-- Trigger / Selected display -->
    <div
      :class="[
        'relative flex min-h-[42px] w-full cursor-pointer items-center gap-2 rounded-lg border bg-white px-3.5 py-2.5 text-sm transition-colors',
        'dark:bg-gray-800',
        isOpen
          ? 'border-brand-500 ring-4 ring-brand-500/10 dark:border-brand-500'
          : 'border-gray-200 dark:border-gray-700',
        disabled ? 'cursor-not-allowed opacity-50' : 'hover:border-gray-300 dark:hover:border-gray-600',
      ]"
      @click="!disabled && toggleOpen()"
    >
      <!-- Loading state -->
      <template v-if="loading">
        <Loader2 class="h-4 w-4 shrink-0 animate-spin text-gray-400" />
        <span class="text-gray-400">Загрузка...</span>
      </template>

      <!-- Selected item display -->
      <template v-else-if="selectedOption">
        <component
          :is="selectedOption.icon"
          v-if="selectedOption.icon"
          class="h-4 w-4 shrink-0 text-brand-500"
        />
        <span class="flex-1 truncate text-gray-700 dark:text-gray-300">
          {{ selectedOption.label }}
        </span>
        <!-- Clear button -->
        <button
          type="button"
          class="ml-auto shrink-0 rounded p-0.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/[0.08] dark:hover:text-gray-300"
          @click.stop="clearSelection"
          :aria-label="'Очистить'"
        >
          <X class="h-3.5 w-3.5" />
        </button>
      </template>

      <!-- Placeholder -->
      <template v-else>
        <Search class="h-4 w-4 shrink-0 text-gray-400" />
        <span class="flex-1 text-gray-400">{{ placeholder ?? 'Поиск...' }}</span>
        <ChevronDown
          :class="[
            'ml-auto h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200',
            isOpen ? 'rotate-180' : 'rotate-0',
          ]"
        />
      </template>
    </div>

    <!-- Dropdown panel -->
    <Transition
      enter-active-class="transition-all duration-150 ease-out"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute left-0 right-0 z-50 mt-1.5 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
      >
        <!-- Search input inside dropdown -->
        <div class="border-b border-gray-100 p-2 dark:border-gray-700">
          <div class="relative">
            <Search class="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              ref="searchInputRef"
              v-model="query"
              type="text"
              :placeholder="placeholder ?? 'Поиск...'"
              class="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-8 pr-3 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:placeholder:text-gray-500 dark:focus:border-brand-500"
              @keydown="handleKeydown"
            />
          </div>
        </div>

        <!-- Options list -->
        <ul
          ref="listRef"
          class="max-h-60 overflow-y-auto overscroll-contain py-1"
          role="listbox"
        >
          <template v-if="filteredOptions.length > 0">
            <li
              v-for="(option, index) in filteredOptions"
              :key="option.id"
              :ref="(el) => setOptionRef(el as HTMLElement | null, index)"
              role="option"
              :aria-selected="option.id === modelValue"
              :class="[
                'flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm transition-colors',
                option.id === modelValue
                  ? 'bg-brand-50 dark:bg-brand-500/10'
                  : index === highlightedIndex
                    ? 'bg-gray-50 dark:bg-white/[0.03]'
                    : 'hover:bg-gray-50 dark:hover:bg-white/[0.03]',
              ]"
              @click="selectOption(option)"
              @mouseenter="highlightedIndex = index"
            >
              <!-- Icon -->
              <component
                :is="option.icon"
                v-if="option.icon"
                :class="[
                  'h-4 w-4 shrink-0',
                  option.id === modelValue
                    ? 'text-brand-500'
                    : 'text-gray-400 dark:text-gray-500',
                ]"
              />

              <!-- Label + secondary -->
              <div class="min-w-0 flex-1">
                <span
                  :class="[
                    'block truncate font-medium',
                    option.id === modelValue
                      ? 'text-brand-700 dark:text-brand-300'
                      : 'text-gray-700 dark:text-gray-300',
                  ]"
                >
                  {{ option.label }}
                </span>
                <span
                  v-if="option.secondary"
                  class="block truncate text-xs text-gray-400 dark:text-gray-500"
                >
                  {{ option.secondary }}
                </span>
              </div>

              <!-- Checkmark for selected -->
              <svg
                v-if="option.id === modelValue"
                class="h-4 w-4 shrink-0 text-brand-500"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="2.5 8 6.5 12 13.5 4" />
              </svg>
            </li>
          </template>

          <!-- Empty state -->
          <li v-else class="px-3 py-6 text-center text-sm text-gray-400 dark:text-gray-500">
            <Search class="mx-auto mb-2 h-5 w-5 opacity-40" />
            Ничего не найдено
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import type { Component } from 'vue'
import { Search, X, ChevronDown, Loader2 } from 'lucide-vue-next'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface SearchSelectOption {
  id: string
  label: string
  secondary?: string
  icon?: Component
}

// ─── Props & Emits ──────────────────────────────────────────────────────────

interface Props {
  modelValue: string
  options: SearchSelectOption[]
  placeholder?: string
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Поиск...',
  disabled: false,
  loading: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// ─── State ───────────────────────────────────────────────────────────────────

const isOpen = ref(false)
const query = ref('')
const highlightedIndex = ref(-1)

const containerRef = ref<HTMLElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)
const listRef = ref<HTMLElement | null>(null)
const optionRefs = ref<(HTMLElement | null)[]>([])

// ─── Computed ────────────────────────────────────────────────────────────────

const selectedOption = computed<SearchSelectOption | undefined>(() =>
  props.options.find((o) => o.id === props.modelValue),
)

const filteredOptions = computed<SearchSelectOption[]>(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.options
  return props.options.filter(
    (o) =>
      o.label.toLowerCase().includes(q) ||
      (o.secondary?.toLowerCase().includes(q) ?? false),
  )
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

function setOptionRef(el: HTMLElement | null, index: number) {
  optionRefs.value[index] = el
}

function scrollOptionIntoView(index: number) {
  nextTick(() => {
    const el = optionRefs.value[index]
    if (el && listRef.value) {
      const listTop = listRef.value.scrollTop
      const listBottom = listTop + listRef.value.clientHeight
      const elTop = el.offsetTop
      const elBottom = elTop + el.offsetHeight
      if (elTop < listTop) {
        listRef.value.scrollTop = elTop
      } else if (elBottom > listBottom) {
        listRef.value.scrollTop = elBottom - listRef.value.clientHeight
      }
    }
  })
}

// ─── Open / Close ────────────────────────────────────────────────────────────

function toggleOpen() {
  if (isOpen.value) {
    close()
  } else {
    open()
  }
}

function open() {
  isOpen.value = true
  query.value = ''
  highlightedIndex.value = -1
  nextTick(() => {
    searchInputRef.value?.focus()
  })
}

function close() {
  isOpen.value = false
  query.value = ''
  highlightedIndex.value = -1
}

// ─── Selection ───────────────────────────────────────────────────────────────

function selectOption(option: SearchSelectOption) {
  emit('update:modelValue', option.id)
  close()
}

function clearSelection() {
  emit('update:modelValue', '')
}

// ─── Keyboard navigation ──────────────────────────────────────────────────────

function handleKeydown(event: KeyboardEvent) {
  const total = filteredOptions.value.length

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      if (total === 0) break
      highlightedIndex.value = highlightedIndex.value < total - 1 ? highlightedIndex.value + 1 : 0
      scrollOptionIntoView(highlightedIndex.value)
      break

    case 'ArrowUp':
      event.preventDefault()
      if (total === 0) break
      highlightedIndex.value = highlightedIndex.value > 0 ? highlightedIndex.value - 1 : total - 1
      scrollOptionIntoView(highlightedIndex.value)
      break

    case 'Enter':
      event.preventDefault()
      if (highlightedIndex.value >= 0 && filteredOptions.value[highlightedIndex.value]) {
        selectOption(filteredOptions.value[highlightedIndex.value])
      }
      break

    case 'Escape':
      event.preventDefault()
      close()
      break
  }
}

// Reset highlight when filtered list changes
watch(filteredOptions, () => {
  highlightedIndex.value = -1
  optionRefs.value = []
})

// ─── Click outside ────────────────────────────────────────────────────────────

function handleClickOutside(event: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>
