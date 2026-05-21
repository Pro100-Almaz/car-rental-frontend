// AutoFleet Domain Types — aligned with backend API schemas

// --- Enums ---

export type VehicleStatus =
  | 'available'
  | 'reserved'
  | 'rented'
  | 'returning'
  | 'in_service'
  | 'in_wash'
  | 'decommissioned'
  | 'sold'

export type RentalStatus =
  | 'pending'
  | 'confirmed'
  | 'active'
  | 'returning'
  | 'completed'
  | 'cancelled'
  | 'disputed'

export type PrepaymentStatus = 'none' | 'partial' | 'full'

export type LeadStatus =
  | 'new'
  | 'in_progress'
  | 'booked'
  | 'contract'
  | 'completed'
  | 'rejected'

export type LeadRejectionReason =
  | 'no_answer'
  | 'too_expensive'
  | 'changed_mind'
  | 'no_suitable_car'
  | 'other'

export type InvestorType = 'own' | 'partner' | 'shared'

export type PayoutStatus = 'calculated' | 'approved' | 'paid'

export type OperationType = 'income' | 'expense'

export type PaymentMethod = 'cash' | 'kaspi' | 'card' | 'wallet' | 'bank_transfer'

export type ExpenseCategoryType = 'direct' | 'overhead'

export type BonusStatus = 'calculated' | 'approved' | 'paid'

export type InsuranceStatus =
  | 'not_filed'
  | 'filed'
  | 'in_review'
  | 'approved'
  | 'rejected'
  | 'paid'

export type DebtStatus = 'active' | 'overdue' | 'paid' | 'written_off'

export type TaskStatus = 'created' | 'assigned' | 'in_progress' | 'completed'
export type TaskPriority = 'low' | 'normal' | 'high' | 'urgent'

export type FineStatus = 'issued' | 'disputed' | 'paid' | 'cancelled'

export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'booking_manager'
  | 'financial_manager'
  | 'investor'
  | 'technician'

export type DepositStatus = 'pending' | 'held' | 'returned' | 'forfeited'

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected'

// --- Backend API Response Wrapper ---

export interface ListResponse<T> {
  items: T[]
  total: number
  limit: number
  offset: number
}

export interface UsersListResponse {
  users: UserProfile[]
  total: number
  limit: number
  offset: number
}

// --- Core Models (match backend QM shapes) ---

export interface UserProfile {
  id: string
  organization_id: string
  email: string
  phone: string | null
  role: UserRole
  first_name: string
  last_name: string
  is_active: boolean
  last_login_at: string | null
  branch_id: string | null
  created_at: string
  updated_at: string
}

