import {
  CalendarIcon,
  CurrencyRupeeIcon,
  FolderIcon,
  HomeIcon,
  UserGroupIcon,
  UsersIcon,
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
  { name: 'Add Job', href: 'addjob', icon: WrenchScrewdriverIcon },
  { name: 'Attendance', href: 'attendance', icon: CalendarIcon },
  { name: 'Employees', href: 'employee', icon: UserGroupIcon },
  { name: 'Payout', href: 'payout', icon: CurrencyRupeeIcon }
]
