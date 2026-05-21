import type {
  Investor,
  CashJournalEntry,
  ExpenseCategory,
  AdditionalService,
  ServiceTask,
} from '@/types'

import type {
  VehicleStatus,
  RentalStatus,
  PrepaymentStatus,
  LeadStatus,
  LeadRejectionReason,
  VerificationStatus,
  PaymentMethod,
  OperationType,
} from '@/types'

// --- Local mock-only shapes (not backed by real API yet) ---

export interface DashboardKPIs {
  total_revenue: number
  revenue_change: number
  active_rentals: number
  fleet_total: number
  fleet_available: number
  utilization_percent: number
  utilization_change: number
  alerts_count: number
  outstanding_deposits: number
  avg_rental_duration: number
}

export interface MockVehicle {
  id: string
  nickname: string
  make: string
  model: string
  year: number
  category: string
  license_plate: string
  vin: string
  color: string
  status: VehicleStatus
  current_mileage: number
  fuel_level: number
  base_daily_rate: number
  purchase_price: number
  insurance_expiry: string
  technical_inspection_date: string
  photo_urls: string[]
  investor_id?: string
  investor_name?: string
  share_percentage?: number
  latitude?: number
  longitude?: number
  created_at: string
}

export interface MockRentalService {
  id: string
  service_id: string
  service_name: string
  quantity: number
  price: number
}

export interface MockRental {
  id: string
  vehicle_id: string
  vehicle_nickname?: string
  vehicle_license_plate?: string
  client_id: string
  client_name?: string
  client_phone?: string
  manager_id?: string
  manager_name?: string
  status: RentalStatus
  start_date: string
  end_date: string
  actual_return_date?: string
  daily_rate: string
  total_amount: string
  deposit_amount: string
  prepayment_amount: string
  prepayment_status: PrepaymentStatus
  additional_services: MockRentalService[]
  checkin_photos: string[]
  checkout_photos: string[]
  checkin_mileage?: number
  checkout_mileage?: number
  checkin_fuel?: number
  checkout_fuel?: number
  created_at: string
}

export interface MockClient {
  id: string
  full_name: string
  phone: string
  email?: string
  is_verified: boolean
  verification_status?: VerificationStatus
  trust_score: number
  trust_level: string
  total_rentals: number
  debt_balance: number
  is_blacklisted: boolean
  notes?: string
  created_at: string
}

export interface Lead {
  id: string
  source_id: string
  source_name: string
  manager_id?: string
  manager_name?: string
  contact_name: string
  contact_phone: string
  contact_email?: string
  client_id?: string
  status: LeadStatus
  rejection_reason?: LeadRejectionReason
  notes?: string
  created_at: string
  updated_at: string
}

export interface LeadSource {
  id: string
  name: string
  is_active: boolean
}

export interface MaintenanceSchedule {
  id: string
  vehicle_id: string
  vehicle_nickname: string
  type: string
  scheduled_date: string
  status: string
}

export const mockKPIs: DashboardKPIs = {
  total_revenue: 2_400_000,
  revenue_change: 12.5,
  active_rentals: 23,
  fleet_total: 80,
  fleet_available: 68,
  utilization_percent: 76.3,
  utilization_change: 3.2,
  alerts_count: 5,
  outstanding_deposits: 850_000,
  avg_rental_duration: 4.2,
}

// Mock alerts removed — dashboard now uses /dashboard/alerts API

