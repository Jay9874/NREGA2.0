import Dropdown from "../Dropdown";
import { useState } from "react";
import { dropDown } from "../../utils/locationDrops";
import { TableRow } from "../TableRow";
const cards = [
  { name: "District" },
  { name: "Block" },
  { name: "Panchayat" },
];

const tableData = [
  {
    id: 1,
    Work: "Amristsrovar",
    href: "#",
    Status: "absent",
    Date: "July 11, 2020",
  },
  {
    id: 2,
    Work: "Nahar widening",
    href: "#",
    Status: "present",
    Date: "Aug, 12, 2023",
  },
];
const tableHeading = [
  { name: "Work" },
  { name: "Date" },
  { name: "Status" },
];

const statusStyles = {
  present: "bg-green-100 text-green-800",
  absent: "bg-red-100 text-gray-800",
};

const Attendance = () => {
  const [foundAttendance, setFoundAttendance] = useState(tableData); //worker state
  return (
    <main className="flex-1 pb-8">
      <div className="px-4 py-6 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
        <div className="border-b border-gray-200 pb-5">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Your Attendance
          </h3>
          <p className="mt-2 max-w-4xl text-sm text-gray-500">
            Change Block, Panchayat, District and Date to view specific
            attendance.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => (
            <div key={index}>
              <Dropdown options={dropDown[`${card.name}`]} label={card.name} />
            </div>
          ))}
        </div>
      </div>
      <h2 className="mx-auto mt-8 max-w-6xl px-4 text-lg font-medium leading-6 text-gray-900 sm:px-6 lg:px-8">
        Found Results
      </h2>

      {foundAttendance.length === 0 ? (
        <div className="mx-auto max-w-7xl px-6 text-center pt-4">
          <div className="rounded-xl border-0 ring-1 ring-gray-100 h-24 flex items-center justify-center">
            <p className="mt-2 text-lg font-medium text-black text-opacity-50">
              Seems nothing here, try changing filters.
            </p>
          </div>
        </div>
      ) : (
        <TableRow tableHeading={tableHeading} tableData={tableData} statusStyles={statusStyles} />
      )}
    </main>
  );
};

export default Attendance;
