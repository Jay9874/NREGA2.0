import {
  CalendarIcon,
  CurrencyRupeeIcon,
  FolderIcon,
  HomeIcon,
  UserGroupIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

export const workerNavigation = [
  { name: "Dashboard", href: "dashboard", icon: HomeIcon},
  { name: "Attendance", href: "attendance", icon: UsersIcon},
  { name: "Jobs", href: "jobs", icon: FolderIcon},
  { name: "Payment", href: "payment", icon: CalendarIcon},
];


export const adminNavigation = [
  { name: "Dashboard", href: "dashboard", icon: HomeIcon},
  { name: "Add Job", href: "addjob", icon: FolderIcon},
  { name: "Attendance", href: "attendance", icon: CalendarIcon},
  { name: "Employees", href: "employee", icon: UserGroupIcon},
  { name: "Payout", href: "payout", icon: CurrencyRupeeIcon},
]