export const mockVehicles: MockVehicle[] = [
  {
    id: 'v1',
    nickname: 'Камри 012',
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    category: 'Бизнес',
    license_plate: 'KA 012 TTA',
    vin: 'JTDKN3DU5A0123456',
    color: 'Белый',
    status: 'rented',
    current_mileage: 45230,
    fuel_level: 72,
    base_daily_rate: 18000,
    purchase_price: 15_000_000,
    insurance_expiry: '2026-12-15',
    technical_inspection_date: '2026-08-20',
    photo_urls: [],
    investor_id: 'inv1',
    investor_name: 'Адеке К.',
    share_percentage: 50,
    latitude: 43.238949,
    longitude: 76.945465,
    created_at: '2025-03-15T00:00:00Z',
  },
  {
    id: 'v2',
    nickname: 'Акцент 066',
    make: 'Hyundai',
    model: 'Accent',
    year: 2022,
    category: 'Эконом',
    license_plate: 'KA 066 BBA',
    vin: 'KMHCT4AE5NU123456',
    color: 'Серый',
    status: 'available',
    current_mileage: 62100,
    fuel_level: 45,
    base_daily_rate: 10000,
    purchase_price: 8_500_000,
    insurance_expiry: '2026-11-01',
    technical_inspection_date: '2026-07-15',
    photo_urls: [],
    investor_id: 'inv1',
    investor_name: 'Адеке К.',
    share_percentage: 100,
    latitude: 43.245,
    longitude: 76.935,
    created_at: '2024-11-01T00:00:00Z',
  },
  {
    id: 'v3',
    nickname: 'BMW 003',
    make: 'BMW',
    model: '320i',
    year: 2024,
    category: 'Премиум',
    license_plate: 'KA 003 GGA',
    vin: 'WBA3B1C51FK123456',
    color: 'Чёрный',
    status: 'rented',
    current_mileage: 18500,
    fuel_level: 88,
    base_daily_rate: 25000,
    purchase_price: 22_000_000,
    insurance_expiry: '2027-01-20',
    technical_inspection_date: '2026-09-10',
    photo_urls: [],
    investor_id: 'inv2',
    investor_name: 'Болат С.',
    share_percentage: 60,
    latitude: 43.255,
    longitude: 76.941,
    created_at: '2025-06-01T00:00:00Z',
  },
  {
    id: 'v4',
    nickname: 'Kia Rio 041',
    make: 'Kia',
    model: 'Rio',
    year: 2022,
    category: 'Эконом',
    license_plate: 'KA 041 DDA',
    vin: 'KNADM4A31N6123456',
    color: 'Красный',
    status: 'available',
    current_mileage: 71800,
    fuel_level: 60,
    base_daily_rate: 9000,
    purchase_price: 7_200_000,
    insurance_expiry: '2026-05-16',
    technical_inspection_date: '2026-06-01',
    photo_urls: [],
    latitude: 43.241,
    longitude: 76.952,
    created_at: '2024-09-15T00:00:00Z',
  },
  {
    id: 'v5',
    nickname: 'Соната 019',
    make: 'Hyundai',
    model: 'Sonata',
    year: 2023,
    category: 'Комфорт',
    license_plate: 'KA 019 EEA',
    vin: 'KMHL14JA5PA123456',
    color: 'Синий',
    status: 'in_service',
    current_mileage: 38600,
    fuel_level: 30,
    base_daily_rate: 14000,
    purchase_price: 12_000_000,
    insurance_expiry: '2026-10-05',
    technical_inspection_date: '2026-12-01',
    photo_urls: [],
    investor_id: 'inv2',
    investor_name: 'Болат С.',
    share_percentage: 50,
    created_at: '2025-01-20T00:00:00Z',
  },
  {
    id: 'v6',
    nickname: 'Тусон 008',
    make: 'Hyundai',
    model: 'Tucson',
    year: 2024,
    category: 'Кроссовер',
    license_plate: 'KA 008 FFA',
    vin: 'KM8J33A46PU123456',
    color: 'Белый',
    status: 'rented',
    current_mileage: 12300,
    fuel_level: 55,
    base_daily_rate: 20000,
    purchase_price: 18_000_000,
    insurance_expiry: '2027-03-01',
    technical_inspection_date: '2027-01-15',
    photo_urls: [],
    latitude: 43.235,
    longitude: 76.960,
    created_at: '2025-08-10T00:00:00Z',
  },
  {
    id: 'v7',
    nickname: 'Равон 055',
    make: 'Ravon',
    model: 'R4',
    year: 2021,
    category: 'Эконом',
    license_plate: 'KA 055 HHA',
    vin: 'KLAJB524GBB123456',
    color: 'Серебристый',
    status: 'available',
    current_mileage: 95200,
    fuel_level: 80,
    base_daily_rate: 7000,
    purchase_price: 5_500_000,
    insurance_expiry: '2026-06-30',
    technical_inspection_date: '2026-08-15',
    photo_urls: [],
    latitude: 43.250,
    longitude: 76.930,
    created_at: '2024-05-01T00:00:00Z',
  },
  {
    id: 'v8',
    nickname: 'Камри 025',
    make: 'Toyota',
    model: 'Camry',
    year: 2024,
    category: 'Бизнес',
    license_plate: 'KA 025 JJA',
    vin: 'JTDKN3DU5A0654321',
    color: 'Чёрный',
    status: 'reserved',
    current_mileage: 8900,
    fuel_level: 92,
    base_daily_rate: 20000,
    purchase_price: 17_000_000,
    insurance_expiry: '2027-02-28',
    technical_inspection_date: '2027-04-01',
    photo_urls: [],
    investor_id: 'inv1',
    investor_name: 'Адеке К.',
    share_percentage: 70,
    created_at: '2025-10-01T00:00:00Z',
  },
]

