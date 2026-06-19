<template>
  <aside
    :class="[
      'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-99999 border-r border-gray-200',
      {
        'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
        'lg:w-[90px]': !isExpanded && !isHovered,
        'translate-x-0 w-[290px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true,
      },
    ]"
    @mouseenter="!isExpanded && (isHovered = true)"
    @mouseleave="isHovered = false"
  >
    <div
      :class="[
        'py-8 flex',
        !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start',
      ]"
    >
      <router-link to="/" class="flex items-center gap-2">
        <div
          class="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-white"
        >
          <Car class="h-5 w-5" />
        </div>
        <span
          v-if="isExpanded || isHovered || isMobileOpen"
          class="text-xl font-bold text-gray-800 dark:text-white"
        >
          AutoFleet
        </span>
      </router-link>
    </div>
    <div
      class="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar"
    >
      <nav class="mb-6">
        <div class="flex flex-col gap-4">
          <div v-for="(menuGroup, groupIndex) in filteredMenuGroups" :key="groupIndex">
            <h2
              :class="[
                'mb-4 text-xs uppercase flex leading-[20px] text-gray-400',
                !isExpanded && !isHovered
                  ? 'lg:justify-center'
                  : 'justify-start',
              ]"
            >
              <template v-if="isExpanded || isHovered || isMobileOpen">
                {{ menuGroup.title }}
              </template>
              <HorizontalDots v-else />
            </h2>
            <ul class="flex flex-col gap-4">
              <li v-for="(item, index) in menuGroup.items" :key="item.name">
                <button
                  v-if="item.subItems"
                  @click="toggleSubmenu(groupIndex, index)"
                  :class="[
                    'menu-item group w-full',
                    {
                      'menu-item-active': isSubmenuOpen(groupIndex, index),
                      'menu-item-inactive': !isSubmenuOpen(groupIndex, index),
                    },
                    !isExpanded && !isHovered
                      ? 'lg:justify-center'
                      : 'lg:justify-start',
                  ]"
                >
                  <span
                    :class="[
                      isSubmenuOpen(groupIndex, index)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon" class="h-5 w-5" />
                  </span>
                  <span
                    v-if="isExpanded || isHovered || isMobileOpen"
                    class="menu-item-text"
                    >{{ item.name }}</span
                  >
                  <ChevronDownIcon
                    v-if="isExpanded || isHovered || isMobileOpen"
                    :class="[
                      'ml-auto w-5 h-5 transition-transform duration-200',
                      {
                        'rotate-180 text-brand-500': isSubmenuOpen(
                          groupIndex,
                          index
                        ),
                      },
                    ]"
                  />
                </button>
                <router-link
                  v-else-if="item.path"
                  :to="item.path"
                  :class="[
                    'menu-item group',
                    {
                      'menu-item-active': isParentActive(item.path),
                      'menu-item-inactive': !isParentActive(item.path),
                    },
                  ]"
                >
                  <span
                    :class="[
                      isExactActive(item.path)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon" class="h-5 w-5" />
                  </span>
                  <span
                    v-if="isExpanded || isHovered || isMobileOpen"
                    class="menu-item-text"
                    >{{ item.name }}</span
                  >
                </router-link>
                <transition
                  @enter="startTransition"
                  @after-enter="endTransition"
                  @before-leave="startTransition"
                  @after-leave="endTransition"
                >
                  <div
                    v-show="
                      isSubmenuOpen(groupIndex, index) &&
                      (isExpanded || isHovered || isMobileOpen)
                    "
                  >
                    <ul class="mt-2 space-y-1 ml-9">
                      <li v-for="subItem in item.subItems" :key="subItem.name">
                        <router-link
                          :to="subItem.path"
                          :class="[
                            'menu-dropdown-item',
                            {
                              'menu-dropdown-item-active': isExactActive(
                                subItem.path
                              ),
                              'menu-dropdown-item-inactive': !isExactActive(
                                subItem.path
                              ),
                            },
                          ]"
                        >
                          {{ subItem.name }}
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </transition>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Car,
  LayoutDashboard,
  CarFront,
  CalendarDays,
  Users,
  Megaphone,
  Landmark,
  MessageSquare,
  ClipboardList,
  AlertTriangle,
  FileText,
  Wrench,
  BarChart3,
  TrendingUp,
  Settings,
  Wallet,
  Target,
} from 'lucide-vue-next'
import { ChevronDownIcon, HorizontalDots } from '../../icons'
import { useSidebar } from '@/composables/useSidebar'
import { useAuthStore } from '@/stores/auth'
import type { UserRole } from '@/types'

const route = useRoute()
const { isExpanded, isMobileOpen, isHovered, openSubmenu } = useSidebar()
const auth = useAuthStore()

