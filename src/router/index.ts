import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { ROUTE_ALLOWED_ROLES, DEFAULT_HOME } from '@/composables/usePermissions'

const Placeholder = () => import('../views/PlaceholderPage.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    // --- Auth (no layout) ---
    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: { title: 'Вход' },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: { title: 'Регистрация' },
    },

    // --- 404 (no layout) ---
    {
      path: '/error-404',
      name: '404',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: { title: '404' },
    },

    // --- All authenticated routes (with AdminLayout) ---
    {
      path: '/',
      component: AdminLayout,
      children: [
        // Dashboard
        {
          path: '',
          name: 'Dashboard',
          component: () => import('../views/Dashboard/DashboardMain.vue'),
          meta: { title: 'Панель управления' },
        },

        // Fleet
        {
          path: 'fleet',
          name: 'FleetList',
          component: () => import('../views/Fleet/FleetList.vue'),
          meta: { title: 'Автопарк' },
        },
        {
          path: 'fleet/add',
          name: 'FleetAdd',
          component: () => import('../views/Fleet/VehicleCreate.vue'),
          meta: { title: 'Добавить автомобиль' },
        },
        {
          path: 'fleet/categories',
          name: 'FleetCategories',
          component: () => import('../views/Fleet/FleetCategories.vue'),
          meta: { title: 'Категории авто' },
        },
        {
          path: 'fleet/:id',
          name: 'FleetDetail',
          component: () => import('../views/Fleet/FleetDetail.vue'),
          meta: { title: 'Автомобиль' },
        },

        // Rentals
        {
          path: 'rentals',
          name: 'RentalsList',
          component: () => import('../views/Rentals/RentalsList.vue'),
          meta: { title: 'Активные аренды' },
        },
        {
          path: 'rentals/calendar',
          name: 'BookingCalendar',
          component: () => import('../views/Rentals/BookingCalendar.vue'),
          meta: { title: 'Календарь бронирования' },
        },
        {
          path: 'rentals/create',
          name: 'RentalCreate',
          component: () => import('../views/Rentals/RentalCreate.vue'),
          meta: { title: 'Создать бронирование' },
        },
        {
          path: 'rentals/returns',
          name: 'ReturnsQueue',
          component: () => import('../views/Rentals/ReturnsQueue.vue'),
          meta: { title: 'Очередь возвратов' },
        },
        {
          path: 'rentals/:id',
          name: 'RentalDetail',
          component: () => import('../views/Rentals/RentalDetail.vue'),
          meta: { title: 'Детали аренды' },
        },

        // CRM & Leads
        {
          path: 'crm/leads',
          name: 'LeadKanban',
          component: () => import('../views/CRM/LeadKanban.vue'),
          meta: { title: 'Воронка продаж' },
        },
        {
          path: 'crm/leads/list',
          name: 'LeadList',
          component: Placeholder,
          meta: { title: 'Список лидов' },
        },
        {
          path: 'crm/analytics',
          name: 'CRMAnalytics',
          component: Placeholder,
          meta: { title: 'Аналитика конверсий' },
        },

        // Clients
        {
          path: 'clients',
          name: 'ClientList',
          component: () => import('../views/Clients/ClientList.vue'),
          meta: { title: 'Клиенты' },
        },
        {
          path: 'clients/verification',
          name: 'VerificationQueue',
          component: Placeholder,
          meta: { title: 'Верификация документов' },
        },
        {
          path: 'clients/blacklist',
          name: 'Blacklist',
          component: Placeholder,
          meta: { title: 'Чёрный список' },
        },
        {
          path: 'clients/new',
          name: 'ClientCreate',
          component: () => import('../views/Clients/ClientCreate.vue'),
          meta: { title: 'Новый клиент' },
        },
        {
          path: 'clients/:id',
          name: 'ClientDetail',
          component: () => import('../views/Clients/ClientDetail.vue'),
          meta: { title: 'Клиент' },
        },

        // Investors
        {
          path: 'investors',
          name: 'InvestorList',
          component: () => import('../views/Investors/InvestorList.vue'),
          meta: { title: 'Инвесторы' },
        },
        {
          path: 'investors/payouts',
          name: 'PayoutManagement',
          component: Placeholder,
          meta: { title: 'Управление выплатами' },
        },
        {
          path: 'investors/:id',
          name: 'InvestorDetail',
          component: () => import('../views/Investors/InvestorDetail.vue'),
          meta: { title: 'Инвестор' },
        },

        // Investor Portal
        {
          path: 'portal',
          name: 'PortalDashboard',
          component: () => import('../views/InvestorPortal/PortalDashboard.vue'),
          meta: { title: 'Мои инвестиции' },
        },
        {
          path: 'portal/vehicles',
          name: 'PortalVehicles',
          component: () => import('../views/InvestorPortal/PortalVehicles.vue'),
          meta: { title: 'Мои автомобили' },
        },
        {
          path: 'portal/payouts',
          name: 'PortalPayouts',
          component: () => import('../views/InvestorPortal/PortalPayouts.vue'),
          meta: { title: 'Мои выплаты' },
        },

        // Communications
        {
          path: 'communications/inbox',
          name: 'UnifiedInbox',
          component: Placeholder,
          meta: { title: 'Входящие сообщения' },
        },
        {
          path: 'communications/calls',
          name: 'PhoneCalls',
          component: Placeholder,
          meta: { title: 'Звонки' },
        },
        {
          path: 'communications/team-chat',
          name: 'TeamChat',
          component: Placeholder,
          meta: { title: 'Командный чат' },
        },

        // Tasks
        {
          path: 'tasks',
          name: 'TaskBoard',
          component: Placeholder,
          meta: { title: 'Задачи' },
        },

        // Fines & Accidents
        {
          path: 'fines',
          name: 'FineList',
          component: Placeholder,
          meta: { title: 'Штрафы' },
        },
        {
          path: 'fines/accidents',
          name: 'AccidentLog',
          component: Placeholder,
          meta: { title: 'ДТП' },
        },

        // Contracts
        {
          path: 'contracts',
          name: 'ContractList',
          component: Placeholder,
          meta: { title: 'Договоры' },
        },

        // Maintenance
        {
          path: 'maintenance',
          name: 'MaintenanceSchedule',
          component: Placeholder,
          meta: { title: 'Плановое ТО' },
        },
        {
          path: 'maintenance/repairs',
          name: 'RepairJournal',
          component: Placeholder,
          meta: { title: 'Журнал ремонтов' },
        },

        // Finance
        {
          path: 'finance/cash-journal',
          name: 'CashJournal',
          component: () => import('../views/Finance/CashJournal.vue'),
          meta: { title: 'Касса' },
        },
        {
          path: 'finance/pnl',
          name: 'PnLReport',
          component: () => import('../views/Finance/PnlReport.vue'),
          meta: { title: 'ОПиУ' },
        },
        {
          path: 'finance/cash-flow',
          name: 'CashFlowReport',
          component: () => import('../views/Finance/CashFlowReport.vue'),
          meta: { title: 'Cash Flow' },
        },
        {
          path: 'finance/vehicles-comparison',
          name: 'VehiclesComparison',
          component: () => import('../views/Finance/VehiclesComparison.vue'),
          meta: { title: 'Сравнение автомобилей' },
        },
        {
          path: 'finance/debts',
          name: 'DebtManagement',
          component: Placeholder,
          meta: { title: 'Задолженности' },
        },
        {
          path: 'finance/deposits',
          name: 'OutstandingDeposits',
          component: Placeholder,
          meta: { title: 'Залоги' },
        },

        // KPI & Bonuses
        {
          path: 'kpi',
          name: 'KPIDashboard',
          component: Placeholder,
          meta: { title: 'KPI менеджеров' },
        },
        {
          path: 'kpi/bonuses',
          name: 'BonusReport',
          component: Placeholder,
          meta: { title: 'Бонусы' },
        },

        // Analytics
        {
          path: 'analytics/revenue',
          name: 'RevenueAnalytics',
          component: Placeholder,
          meta: { title: 'Доходы и загрузка' },
        },
        {
          path: 'analytics/expenses',
          name: 'ExpenseAnalytics',
          component: Placeholder,
          meta: { title: 'Расходы' },
        },
        {
          path: 'analytics/marketing',
          name: 'MarketingAnalytics',
          component: Placeholder,
          meta: { title: 'Маркетинг' },
        },
        {
          path: 'analytics/profitability',
          name: 'ProfitabilityAnalytics',
          component: Placeholder,
          meta: { title: 'Прибыльность' },
        },
        {
          path: 'analytics/summary',
          name: 'SummaryTable',
          component: Placeholder,
          meta: { title: 'Сводная таблица' },
        },

        // Settings
        {
          path: 'settings/organization',
          name: 'OrganizationSettings',
          component: () => import('../views/Settings/OrganizationProfile.vue'),
          meta: { title: 'Организация' },
        },
        {
          path: 'settings/users',
          name: 'UsersRoles',
          component: () => import('../views/Settings/UserManagement.vue'),
          meta: { title: 'Пользователи и роли' },
        },
        {
          path: 'settings/pricing',
          name: 'PricingSettings',
          component: Placeholder,
          meta: { title: 'Тарифы' },
        },
        {
          path: 'settings/services',
          name: 'ServicesSettings',
          component: Placeholder,
          meta: { title: 'Доп. услуги' },
        },
        {
          path: 'settings/expense-categories',
          name: 'ExpenseCategorySettings',
          component: () => import('@/views/Settings/ExpenseCategorySettings.vue'),
          meta: { title: 'Категории расходов' },
        },
        {
          path: 'settings/lead-sources',
          name: 'LeadSourceSettings',
          component: Placeholder,
          meta: { title: 'Источники лидов' },
        },
        {
          path: 'settings/bonus-formulas',
          name: 'BonusFormulaSettings',
          component: Placeholder,
          meta: { title: 'Формулы бонусов' },
        },
        {
          path: 'settings/contract-templates',
          name: 'ContractTemplateSettings',
          component: Placeholder,
          meta: { title: 'Шаблоны договоров' },
        },
        {
          path: 'settings/notifications',
          name: 'NotificationSettings',
          component: Placeholder,
          meta: { title: 'Уведомления' },
        },
        {
          path: 'settings/integrations',
          name: 'IntegrationSettings',
          component: Placeholder,
          meta: { title: 'Интеграции' },
        },
        {
          path: 'settings/system',
          name: 'SystemSettings',
          component: () => import('../views/Settings/SystemSettings.vue'),
          meta: { title: 'Системные настройки' },
        },

        // Profile
        {
          path: 'profile',
          name: 'Profile',
          component: () => import('../views/Others/UserProfile.vue'),
          meta: { title: 'Профиль' },
        },
      ],
    },

    // Catch-all
    {
      path: '/:pathMatch(.*)*',
      redirect: '/error-404',
    },
  ],
})

const publicRoutes = ['Signin', 'Signup', '404']

router.beforeEach(async (to, _from, next) => {
  document.title = `${to.meta.title || 'AutoFleet'} | AutoFleet CRM`

  const auth = useAuthStore()

  if (publicRoutes.includes(to.name as string)) {
    if (auth.isAuthenticated && to.name === 'Signin') {
      return next({ name: 'Dashboard' })
    }
    return next()
  }

  if (!auth.isAuthenticated) {
    const hasSession = await auth.checkSession()
    if (!hasSession) {
      return next({ name: 'Signin' })
    }
  }

  const allowedRoles = ROUTE_ALLOWED_ROLES[to.name as string]
  if (allowedRoles && auth.userRole && !allowedRoles.includes(auth.userRole)) {
    const home = DEFAULT_HOME[auth.userRole] || '/'
    return next(home)
  }

  next()
})

export default router