export const mockClients: MockClient[] = [
  {
    id: 'c1',
    full_name: 'Асанов Касым',
    phone: '+7 701 123 4567',
    email: 'asanov@mail.kz',
    is_verified: true,
    trust_score: 85,
    trust_level: 'trusted',
    total_rentals: 12,
    debt_balance: 0,
    is_blacklisted: false,
    created_at: '2025-06-01T00:00:00Z',
  },
  {
    id: 'c2',
    full_name: 'Петров Борис',
    phone: '+7 702 234 5678',
    email: 'petrov.b@gmail.com',
    is_verified: true,
    trust_score: 62,
    trust_level: 'verified',
    total_rentals: 5,
    debt_balance: 45000,
    is_blacklisted: false,
    created_at: '2025-09-15T00:00:00Z',
  },
  {
    id: 'c3',
    full_name: 'Сидорова Айгерим',
    phone: '+7 707 345 6789',
    is_verified: true,
    trust_score: 92,
    trust_level: 'vip',
    total_rentals: 24,
    debt_balance: 0,
    is_blacklisted: false,
    created_at: '2025-02-10T00:00:00Z',
  },
  {
    id: 'c4',
    full_name: 'Муратов Ержан',
    phone: '+7 700 456 7890',
    is_verified: false,
    trust_score: 30,
    trust_level: 'new',
    total_rentals: 1,
    debt_balance: 15000,
    is_blacklisted: false,
    created_at: '2026-04-20T00:00:00Z',
  },
  {
    id: 'c5',
    full_name: 'Иванченко Дмитрий',
    phone: '+7 771 567 8901',
    email: 'ivanchenko.d@mail.ru',
    is_verified: true,
    trust_score: 10,
    trust_level: 'new',
    total_rentals: 2,
    debt_balance: 0,
    is_blacklisted: true,
    notes: 'Повреждение кузова, отказ от оплаты',
    created_at: '2026-01-05T00:00:00Z',
  },
]