type SubItem = {
  name: string
  path: string
  roles?: UserRole[]
}

type MenuItem = {
  icon: unknown
  name: string
  path?: string
  roles: UserRole[]
  subItems?: SubItem[]
}

type MenuGroup = {
  title: string
  items: MenuItem[]
}

const menuGroups: MenuGroup[] = [
  {
    title: 'Главное',
    items: [
      {
        icon: LayoutDashboard,
        name: 'Панель управления',
        path: '/',
        roles: ['super_admin', 'admin', 'booking_manager', 'financial_manager', 'technician'],
      },
    ],
  },
  {
    title: 'Операции',
    items: [
      {
        icon: CarFront,
        name: 'Автопарк',
        roles: ['super_admin', 'admin', 'booking_manager', 'financial_manager', 'technician'],
        subItems: [
          { name: 'Список автомобилей', path: '/fleet' },
          { name: 'Добавить авто', path: '/fleet/add', roles: ['super_admin', 'admin'] },
          { name: 'Категории', path: '/fleet/categories', roles: ['super_admin', 'admin'] },
        ],
      },
      {
        icon: CalendarDays,
        name: 'Аренды',
        roles: ['super_admin', 'admin', 'booking_manager', 'financial_manager'],
        subItems: [
          { name: 'Активные аренды', path: '/rentals' },
          { name: 'Календарь бронирования', path: '/rentals/calendar' },
          { name: 'Создать бронирование', path: '/rentals/create', roles: ['super_admin', 'admin', 'booking_manager'] },
          { name: 'Очередь возвратов', path: '/rentals/returns', roles: ['super_admin', 'admin', 'booking_manager'] },
        ],
      },
      {
        icon: Megaphone,
        name: 'CRM и Лиды',
        roles: ['super_admin', 'admin', 'booking_manager'],
        subItems: [
          { name: 'Воронка продаж', path: '/crm/leads' },
          { name: 'Список лидов', path: '/crm/leads/list' },
          { name: 'Аналитика конверсий', path: '/crm/analytics' },
        ],
      },
      {
        icon: Users,
        name: 'Клиенты',
        roles: ['super_admin', 'admin', 'booking_manager', 'financial_manager'],
        subItems: [
          { name: 'Список клиентов', path: '/clients' },
          { name: 'Верификация', path: '/clients/verification', roles: ['super_admin', 'admin'] },
          { name: 'Чёрный список', path: '/clients/blacklist', roles: ['super_admin', 'admin'] },
        ],
      },
      {
        icon: Landmark,
        name: 'Инвесторы',
        roles: ['super_admin', 'admin', 'financial_manager'],
        subItems: [
          { name: 'Список инвесторов', path: '/investors' },
          { name: 'Управление выплатами', path: '/investors/payouts' },
        ],
      },
    ],
  },
  // {
  //   title: 'Коммуникации',
  //   items: [
  //     {
  //       icon: MessageSquare,
  //       name: 'Сообщения',
  //       roles: ['super_admin', 'admin', 'booking_manager'],
  //       subItems: [
  //         { name: 'Входящие', path: '/communications/inbox' },
  //         { name: 'Звонки', path: '/communications/calls' },
  //         { name: 'Командный чат', path: '/communications/team-chat' },
  //       ],
  //     },
  //     {
  //       icon: ClipboardList,
  //       name: 'Задачи',
  //       path: '/tasks',
  //       roles: ['super_admin', 'admin', 'booking_manager'],
  //     },
  //   ],
  // },
  {
    title: 'Учёт',
    items: [
      {
        icon: AlertTriangle,
        name: 'Штрафы и ДТП',
        roles: ['super_admin', 'admin', 'booking_manager'],
        subItems: [
          { name: 'Штрафы', path: '/fines' },
          { name: 'Журнал ДТП', path: '/fines/accidents' },
        ],
      },
      {
        icon: FileText,
        name: 'Договоры',
        path: '/contracts',
        roles: ['super_admin', 'admin', 'booking_manager'],
      },
      {
        icon: Wrench,
        name: 'Обслуживание',
        roles: ['super_admin', 'admin', 'technician'],
        subItems: [
          { name: 'Плановое ТО', path: '/maintenance' },
          { name: 'Журнал ремонтов', path: '/maintenance/repairs' },
        ],
      },
    ],
  },
  // {
  //   title: 'Финансы',
  //   items: [
  //     {
  //       icon: Wallet,
  //       name: 'Финансы',
  //       roles: ['super_admin', 'admin', 'booking_manager', 'financial_manager'],
  //       subItems: [
  //         { name: 'Касса', path: '/finance/cash-journal' },
  //         { name: 'ОПиУ', path: '/finance/pnl', roles: ['super_admin', 'admin', 'financial_manager'] },
  //         { name: 'Cash Flow', path: '/finance/cash-flow', roles: ['super_admin', 'admin', 'financial_manager'] },
  //         { name: 'Задолженности', path: '/finance/debts', roles: ['super_admin', 'admin', 'financial_manager'] },
  //         { name: 'Залоги', path: '/finance/deposits', roles: ['super_admin', 'admin', 'financial_manager'] },
  //       ],
  //     },
  //     {
  //       icon: Target,
  //       name: 'KPI и Бонусы',
  //       roles: ['super_admin', 'admin'],
  //       subItems: [
  //         { name: 'Дашборд KPI', path: '/kpi' },
  //         { name: 'Бонусы', path: '/kpi/bonuses' },
  //       ],
  //     },
  //     {
  //       icon: BarChart3,
  //       name: 'Аналитика',
  //       roles: ['super_admin', 'admin', 'financial_manager'],
  //       subItems: [
  //         { name: 'Доходы и загрузка', path: '/analytics/revenue' },
  //         { name: 'Расходы', path: '/analytics/expenses' },
  //         { name: 'Маркетинг', path: '/analytics/marketing', roles: ['super_admin', 'admin'] },
  //         { name: 'Прибыльность', path: '/analytics/profitability' },
  //         { name: 'Сводная таблица', path: '/analytics/summary' },
  //       ],
  //     },
  //   ],
  // },
  {
    title: 'Система',
    items: [
      {
        icon: Settings,
        name: 'Настройки',
        roles: ['super_admin', 'admin', 'financial_manager'],
        subItems: [
          { name: 'Организация', path: '/settings/organization', roles: ['super_admin', 'admin'] },
          { name: 'Пользователи и роли', path: '/settings/users', roles: ['super_admin', 'admin'] },
          { name: 'Тарифы', path: '/settings/pricing', roles: ['super_admin', 'admin'] },
          { name: 'Доп. услуги', path: '/settings/services', roles: ['super_admin', 'admin'] },
          { name: 'Категории расходов', path: '/settings/expense-categories', roles: ['super_admin', 'admin', 'financial_manager'] },
          { name: 'Источники лидов', path: '/settings/lead-sources', roles: ['super_admin', 'admin'] },
          { name: 'Формулы бонусов', path: '/settings/bonus-formulas', roles: ['super_admin', 'admin'] },
          { name: 'Шаблоны договоров', path: '/settings/contract-templates', roles: ['super_admin', 'admin'] },
          { name: 'Уведомления', path: '/settings/notifications', roles: ['super_admin', 'admin'] },
          { name: 'Интеграции', path: '/settings/integrations', roles: ['super_admin', 'admin'] },
        ],
      },
    ],
  },
]

