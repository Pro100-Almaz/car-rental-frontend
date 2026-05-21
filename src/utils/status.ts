import type { RentalStatus, VehicleStatus, DepositStatus, PrepaymentStatus, PaymentMethod } from '@/types'

// --- Rental Status ---

export function rentalStatusLabel(s: RentalStatus): string {
  const map: Record<RentalStatus, string> = {
    pending: 'Ожидание', confirmed: 'Подтверждено', active: 'Активна',
    returning: 'Возврат', completed: 'Завершена', cancelled: 'Отменена', disputed: 'Спор',
  }
  return map[s] ?? s
}

export function rentalStatusDot(s: RentalStatus): string {
  const map: Record<RentalStatus, string> = {
    pending: 'bg-warning-500', confirmed: 'bg-brand-500', active: 'bg-success-500',
    returning: 'bg-orange-500', completed: 'bg-gray-400', cancelled: 'bg-error-500',
    disputed: 'bg-theme-purple-500',
  }
  return map[s] ?? 'bg-gray-400'
}

export function rentalStatusStyle(s: RentalStatus): string {
  const map: Record<RentalStatus, string> = {
    pending:   'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400',
    confirmed: 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400',
    active:    'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400',
    returning: 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400',
    completed: 'bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400',
    cancelled: 'bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400',
    disputed:  'bg-theme-purple-500/10 text-theme-purple-500',
  }
  return map[s] ?? 'bg-gray-100 text-gray-600'
}

// --- Vehicle Status ---

export function vehicleStatusLabel(s: VehicleStatus): string {
  const map: Record<VehicleStatus, string> = {
    available: 'Свободен', rented: 'В аренде', reserved: 'Забронирован',
    returning: 'Возврат', in_service: 'На ТО', in_wash: 'На мойке',
    decommissioned: 'Списан', sold: 'Продан',
  }
  return map[s] ?? s
}

export function vehicleStatusDot(s: VehicleStatus): string {
  const map: Record<VehicleStatus, string> = {
    available: 'bg-success-500', rented: 'bg-error-500', reserved: 'bg-warning-500',
    returning: 'bg-orange-500', in_service: 'bg-blue-light-500', in_wash: 'bg-brand-500',
    decommissioned: 'bg-gray-400', sold: 'bg-gray-600',
  }
  return map[s] ?? 'bg-gray-400'
}

export function vehicleStatusStyle(s: VehicleStatus): string {
  const map: Record<VehicleStatus, string> = {
    available:      'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400',
    rented:         'bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400',
    reserved:       'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400',
    returning:      'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400',
    in_service:     'bg-blue-light-50 text-blue-light-700 dark:bg-blue-light-500/10 dark:text-blue-light-400',
    in_wash:        'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400',
    decommissioned: 'bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400',
    sold:           'bg-gray-200 text-gray-700 dark:bg-gray-600/10 dark:text-gray-500',
  }
  return map[s] ?? 'bg-gray-100 text-gray-600'
}

// --- Deposit Status ---

export function depositStatusLabel(s: DepositStatus): string {
  const map: Record<DepositStatus, string> = {
    pending: 'Ожидает', held: 'Удержан', returned: 'Возвращён', forfeited: 'Изъят',
  }
  return map[s] ?? s
}

export function depositStatusStyle(s: DepositStatus): string {
  const map: Record<DepositStatus, string> = {
    pending:   'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400',
    held:      'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400',
    returned:  'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400',
    forfeited: 'bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400',
  }
  return map[s] ?? 'bg-gray-100 text-gray-600'
}

// --- Prepayment Status ---

export function prepaymentLabel(s: PrepaymentStatus): string {
  const map: Record<PrepaymentStatus, string> = {
    none: 'Не оплачено', partial: 'Частично', full: 'Оплачено',
  }
  return map[s] ?? s
}

export function prepaymentStyle(s: PrepaymentStatus): string {
  const map: Record<PrepaymentStatus, string> = {
    none:    'bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400',
    partial: 'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400',
    full:    'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400',
  }
  return map[s] ?? 'bg-gray-100 text-gray-600'
}

// --- Trust Level ---

export function trustLevelLabel(l: string): string {
  const map: Record<string, string> = {
    new: 'Новый', regular: 'Постоянный', trusted: 'Надёжный', vip: 'VIP', risky: 'Рисковый',
  }
  return map[l] ?? l
}

export function trustLevelStyle(l: string): string {
  const map: Record<string, string> = {
    new:     'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
    regular: 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400',
    trusted: 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400',
    vip:     'bg-theme-purple-500/10 text-theme-purple-500',
    risky:   'bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400',
  }
  return map[l] ?? 'bg-gray-100 text-gray-600'
}

// --- Verification Status ---

export function verificationLabel(s: string): string {
  const map: Record<string, string> = {
    unverified: 'Не верифицирован', pending: 'На проверке', verified: 'Верифицирован', rejected: 'Отклонён',
  }
  return map[s] ?? s
}

export function verificationStyle(s: string): string {
  const map: Record<string, string> = {
    unverified: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
    pending:    'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400',
    verified:   'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400',
    rejected:   'bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400',
  }
  return map[s] ?? 'bg-gray-100 text-gray-600'
}

// --- Payment ---

export function paymentTypeLabel(t: string): string {
  const map: Record<string, string> = {
    payment: 'Оплата', refund: 'Возврат', deposit: 'Залог', penalty: 'Штраф',
  }
  return map[t] ?? t
}

export function paymentMethodLabel(m: PaymentMethod): string {
  const map: Record<PaymentMethod, string> = {
    cash: 'Наличные', kaspi: 'Kaspi', card: 'Карта', wallet: 'Кошелёк', bank_transfer: 'Перевод',
  }
  return map[m] ?? m
}

export function paymentStatusLabel(s: string): string {
  const map: Record<string, string> = {
    completed: 'Выполнен', pending: 'Ожидание', failed: 'Ошибка', cancelled: 'Отменён',
  }
  return map[s] ?? s
}

export function paymentStatusStyle(s: string): string {
  const map: Record<string, string> = {
    completed: 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400',
    pending:   'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400',
    failed:    'bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400',
    cancelled: 'bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400',
  }
  return map[s] ?? 'bg-gray-100 text-gray-600'
}