export const mockRentals: MockRental[] = [
  {
    id: 'r1',
    vehicle_id: 'v1',
    vehicle_nickname: 'Камри 012',
    vehicle_license_plate: 'KA 012 TTA',
    client_id: 'c1',
    client_name: 'Асанов Касым',
    client_phone: '+7 701 123 4567',
    manager_id: 'u2',
    manager_name: 'Алия М.',
    status: 'active',
    start_date: '2026-05-09T10:00:00Z',
    end_date: '2026-05-12T10:00:00Z',
    daily_rate: '18000',
    total_amount: '54000',
    deposit_amount: '30000',
    prepayment_amount: '54000',
    prepayment_status: 'full',
    additional_services: [],
    checkin_photos: [],
    checkout_photos: [],
    checkin_mileage: 45100,
    checkin_fuel: 85,
    created_at: '2026-05-08T14:00:00Z',
  },
  {
    id: 'r2',
    vehicle_id: 'v3',
    vehicle_nickname: 'BMW 003',
    vehicle_license_plate: 'KA 003 GGA',
    client_id: 'c3',
    client_name: 'Сидорова Айгерим',
    client_phone: '+7 707 345 6789',
    manager_id: 'u2',
    manager_name: 'Алия М.',
    status: 'active',
    start_date: '2026-05-10T09:00:00Z',
    end_date: '2026-05-14T09:00:00Z',
    daily_rate: '25000',
    total_amount: '100000',
    deposit_amount: '50000',
    prepayment_amount: '50000',
    prepayment_status: 'partial',
    additional_services: [
      { id: 'rs1', service_id: 's1', service_name: 'Детское кресло', quantity: 1, price: 2000 },
    ],
    checkin_photos: [],
    checkout_photos: [],
    checkin_mileage: 18400,
    checkin_fuel: 90,
    created_at: '2026-05-09T16:00:00Z',
  },
  {
    id: 'r3',
    vehicle_id: 'v6',
    vehicle_license_plate: 'KA 008 FFA',
    client_id: 'c2',
    client_name: 'Петров Борис',
    client_phone: '+7 702 234 5678',
    manager_id: 'u3',
    manager_name: 'Бекзат Т.',
    status: 'active',
    start_date: '2026-05-11T08:00:00Z',
    end_date: '2026-05-13T08:00:00Z',
    daily_rate: '20000',
    total_amount: '40000',
    deposit_amount: '20000',
    prepayment_amount: '20000',
    prepayment_status: 'partial',
    additional_services: [],
    checkin_photos: [],
    checkout_photos: [],
    created_at: '2026-05-10T18:00:00Z',
  },
  {
    id: 'r4',
    vehicle_id: 'v8',
    vehicle_license_plate: 'KA 025 JJA',
    client_id: 'c4',
    client_name: 'Муратов Ержан',
    client_phone: '+7 700 456 7890',
    status: 'pending',
    start_date: '2026-05-12T10:00:00Z',
    end_date: '2026-05-15T10:00:00Z',
    daily_rate: '20000',
    total_amount: '60000',
    deposit_amount: '30000',
    prepayment_amount: '0',
    prepayment_status: 'none',
    additional_services: [],
    checkin_photos: [],
    checkout_photos: [],
    created_at: '2026-05-11T09:00:00Z',
  },
  {
    id: 'r5',
    vehicle_id: 'v2',
    vehicle_license_plate: 'KA 066 BBA',
    client_id: 'c1',
    client_name: 'Асанов Касым',
    client_phone: '+7 701 123 4567',
    manager_id: 'u2',
    manager_name: 'Алия М.',
    status: 'completed',
    start_date: '2026-05-05T10:00:00Z',
    end_date: '2026-05-08T10:00:00Z',
    actual_return_date: '2026-05-08T11:30:00Z',
    daily_rate: '10000',
    total_amount: '30000',
    deposit_amount: '15000',
    prepayment_amount: '30000',
    prepayment_status: 'full',
    additional_services: [],
    checkin_photos: [],
    checkout_photos: [],
    checkin_mileage: 61800,
    checkout_mileage: 62050,
    checkin_fuel: 80,
    checkout_fuel: 45,
    created_at: '2026-05-04T12:00:00Z',
  },
]