const filteredMenuGroups = computed(() => {
  const role = auth.userRole
  if (!role) return []
  return menuGroups
    .map(group => ({
      ...group,
      items: group.items
        .filter(item => item.roles.includes(role))
        .map(item => {
          if (!item.subItems) return item
          return {
            ...item,
            subItems: item.subItems.filter(sub => !sub.roles || sub.roles.includes(role)),
          }
        }),
    }))
    .filter(group => group.items.length > 0)
})

const toggleSubmenu = (groupIndex: number, itemIndex: number) => {
  const key = `${groupIndex}-${itemIndex}`
  openSubmenu.value = openSubmenu.value === key ? null : key
}

const isExactActive = (path: string) => {
  return route.path === path
}

const isParentActive = (path: string) => {
  return path === '/' ? route.path ==='/' : route.path === path || route.path.startsWith(path + '/')
}

const isAnySubmenuRouteActive = computed(() => {
  return filteredMenuGroups.value.some((group) =>
    group.items.some(
      (item) =>
        'subItems' in item &&
        item.subItems?.some((subItem) => isExactActive(subItem.path)),
    ),
  )
})

const isSubmenuOpen = (groupIndex: number, itemIndex: number) => {
  const key = `${groupIndex}-${itemIndex}`
  const item = filteredMenuGroups.value[groupIndex]?.items[itemIndex]
  if (!item) return false
  return (
    openSubmenu.value === key ||
    (isAnySubmenuRouteActive.value &&
      'subItems' in item &&
      item.subItems?.some((subItem) => isExactActive(subItem.path)))
  )
}

const startTransition = (el: Element) => {
  const htmlEl = el as HTMLElement
  htmlEl.style.height = 'auto'
  const height = htmlEl.scrollHeight
  htmlEl.style.height = '0px'
  htmlEl.offsetHeight
  htmlEl.style.height = height + 'px'
}

const endTransition = (el: Element) => {
  ;(el as HTMLElement).style.height = ''
}
</script>
