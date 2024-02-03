import Dropdown from "../Dropdown";
import { filterLoop } from "../../utils/locationDrops";
import { TableRow } from "../TableRow";
import { useWorkerStore } from "../../api/store";
import { useEffect, useState } from "react";
import { supabase } from "../../api";
import { toast } from "sonner";

const statusStyles = {
  present: "bg-green-100 text-green-800",
  absent: "bg-red-100 text-gray-800",
};
const tableHeading = [{ name: "Work" }, { name: "Presence" }];

export default function Attendance() {
  const {
    attendances,
    setAttendance,
    setAttendanceNull,
    locations,
    dataLoaded,
    jobs,
  } = useWorkerStore();
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [panchayats, setPanchayats] = useState([]);
  const [selected, setSelected] = useState({
    state: "",
    district: "",
    block: "",
    panchayat: "",
  });
  const filterLoopcallback = [
    { callback: setDistricts },
    { callback: setBlocks },
    { callback: setPanchayats },
  ];

  // filter only the required locations
  async function filterData(id, value) {
    await Promise.all(locations.map((location) => location));
    const newLocations = locations.filter(
      (location) => location[filterLoop[id].landmark] === value
    );
    return newLocations;
  }

  // looping to fill child filters
  async function getLandmarkData(id, value) {
    filterLoop[id].landmarkValue = value;
    filterLoop[id].callback = filterLoopcallback[id].callback;
    for (let i = id; i < 3; i++) {
      const landmarkValue = i === id ? value : filterLoop[i - 1].landmarkValue;
      const newLocations = await filterData(i, landmarkValue);
      const fetchedLandmarkData = await Promise.all(
        newLocations.map((location, index) => {
          return { id: index, value: location[filterLoop[i].toFetch] };
        })
      );
      filterLoopcallback[i].callback(fetchedLandmarkData);
      setSelected((prev) => ({
        ...prev,
        [filterLoop[i].toFetch]: fetchedLandmarkData[0]?.value,
      }));
      filterLoop[i].fetchedDatas = fetchedLandmarkData;
      filterLoop[i].landmarkValue = fetchedLandmarkData[0].value;
    }
    // handlePanchayatChange(3, filterLoop[3].landmarkValue);
  }

  // Initialize filter
  async function initFilter() {
    const fetchedStates = await Promise.all(
      locations.map((location, index) => {
        return { id: index, value: location.state };
      })
    );
    setStates(fetchedStates);
    setSelected((prev) => ({ ...prev, state: fetchedStates[0].value }));
    getLandmarkData(0, fetchedStates[0].value);
  }

  // Handle filter change
  function handleChange(id, value) {
    filterLoopcallback[id].callback((prev)=>prev);
    setSelected((prev) => ({ ...prev, [filterLoop[id].landmark]: value }));
    getLandmarkData(id + 1, value);
  }

  // fill the attendances
  async function handlePanchayatChange(id, value) {
    console.log("panchayat", value);
    console.log(selected);
    setAttendanceNull();
    await supabase
      .from("locations")
      .select("*")
      .eq("state", selected.state)
      .eq("district", selected.district)
      .eq("block", selected.block)
      .eq("panchayat", value)
      .then(({ data, error }) => {
        console.log(data);
        if (error) return toast.error(error.message);
        const filterAttendane = jobs.filter(
          (job) =>
            job.location_id.id === data[0]?.id && job.Status === "enrolled"
        );
        filterAttendane.forEach((attendance) => setAttendance(attendance));
      });

    setSelected((prev) => ({ ...prev, panchayat: value }));
  }

  useEffect(() => {
    if (dataLoaded) {
      initFilter();
    }
  }, [dataLoaded]);

  return (
    <main className="flex-1 pb-8">
      <div className="px-4 py-6 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
        <div className="border-b border-gray-200 pb-5">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Your Attendance
          </h3>
          <p className="mt-2 max-w-4xl text-sm text-gray-500">
            Across locations. Change State, Block, District and Panchayat to
            view specific attendance.
          </p>
        </div>
      </div>

      {/* Filtering seletions */}
      {dataLoaded && (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <Dropdown
                options={states}
                label="state"
                selected={selected.state}
                onChange={handleChange}
                id={0}
              />
            </div>
            <div>
              <Dropdown
                options={districts}
                label="district"
                selected={selected.district}
                onChange={handleChange}
                id={1}
              />
            </div>
            <div>
              <Dropdown
                options={blocks}
                label="block"
                selected={selected.block}
                onChange={handleChange}
                id={2}
              />
            </div>
            <div>
              <Dropdown
                options={panchayats}
                label="panchayat"
                selected={selected.panchayat}
                id={3}
                onChange={handlePanchayatChange}
              />
            </div>
          </div>
        </div>
      )}

      {/* Filter Results */}
      <h2 className="mx-auto mt-8 max-w-6xl px-4 text-lg font-medium leading-6 text-gray-900 sm:px-6 lg:px-8">
        Found Attendance
      </h2>

      {attendances?.length === 0 ? (
        <div className="mx-auto max-w-7xl px-12 text-center pt-4">
          <div className="rounded-xl border ring-gray-100 h-24 flex items-center justify-center">
            <p className="mt-2 text-lg font-medium text-black text-opacity-50">
              Seems nothing here, try changing filters.
            </p>
          </div>
        </div>
      ) : (
        <TableRow
          tableHeading={tableHeading}
          tableData={attendances}
          statusStyles={statusStyles}
        />
      )}
    </main>
  );
}