export const mockLeads: Lead[] = [
  {
    id: 'l1',
    source_id: 'ls1',
    source_name: 'Instagram',
    manager_id: 'u2',
    manager_name: 'Алия М.',
    contact_name: 'Нурлан Б.',
    contact_phone: '+7 705 111 2233',
    status: 'new',
    created_at: '2026-05-11T11:00:00Z',
    updated_at: '2026-05-11T11:00:00Z',
  },
  {
    id: 'l2',
    source_id: 'ls2',
    source_name: 'OLX',
    manager_id: 'u3',
    manager_name: 'Бекзат Т.',
    contact_name: 'Айдос К.',
    contact_phone: '+7 700 222 3344',
    contact_email: 'aidos.k@mail.kz',
    status: 'in_progress',
    notes: 'Интересуется бизнес-классом на неделю',
    created_at: '2026-05-10T15:00:00Z',
    updated_at: '2026-05-11T09:00:00Z',
  },
  {
    id: 'l3',
    source_id: 'ls3',
    source_name: 'Звонок',
    contact_name: 'Марат С.',
    contact_phone: '+7 771 333 4455',
    status: 'booked',
    client_id: 'c4',
    created_at: '2026-05-09T10:00:00Z',
    updated_at: '2026-05-10T14:00:00Z',
  },
  {
    id: 'l4',
    source_id: 'ls4',
    source_name: '2GIS',
    contact_name: 'Жанна Т.',
    contact_phone: '+7 702 444 5566',
    status: 'rejected',
    rejection_reason: 'too_expensive',
    created_at: '2026-05-08T12:00:00Z',
    updated_at: '2026-05-09T11:00:00Z',
  },
  {
    id: 'l5',
    source_id: 'ls1',
    source_name: 'Instagram',
    contact_name: 'Данияр Р.',
    contact_phone: '+7 707 555 6677',
    status: 'new',
    created_at: '2026-05-11T13:00:00Z',
    updated_at: '2026-05-11T13:00:00Z',
  },
  {
    id: 'l6',
    source_id: 'ls5',
    source_name: 'Сайт',
    manager_id: 'u2',
    manager_name: 'Алия М.',
    contact_name: 'Алмас О.',
    contact_phone: '+7 700 666 7788',
    status: 'contract',
    created_at: '2026-05-07T09:00:00Z',
    updated_at: '2026-05-11T10:00:00Z',
  },
]

export const mockInvestors: Investor[] = [
  {
    id: 'inv1',
    organization_id: 'org1',
    full_name: 'Адеке Калиев',
    type_: 'partner',
    contact_phone: '+7 701 999 8877',
    contact_email: 'adeke@mail.kz',
    notes: null,
    user_id: null,
    created_at: '2025-01-10T00:00:00Z',
    updated_at: '2025-01-10T00:00:00Z',
  },
  {
    id: 'inv2',
    organization_id: 'org1',
    full_name: 'Болат Сериков',
    type_: 'shared',
    contact_phone: '+7 702 888 7766',
    contact_email: null,
    notes: null,
    user_id: null,
    created_at: '2025-04-20T00:00:00Z',
    updated_at: '2025-04-20T00:00:00Z',
  },
]

export const mockLeadSources: LeadSource[] = [
  { id: 'ls1', name: 'Instagram', is_active: true },
  { id: 'ls2', name: 'OLX', is_active: true },
  { id: 'ls3', name: 'Звонок', is_active: true },
  { id: 'ls4', name: '2GIS', is_active: true },
  { id: 'ls5', name: 'Сайт', is_active: true },
]

