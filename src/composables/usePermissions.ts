import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { UserRole } from '@/types'

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: ['*'],
  admin: [
    'fleet.*', 'rental.*', 'client.*', 'comms.*', 'tasks.*',
    'analytics.*', 'finance.*', 'investors.*', 'maintenance.*',
    'users.*', 'invites.*', 'settings.*',
  ],
  booking_manager: [
    'fleet.read', 'fleet.status.limited', 'fleet.photos.upload', 'fleet.docs.upload',
    'rental.*', 'client.read', 'client.create', 'client.edit', 'client.docs.upload',
    'comms.*', 'tasks.*', 'finance.cash_journal.read', 'finance.cash_journal.create',
  ],
  financial_manager: [
    'fleet.read', 'rental.read', 'client.read', 'finance.*',
    'investors.read', 'investors.payout.create', 'investors.payout.approve',
    'analytics.*', 'settings.expense_categories',
  ],
  investor: [
    'fleet.own.read', 'analytics.own.read', 'investors.own.read',
    'investors.own.payouts.read', 'investors.own.export',
  ],
  technician: ['fleet.read', 'maintenance.*'],
}

function matchPermission(required: string, userPerms: string[]): boolean {
  return userPerms.some(perm => {
    if (perm === '*') return true
    if (perm === required) return true
    if (perm.endsWith('.*')) {
      const prefix = perm.slice(0, -2)
      return required.startsWith(prefix + '.') || required === prefix
    }
    return false
  })
}

export function usePermissions() {
  const auth = useAuthStore()

  const can = (permission: string): boolean => {
    const role = auth.userRole
    if (!role) return false
    const perms = ROLE_PERMISSIONS[role] || []
    return matchPermission(permission, perms)
  }

  const isInvestor = computed(() => auth.userRole === 'investor')

  return { can, isInvestor, ROLE_PERMISSIONS }
}

export const ROUTE_ALLOWED_ROLES: Record<string, UserRole[]> = {
  'Dashboard': ['super_admin', 'admin', 'booking_manager', 'financial_manager', 'technician'],
  'InvestorDashboard': ['investor'],
  'FleetList': ['super_admin', 'admin', 'booking_manager', 'financial_manager', 'technician'],
  'FleetAdd': ['super_admin', 'admin'],
  'FleetDetail': ['super_admin', 'admin', 'booking_manager', 'financial_manager', 'investor', 'technician'],
  'FleetCategories': ['super_admin', 'admin'],
  'RentalList': ['super_admin', 'admin', 'booking_manager', 'financial_manager'],
  'RentalCalendar': ['super_admin', 'admin', 'booking_manager', 'financial_manager'],
  'RentalCreate': ['super_admin', 'admin', 'booking_manager'],
  'RentalReturns': ['super_admin', 'admin', 'booking_manager'],
  'CrmLeads': ['super_admin', 'admin', 'booking_manager'],
  'CrmLeadsList': ['super_admin', 'admin', 'booking_manager'],
  'CrmAnalytics': ['super_admin', 'admin', 'booking_manager'],
  'ClientList': ['super_admin', 'admin', 'booking_manager', 'financial_manager'],
  'ClientVerification': ['super_admin', 'admin'],
  'ClientBlacklist': ['super_admin', 'admin'],
  'InvestorList': ['super_admin', 'admin', 'financial_manager'],
  'InvestorPayouts': ['super_admin', 'admin', 'financial_manager'],
  'CashJournal': ['super_admin', 'admin', 'booking_manager', 'financial_manager'],
  'FinancePnl': ['super_admin', 'admin', 'financial_manager'],
  'FinanceCashFlow': ['super_admin', 'admin', 'financial_manager'],
  'FinanceDebts': ['super_admin', 'admin', 'financial_manager'],
  'FinanceDeposits': ['super_admin', 'admin', 'financial_manager'],
  'Maintenance': ['super_admin', 'admin', 'technician'],
  'MaintenanceRepairs': ['super_admin', 'admin', 'technician'],
  'Fines': ['super_admin', 'admin', 'booking_manager'],
  'FinesAccidents': ['super_admin', 'admin', 'booking_manager'],
  'Contracts': ['super_admin', 'admin', 'booking_manager'],
  'Kpi': ['super_admin', 'admin'],
  'KpiBonuses': ['super_admin', 'admin'],
  'AnalyticsRevenue': ['super_admin', 'admin', 'financial_manager'],
  'AnalyticsExpenses': ['super_admin', 'admin', 'financial_manager'],
  'AnalyticsMarketing': ['super_admin', 'admin'],
  'AnalyticsProfitability': ['super_admin', 'admin', 'financial_manager', 'investor'],
  'AnalyticsSummary': ['super_admin', 'admin', 'financial_manager'],
  'SettingsOrganization': ['super_admin', 'admin'],
  'SettingsUsers': ['super_admin', 'admin'],
  'SettingsPricing': ['super_admin', 'admin'],
  'SettingsServices': ['super_admin', 'admin'],
  'SettingsExpenseCategories': ['super_admin', 'admin', 'financial_manager'],
  'SettingsLeadSources': ['super_admin', 'admin'],
  'SettingsBonusFormulas': ['super_admin', 'admin'],
  'SettingsContractTemplates': ['super_admin', 'admin'],
  'SettingsNotifications': ['super_admin', 'admin'],
  'SettingsIntegrations': ['super_admin', 'admin'],
  'Communications': ['super_admin', 'admin', 'booking_manager'],
  'Tasks': ['super_admin', 'admin', 'booking_manager'],
}

export const DEFAULT_HOME: Record<UserRole, string> = {
  super_admin: '/',
  admin: '/',
  booking_manager: '/',
  financial_manager: '/',
  investor: '/investor-portal',
  technician: '/maintenance',
}
