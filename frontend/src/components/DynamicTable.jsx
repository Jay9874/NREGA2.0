import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
function classNames (...classes) {
  return classes.filter(Boolean).join(' ')
}
export default function DynamicTable ({
  data,
  headings,
  rowNext,
  rowClick,
  actionHeader,
  statusStyles
}) {
  return (
    <div className='no-scrollbar -mx-2 max-h-[420px] relative sm:mx-0 mt-4 mb-8 overflow-scroll shadow ring-1 ring-black ring-opacity-5 rounded-lg'>
      <table className='relative min-w-full divide-y divide-gray-300'>
        <thead className='bg-gray-50 sticky z-10 top-0 bg-opacity-75 backdrop-blur-sm'>
          <tr>
            {headings.map((header, index) => (
              <th
                scope='col'
                key={index}
                className={`${header.css_normal} ${
                  index == 0 ? 'pl-4 sm:pl-6 pr-3' : 'px-3'
                } py-3.5 px-3 text-left text-sm font-semibold text-gray-900`}
              >
                <a href='#' className='group inline-flex'>
                  {header.name}
                  <span className='invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible'>
                    <ChevronDownIcon className='h-5 w-5' aria-hidden='true' />
                  </span>
                </a>
              </th>
            ))}
            {actionHeader && (
              <th scope='col' className='relative py-3.5 px-3 sm:pr-6'>
                <span className='sr-only'>{actionHeader}</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200 bg-white'>
          {data.map((itm, index) => {
            return (
              <tr key={index}>
                {headings.map((header, idx) =>
                  idx == 0 ? (
                    <td
                      key={`${index}_${idx}`}
                      className='w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6'
                    >
                      {itm[header.name]}
                      <dl className='font-normal lg:hidden'>
                        {headings.slice(1).map((smallHeader, headerIdx) => (
                          <dd
                            key={`${index}_${idx}_${headerIdx}`}
                            className={`mt-1 text-gray-500 ${smallHeader.css_list}`}
                          >
                            <span className='text-gray-700'>
                              {smallHeader.name}:{' '}
                            </span>
                            <span className='text-gray-500'>
                              {itm[smallHeader.name]}
                            </span>
                          </dd>
                        ))}
                      </dl>
                    </td>
                  ) : header.name === 'Status' ? (
                    <td
                      key={`${index}_${idx}`}
                      className='whitespace-nowrap pl-3 pr-4 py-4 text-sm text-gray-500'
                    >
                      <span
                        className={classNames(
                          statusStyles[itm[header.name]],
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize'
                        )}
                      >
                        {itm[header.name]}
                      </span>
                    </td>
                  ) : (
                    <td
                      key={`${index}_${idx}`}
                      className={`${header.css_normal} truncate px-3 py-4 text-sm text-gray-500`}
                    >
                      {itm[header.name]}
                    </td>
                  )
                )}
                {rowNext && (
                  <td>
                    <button
                      className='px-3 py-4 items-center justify-center text-sm font-medium text-gray-900'
                      onClick={e => rowClick(e, itm)}
                    >
                      <ChevronRightIcon
                        className='h-5 w-5 flex-shrink-0 text-indigo-600 hover:text-indigo-900'
                        aria-hidden='true'
                      />
                    </button>
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className='sticky bottom-0 h-[25px] w-full bg-gradient-to-t  from-gray-50' />
    </div>
  )
}