export interface Vehicle {
  id: string
  organization_id: string
  nickname: string | null
  make: string
  model: string
  year: number
  vin: string | null
  license_plate: string
  color: string
  category: string
  status: VehicleStatus
  fuel_type: string
  transmission: string
  current_mileage: number
  purchase_price: string | null
  purchase_date: string | null
  insurance_expiry: string | null
  inspection_expiry: string | null
  gps_device_id: string | null
  current_latitude: string | null
  current_longitude: string | null
  current_fuel_level: number | null
  branch_id: string | null
  photos: string[] | null
  features: Record<string, unknown> | null
  pricing_override: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface Rental {
  id: string
  organization_id: string
  vehicle_id: string
  client_id: string
  manager_id: string | null
  status: RentalStatus
  booking_type: string
  booked_at: string
  scheduled_start: string
  scheduled_end: string
  actual_start: string | null
  actual_end: string | null
  base_rate: string
  rate_type: string
  estimated_total: string
  actual_total: string | null
  discount_code: string | null
  discount_amount: string
  late_fee: string
  mileage_surcharge: string
  fuel_charge: string
  wash_fee: string
  damage_charge: string
  fine_charge: string
  deposit_type: string
  deposit_amount: string
  deposit_status: DepositStatus
  deposit_refund_amount: string
  checkin_data: Record<string, unknown> | null
  checkout_data: Record<string, unknown> | null
  invoice_url: string | null
  cancellation_reason: string | null
  prepayment_amount: string
  prepayment_status: PrepaymentStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  organization_id: string
  phone: string
  email: string | null
  first_name: string
  last_name: string
  id_document_url: string | null
  license_front_url: string | null
  license_back_url: string | null
  verification_status: VerificationStatus
  trust_score: number
  trust_level: string
  is_blacklisted: boolean
  blacklist_reason: string | null
  wallet_balance: string
  debt_balance: string
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface Investor {
  id: string
  organization_id: string
  full_name: string
  type_: InvestorType
  contact_phone: string | null
  contact_email: string | null
  user_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface InvestorVehicle {
  id: string
  investor_id: string
  vehicle_id: string
  share_percentage: string
  profit_distribution_type: string
  created_at: string
}

export interface InvestorPayout {
  id: string
  organization_id: string
  investor_id: string
  period_month: string
  calculated_profit: string
  share_amount: string
  status: PayoutStatus
  paid_at: string | null
  notes: string | null
  created_at: string
}

export interface InvestorVehiclePnl {
  vehicle_id: string
  share_percentage: string
  total_revenue: string
  total_expenses: string
  net_profit: string
  investor_share: string
  utilization_percent: string
}

export interface InvestorPnl {
  investor_id: string
  period_from: string
  period_to: string
  total_revenue: string
  total_expenses: string
  total_net_profit: string
  total_investor_share: string
  vehicles: InvestorVehiclePnl[]
}

export interface CashJournalEntry {
  id: string
  organization_id: string
  date: string
  operation_type: OperationType
  vehicle_id: string | null
  rental_id: string | null
  expense_category_id: string | null
  payment_method: PaymentMethod
  amount: string
  description: string | null
  receipt_url: string | null
  confirmed_by: string | null
  confirmed_at: string | null
  created_by: string
  created_at: string
}

export interface CashJournalBalance {
  total_income: string
  total_expense: string
  balance: string
}

export interface ExpenseCategory {
  id: string
  organization_id: string
  name: string
  type_: ExpenseCategoryType
  is_system: boolean
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface Fine {
  id: string
  organization_id: string
  vehicle_id: string
  rental_id: string | null
  client_id: string | null
  fine_type: string
  amount: string
  description: string | null
  fine_date: string
  document_url: string | null
  status: FineStatus
  created_at: string
  updated_at: string
}

export interface ServiceTask {
  id: string
  organization_id: string
  vehicle_id: string
  rental_id: string | null
  assigned_to: string | null
  task_type: string
  priority: TaskPriority
  status: TaskStatus
  description: string | null
  estimated_cost: string | null
  actual_cost: string | null
  proof_photos: string[] | null
  notes: string | null
  due_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface AdditionalService {
  id: string
  organization_id: string
  name: string
  price: string
  is_active: boolean
  created_at: string
}

export interface RentalService {
  id: string
  rental_id: string
  additional_service_id: string
  quantity: number
  unit_price: string
  total_price: string
  created_at: string
}

export interface VehiclePricing {
  id: string
  vehicle_id: string
  name: string
  rate_type: string
  amount: string
  is_active: boolean
  valid_from: string
  valid_to: string | null
  created_at: string
}

export interface Branch {
  id: string
  organization_id: string
  name: string
  address: string | null
  phone: string | null
  created_at: string
}

export interface PaymentTransaction {
  id: string
  organization_id: string
  rental_id: string | null
  client_id: string | null
  amount: string
  payment_method: PaymentMethod
  type_: string
  status: string
  created_at: string
}

// --- Vehicle Detail Types ---

export interface VehicleFinancials {
  total_revenue: string
  total_expenses: string
  net_profit: string
  total_rentals: number
  days_rented: number
  days_in_period: number
  utilization_percent: string
}

export interface TimelineEvent {
  id: string
  event_type: 'rental' | 'expense' | 'fine' | 'service_task'
  event_date: string
  title: string
  description: string | null
  amount: string | null
  metadata: Record<string, unknown> | null
}

export interface VehicleDocument {
  id: string
  vehicle_id: string
  document_type: string
  name: string
  url: string
  expiry_date: string | null
  created_at: string
}

export interface BulkStatusResult {
  results: Array<{
    vehicle_id: string
    success: boolean
    error: string | null
  }>
  succeeded: number
  failed: number
}

// --- Vehicle Categories ---

export interface VehicleCategory {
  id: string
  organization_id: string
  name: string
  sort_order: number
  is_active: boolean
  created_at: string
}

// --- Calendar & Returns Queue ---

export interface CalendarSlot {
  rental_id: string
  client_id: string
  client_name: string
  status: RentalStatus
  scheduled_start: string
  scheduled_end: string
}

export interface CalendarVehicle {
  vehicle_id: string
  nickname: string | null
  license_plate: string
  make: string
  model: string
  category: string
  slots: CalendarSlot[]
}

export interface RentalCalendarResponse {
  vehicles: CalendarVehicle[]
  month: string
}

export interface ReturnsQueueItem {
  rental_id: string
  vehicle_id: string
  vehicle_nickname: string | null
  vehicle_license_plate: string
  client_id: string
  client_name: string
  status: RentalStatus
  scheduled_start: string
  scheduled_end: string
  estimated_total: string
  is_overdue: boolean
}

export interface ReturnsQueueResponse {
  items: ReturnsQueueItem[]
  total: number
}

// --- Dashboard Types ---

export interface KpiValue {
  value: string | number
  previous_value: string | number
  change_percent: string | null
}

export interface FleetStatus {
  available: number
  rented: number
  reserved: number
  in_service: number
  other: number
  total: number
}

export interface DashboardKpis {
  period_from: string
  period_to: string
  total_revenue: KpiValue
  total_expenses: KpiValue
  net_profit: KpiValue
  fleet_utilization: KpiValue
  active_rentals_count: KpiValue
  outstanding_debts: KpiValue
  fleet_status: FleetStatus
}

export interface OverdueReturnAlert {
  rental_id: string
  vehicle_nickname: string | null
  license_plate: string
  client_name: string
  scheduled_end: string
  days_overdue: number
}

export interface ExpiringDocumentAlert {
  vehicle_id: string
  vehicle_nickname: string | null
  license_plate: string
  document_type: 'insurance' | 'inspection'
  expiry_date: string
  days_remaining: number
}

export interface ClientDebtAlert {
  client_id: string
  client_name: string
  phone: string
  debt_balance: string
}

export interface DashboardAlerts {
  overdue_returns: OverdueReturnAlert[]
  expiring_documents: ExpiringDocumentAlert[]
  clients_with_debt: ClientDebtAlert[]
  total_alerts: number
}

export interface ActiveRentalItem {
  rental_id: string
  vehicle_id: string
  vehicle_nickname: string | null
  license_plate: string
  client_id: string
  client_name: string
  scheduled_end: string
  hours_remaining: number
}

export interface ReturnTodayItem {
  rental_id: string
  vehicle_id: string
  vehicle_nickname: string | null
  license_plate: string
  client_name: string
  scheduled_end: string
}

export interface DashboardActiveRentals {
  active_rentals: ActiveRentalItem[]
  returns_today_count: number
  returns_today: ReturnTodayItem[]
}

export interface RevenueDataPoint {
  date: string
  revenue: string
}

export interface DashboardRevenueChart {
  period_from: string
  period_to: string
  data_points: RevenueDataPoint[]
  total: string
}

// --- Organization & Settings ---

export interface OrganizationSettings {
  logo_url?: string | null
  address?: string | null
  phone?: string | null
  email?: string | null
  timezone?: string
  currency?: string
  date_format?: string
}

export interface Organization {
  id: string
  name: string
  slug: string
  settings: OrganizationSettings | null
  subscription_plan: string
  created_at: string
  updated_at: string
}

// --- Financial Report Types ---

export type ReportType = 'pnl' | 'cash-flow' | 'vehicles-comparison'

export interface ExpenseCategoryLine {
  category_id: string | null
  category_name: string
  amount: string
}

export interface CompanyPnl {
  period_from: string
  period_to: string
  total_revenue: string
  returns_and_discounts: string
  net_revenue: string
  direct_expenses: ExpenseCategoryLine[]
  total_direct_expenses: string
  marginal_profit: string
  overhead_expenses: ExpenseCategoryLine[]
  total_overhead_expenses: string
  operating_profit: string
  taxes: string
  net_profit: string
  investor_payouts: string
  retained_profit: string
}

export interface CashFlowDay {
  date: string
  income: string
  expense: string
  net: string
}

export interface CashFlow {
  period_from: string
  period_to: string
  opening_balance: string
  total_income: string
  total_expense: string
  closing_balance: string
  daily_breakdown: CashFlowDay[]
}

export interface VehicleExpenseLine {
  category_name: string
  amount: string
}

export interface VehicleComparisonItem {
  vehicle_id: string
  nickname: string | null
  license_plate: string
  total_revenue: string
  expenses: VehicleExpenseLine[]
  total_expenses: string
  net_profit: string
  utilization_percent: string
}

export interface VehiclesComparison {
  period_from: string
  period_to: string
  expense_categories: string[]
  vehicles: VehicleComparisonItem[]
}