const EC_TS = '2026-01-01T00:00:00Z'
export const mockExpenseCategories: ExpenseCategory[] = [
  { id: 'ec1',  organization_id: 'org1', name: 'Мойка / химчистка',     type_: 'direct',   is_system: true, sort_order: 1,  is_active: true, created_at: EC_TS },
  { id: 'ec2',  organization_id: 'org1', name: 'Бензин',                type_: 'direct',   is_system: true, sort_order: 2,  is_active: true, created_at: EC_TS },
  { id: 'ec3',  organization_id: 'org1', name: 'Ремонт и запчасти',     type_: 'direct',   is_system: true, sort_order: 3,  is_active: true, created_at: EC_TS },
  { id: 'ec4',  organization_id: 'org1', name: 'Масло / тех. жидкости', type_: 'direct',   is_system: true, sort_order: 4,  is_active: true, created_at: EC_TS },
  { id: 'ec5',  organization_id: 'org1', name: 'GPS-оборудование',      type_: 'direct',   is_system: true, sort_order: 5,  is_active: true, created_at: EC_TS },
  { id: 'ec6',  organization_id: 'org1', name: 'Штрафы ГИБДД',          type_: 'direct',   is_system: true, sort_order: 6,  is_active: true, created_at: EC_TS },
  { id: 'ec7',  organization_id: 'org1', name: 'Страховка',             type_: 'direct',   is_system: true, sort_order: 7,  is_active: true, created_at: EC_TS },
  { id: 'ec8',  organization_id: 'org1', name: 'Маркетинг',             type_: 'overhead', is_system: true, sort_order: 8,  is_active: true, created_at: EC_TS },
  { id: 'ec9',  organization_id: 'org1', name: 'Зарплата менеджеров',   type_: 'overhead', is_system: true, sort_order: 9,  is_active: true, created_at: EC_TS },
  { id: 'ec10', organization_id: 'org1', name: 'Бонусы менеджеров',     type_: 'overhead', is_system: true, sort_order: 10, is_active: true, created_at: EC_TS },
  { id: 'ec11', organization_id: 'org1', name: 'Налоги',                type_: 'overhead', is_system: true, sort_order: 11, is_active: true, created_at: EC_TS },
  { id: 'ec12', organization_id: 'org1', name: 'Аренда офиса',          type_: 'overhead', is_system: true, sort_order: 12, is_active: true, created_at: EC_TS },
  { id: 'ec13', organization_id: 'org1', name: 'Юридические услуги',    type_: 'overhead', is_system: true, sort_order: 13, is_active: true, created_at: EC_TS },
]

export const mockAdditionalServices: AdditionalService[] = [
  { id: 's1', organization_id: 'org1', name: 'Детское кресло', price: '2000', is_active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: 's2', organization_id: 'org1', name: 'Подача автомобиля', price: '5000', is_active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: 's3', organization_id: 'org1', name: 'Водитель', price: '15000', is_active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: 's4', organization_id: 'org1', name: 'GPS-навигатор', price: '1500', is_active: true, created_at: '2026-01-01T00:00:00Z' },
]

export const mockCashJournal: CashJournalEntry[] = [
  {
    id: 'cj1',
    organization_id: 'org1',
    date: '2026-05-11',
    operation_type: 'income',
    rental_id: 'r1',
    vehicle_id: 'v1',
    expense_category_id: null,
    payment_method: 'kaspi',
    amount: '54000',
    description: 'Оплата аренды — Асанов К.',
    receipt_url: null,
    confirmed_by: null,
    confirmed_at: null,
    created_by: 'u2',
    created_at: '2026-05-11T10:30:00Z',
  },
  {
    id: 'cj2',
    organization_id: 'org1',
    date: '2026-05-11',
    operation_type: 'expense',
    vehicle_id: 'v2',
    rental_id: null,
    expense_category_id: 'ec1',
    payment_method: 'cash',
    amount: '3500',
    description: 'Мойка после возврата',
    receipt_url: null,
    confirmed_by: null,
    confirmed_at: null,
    created_by: 'u3',
    created_at: '2026-05-11T09:00:00Z',
  },
  {
    id: 'cj3',
    organization_id: 'org1',
    date: '2026-05-10',
    operation_type: 'income',
    rental_id: 'r2',
    vehicle_id: 'v3',
    expense_category_id: null,
    payment_method: 'card',
    amount: '50000',
    description: 'Предоплата аренды — Сидорова А.',
    receipt_url: null,
    confirmed_by: null,
    confirmed_at: null,
    created_by: 'u2',
    created_at: '2026-05-10T16:30:00Z',
  },
  {
    id: 'cj4',
    organization_id: 'org1',
    date: '2026-05-10',
    operation_type: 'expense',
    vehicle_id: 'v5',
    rental_id: null,
    expense_category_id: 'ec3',
    payment_method: 'bank_transfer',
    amount: '45000',
    description: 'Замена тормозных колодок',
    receipt_url: null,
    confirmed_by: null,
    confirmed_at: null,
    created_by: 'u1',
    created_at: '2026-05-10T14:00:00Z',
  },
]
