import { ScaleIcon } from "@heroicons/react/24/outline";
import RecentPayment from "../RecentPayment";
import {
  MapPinIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
} from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";

const transactions = [
  {
    id: 1,
    name: "Payment from Kedraband Panchayat",
    href: "#",
    amount: "$20,000",
    currency: "USD",
    status: "success",
    date: "July 11, 2020",
    datetime: "2020-07-11",
  },
  // More transactions...
];

const cards = [
  { name: "Attendance", href: "/attendance", icon: CalendarDaysIcon, amount: "89/100" },
  { name: "Working on", href: "/jobs", icon: BuildingOfficeIcon, amount: "Amritsarovar, Hadipur"},
  { name: "Account balance", href: "/payment", icon: ScaleIcon, amount: "$30,659.45" },
  // More items...
];

export default function Dashboard() {
  return (
    // <main className="flex-1 pb-8">
    // {/* Page header */}
    // <div className="bg-white shadow">
    //   <div className="px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
    //     <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
    //       <div className="min-w-0 flex-1">
    //         {/* Profile */}
    //         <div className="flex items-center">
    //           <img
    //             className="hidden h-16 w-16 rounded-full sm:block"
    //             src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    //             alt=""
    //           />
    //           <div>
    //             <div className="flex items-center">
    //               <img
    //                 className="h-16 w-16 rounded-full sm:hidden"
    //                 src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    //                 alt=""
    //               />
    //               <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9">
    //                 Good morning, Jay Prakash
    //               </h1>
    //             </div>
    //             <dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
    //               <dt className="sr-only">Location</dt>
    //               <dd className="flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6">
    //                 <MapPinIcon
    //                   className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
    //                   aria-hidden="true"
    //                 />
    //                 Bachhwara, Kedrabad
    //               </dd>
    //               <dt className="sr-only">Account status</dt>
    //               <dd className="mt-3 flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6 sm:mt-0">
    //                 <CheckCircleIcon
    //                   className="mr-1.5 h-5 w-5 flex-shrink-0 text-green-400"
    //                   aria-hidden="true"
    //                 />
    //                 MGNREGA ID: MG1434
    //               </dd>
    //             </dl>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>

    // <div className="mt-8">
    //   <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
    //     <h2 className="text-lg font-medium leading-6 text-gray-900">
    //       Overview
    //     </h2>
    //     <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
    //       {/* Card */}
    //       {cards.map((card) => (
    //         <div
    //           key={card.name}
    //           className="overflow-hidden rounded-lg bg-white shadow flex flex-col justify-between"
    //         >
    //           <div className="p-5">
    //             <div className="flex items-center">
    //               <div className="flex-shrink-0">
    //                 <card.icon
    //                   className="h-6 w-6 text-gray-400"
    //                   aria-hidden="true"
    //                 />
    //               </div>
    //               <div className="ml-5 w-0 flex-1">
    //                 <dl>
    //                   <dt className="truncate text-sm font-medium text-gray-500">
    //                     {card.name}
    //                   </dt>
    //                   <dd>
    //                     <div className="text-lg font-medium text-gray-900">
    //                       {card.amount}
    //                     </div>
    //                   </dd>
    //                 </dl>
    //               </div>
    //             </div>
    //           </div>
    //           <div className="bg-gray-50 px-5 py-3">
    //             <div className="text-sm">
    //               <Link
    //                 to={card.href}
    //                 className="font-medium text-cyan-700 hover:text-cyan-900"
    //               >
    //                 View all
    //               </Link>
    //             </div>
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   </div>

    //   {/* Recent activity */}
    //   {/* <RecentPayment heading={"Recent Activity"} recentActivity={transactions} /> */}
    // </div>
    // </main>
    <div>Building this tab. Check out current work in Employees tab.</div>
  )
}
