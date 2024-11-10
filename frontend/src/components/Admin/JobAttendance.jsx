import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid'
import Toggle from './Toggle'

const work = [
  {
    name: 'Tree Plantation',
    title: 'Kasba GP 129.8 N',
    date: 'Today',
    email: 'janecooper@example.com',
    telephone: '+1-202-555-0170',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
  }
  // More people...
]

const workers = [
  {
    name: 'Govind Singh',
    attendance: 'absent'
  }
]

function classNames (...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function JobAttendance ({ onclose }) {
  return (
    <ul>
      {work.map(person => (
        <li key={person.email} className='rounded-lg bg-white shadow'>
          <div className='flex w-full items-center justify-between space-x-6 p-6'>
            <div className='flex-1 truncate'>
              <div className='flex items-center space-x-3'>
                <h3 className='truncate text-sm font-medium text-gray-900'>
                  {person.name}
                </h3>
                <span className='inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800'>
                  {person.role}
                </span>
              </div>
              <p className='mt-1 truncate text-sm text-gray-500'>
                {person.title}
              </p>
            </div>
            <img
              className='h-10 w-10 flex-shrink-0 rounded-full bg-gray-300'
              src={person.imageUrl}
              alt=''
            />
          </div>
          <div>
            <table
              className='min-w-full border-separate'
              style={{ borderSpacing: 0 }}
            >
              <thead className='bg-gray-50'>
                <tr>
                  <th
                    scope='col'
                    className='sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8'
                  >
                    <button className='cursor-pointer flex items-center gap-6'>
                      Name{' '}
                      <ion-icon
                        className='down-arrow'
                        name='chevron-down-outline'
                      ></ion-icon>
                    </button>
                  </th>
                  <th
                    scope='col'
                    className='sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-right text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell'
                  >
                    Attendance status
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white'>
                {people.map((person, personIdx) => (
                  <tr key={personIdx}>
                    <td
                      className={classNames(
                        personIdx !== people.length - 1
                          ? 'border-b border-gray-200'
                          : '',
                        'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                      )}
                    >
                      {person.name}
                    </td>
                    <td
                      className={classNames(
                        personIdx !== people.length - 1
                          ? 'border-b border-gray-200'
                          : '',
                        'whitespace-nowrap px-3 py-4 text-sm text-right text-gray-500 hidden sm:table-cell'
                      )}
                    >
                      <Toggle />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='p-6 flex items-center justify-center'>
            <button
              onClick={onclose}
              type='button'
              className='w-full inline-flex items-center justify-center rounded-2xl border border-transparent bg-red-100 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200'
            >
              Close
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
