import {
  CalendarIcon,
  CurrencyRupeeIcon,
  HomeIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline'

export const workerNavigation = [
  { name: 'Dashboard', href: 'dashboard', icon: HomeIcon },
  { name: 'Attendance', href: 'attendance', icon: CalendarIcon },
  { name: 'Jobs', href: 'jobs', icon: WrenchScrewdriverIcon },
  { name: 'Payment', href: 'payment', icon:  CurrencyRupeeIcon}
]

export const adminNavigation = [
  { name: 'Dashboard', href: 'dashboard', icon: HomeIcon },
  { name: 'Jobs', href: 'jobs', icon: WrenchScrewdriverIcon },
  { name: 'Attendance', href: 'attendance', icon: CalendarIcon },
  { name: 'Workers', href: 'workers', icon: UserGroupIcon },
  { name: 'Payout', href: 'payout', icon: CurrencyRupeeIcon }
]
