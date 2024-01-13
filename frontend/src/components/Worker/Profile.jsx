import User from "../../assets/images/User.png";
import "../../App.css";
import { PaperClipIcon } from "@heroicons/react/20/solid";
export default function Profile({ setSidebarOpen }) {
  return (
    <main>
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Your Profile
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Personal, Bank and contact details.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">
                Profile Image
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                <img
                  className="h-16 w-16 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900">Jay Prakash Sharma</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Age</dt>
              <dd className="mt-1 text-sm text-gray-900">20</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Father Name</dt>
              <dd className="mt-1 text-sm text-gray-900">Jagdish Sharma</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Village</dt>
              <dd className="mt-1 text-sm text-gray-900">
                Bachhwara, Kedrabad, Hadipur
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Email address
              </dt>
              <dd className="mt-1 text-sm text-gray-900">jay.gdsc@gmail.com</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">MGNREGA ID</dt>
              <dd className="mt-1 text-sm text-gray-900">MG1434</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Bank Account Number
              </dt>
              <dd className="mt-1 text-sm text-gray-900">021224001178</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Aadhaar Number
              </dt>
              <dd className="mt-1 text-sm text-gray-900">899592480342</dd>
            </div>
            <div className="mt-4 sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">
                Please Note*
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                If there is any wrong information here, please contact your Gram
                Panchayat Office for correction.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </main>
  );
}
