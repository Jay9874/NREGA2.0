import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid'
import Toggle from './Toggle'
import { useRef, useState, useEffect } from 'react'
import {
  Link,
  useNavigate,
  useOutletContext,
  useParams
} from 'react-router-dom'
import { toast } from 'sonner'

const work = [
  {
    name: 'Tree Plantation',
    gp: 'Kasba GP',
    coordinates: ' 129.8 N 130.7 E',
    date: `Date: ${new Date().toLocaleDateString()}`,
    email: 'janecooper@example.com',
    telephone: '+1-202-555-0170',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
  }
]

const workers = [
  {
    name: 'Govind Singh',
    attendance: 'absent'
  },
  {
    name: 'Govind Singh',
    attendance: 'absent'
  },
  {
    name: 'Govind Singh',
    attendance: 'absent'
  },
  {
    name: 'Govind Singh',
    attendance: 'absent'
  },
  {
    name: 'Govind Singh',
    attendance: 'absent'
  },
  {
    name: 'Govind Singh',
    attendance: 'absent'
  },
  {
    name: 'Govind Singh',
    attendance: 'absent'
  },
  {
    name: 'Govind Singh',
    attendance: 'absent'
  }
]

function classNames (...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function JobAttendance () {
  const { jobId } = useParams()
  const [onclose] = useOutletContext()
  const [imageUploaded, setImageUploaded] = useState(false)
  const [selectedFile, setSelectedFile] = useState()
  const [locationGrant, setlocationGrant] = useState('prompt')
  const [location, setLocation] = useState({
    long: '',
    lat: ''
  })
  const [preview, setPreview] = useState()

  const navigate = useNavigate()

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
    function success (pos) {
      const crd = pos.coords
      setLocation(() => ({ long: crd.longitude, lat: crd.latitude }))
      console.log('Your current position is:')
      console.log(`Latitude : ${crd.latitude}`)
      console.log(`Longitude: ${crd.longitude}`)
      console.log(`More or less ${crd.accuracy} meters.`)
    }
    function error (err) {
      console.warn(`ERROR(${err.code}): ${err.message}`)
    }
    navigator.geolocation.getCurrentPosition(success, error, options)

    function handlePermission () {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then(function (result) {
          if (result.state == 'granted') {
            setlocationGrant('granted')
            report(result.state)
          } else if (result.state == 'prompt') {
            setlocationGrant('prompt')
            report(result.state)
            navigator.geolocation.getCurrentPosition(
              revealPosition,
              positionDenied,
              geoSettings
            )
          } else if (result.state == 'denied') {
            setlocationGrant('denied')
            toast.warning('Allow location sharing to continue.')
            setTimeout(() => {
              navigate('..')
            }, 1000)
            report(result.state)
          }
          result.onchange = function () {
            report(result.state)
          }
        })
    }

    function report (state) {
      console.log('Permission ' + state)
    }

    handlePermission()
  }, [])

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined)
      return
    }
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  // function for file preview
  const onSelectFile = e => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined)
      return
    }
    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0])
  }

  return (
    <div className='overlay-modal h-full flex justify-center overflow-scroll absolute top-0 w-full z-20 bg-gray-300 bg-opacity-90'>
      <div className='modal h-full w-full lg:max-w-[60%] box-border  p-4 lg:p-12'>
        <ul className='pb-12 overflow-scroll'>
          {work.map((work, workIdx) => (
            <li key={workIdx} className='rounded-2xl bg-white shadow relative'>
              <div className='flex w-full items-center gap-2 flex-wrap justify-between p-6'>
                <div className='flex-1'>
                  <div className='flex items-center space-x-3'>
                    <h3 className='text-sm font-medium text-gray-900'>
                      {work.name}
                    </h3>
                    <span className='inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800'>
                      {work.gp}
                    </span>
                  </div>
                  <p className='mt-1 truncate text-sm text-gray-500'>
                    {work.coordinates}
                  </p>
                  <p className='mt-1 truncate text-sm text-gray-500'>
                    {work.date}
                  </p>
                </div>
                <div className='sm:col-span-6'>
                  <div
                    className={`mt-1 flex w-full justify-center rounded-md border-2 border-dashed border-gray-300 ${
                      selectedFile ? 'p-1' : 'px-6 pt-5 pb-6'
                    } `}
                  >
                    {!selectedFile && (
                      <div className='space-y-1 text-center'>
                        <svg
                          className='mx-auto h-12 w-12 text-gray-400'
                          stroke='currentColor'
                          fill='none'
                          viewBox='0 0 48 48'
                          aria-hidden='true'
                        >
                          <path
                            d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                            strokeWidth={2}
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                        <div className='flex text-sm text-gray-600'>
                          <label
                            htmlFor='file-upload'
                            className='relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500'
                          >
                            <span>Progress photo</span>
                            <input
                              id='file-upload'
                              name='file-upload'
                              type='file'
                              accept='image/png, image/jpeg, image/jpg'
                              className='sr-only'
                              onChange={onSelectFile}
                            />
                          </label>
                        </div>
                        <p className='text-xs text-gray-500'>
                          PNG, or JPG up to 10MB
                        </p>
                      </div>
                    )}

                    {/* Preview Image if uploaded */}
                    {selectedFile && (
                      <div className='preview-cont relative h-[150px] w-[150px]'>
                        <img
                          className='h-[100%] w-[100%]'
                          src={preview}
                          alt='Progress photo'
                        />
                        <div className='absolute flex flex-col items-center gap-2 top-0 right-0 z-10 p-1'>
                          <label
                            title='Change Image'
                            className='edit-btn cursor-pointer flex items-center justify-center rounded-full h-[24px] w-[24px] bg-gray-200 '
                          >
                            <ion-icon
                              color='primary'
                              name='pencil-outline'
                            ></ion-icon>
                            <input
                              id='file-upload'
                              name='file-upload'
                              type='file'
                              accept='image/png, image/jpeg, image/jpg'
                              className='sr-only'
                              onChange={onSelectFile}
                            />
                          </label>
                          <button
                            onClick={() => setSelectedFile(null)}
                            title='Cancel'
                            className='close-btn flex items-center justify-center rounded-full h-[24px] w-[24px] bg-gray-200 '
                          >
                            <ion-icon
                              color='danger'
                              name='close-outline'
                            ></ion-icon>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className='max-h-[calc(100vh-364px)] rounded-b-2xl overflow-scroll'>
                <table
                  className='min-w-full border-separate pb-[62px]'
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
                        className='sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-right text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter'
                      >
                        Attendance status
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white'>
                    {workers.map((worker, workerIdx) => (
                      <tr key={workerIdx}>
                        <td
                          className={classNames(
                            workerIdx !== workers.length - 1
                              ? 'border-b border-gray-200'
                              : '',
                            'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                          )}
                        >
                          {worker.name}
                        </td>
                        <td
                          className={classNames(
                            workerIdx !== workers.length - 1
                              ? 'border-b border-gray-200'
                              : '',
                            'whitespace-nowrap flex items-center justify-end px-3 py-4 text-sm text-right text-gray-500'
                          )}
                        >
                          <Toggle />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className='py-4 px-6 absolute rounded-b-2xl w-full z-10 bottom-0 flex items-center gap-4 justify-center backdrop-blur backdrop-filter bg-gray-50 bg-opacity-75'>
                <button
                  disabled={locationGrant == 'denied'}
                  className='w-full inline-flex items-center justify-center rounded-full border border-transparent bg-red-100 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200 bg-opacity-75'
                >
                  <Link to='..' type='button' className='w-full'>
                    Cancel
                  </Link>
                </button>
                <button className='w-full inline-flex items-center justify-center rounded-full border border-transparent bg-indigo-100 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-200 bg-opacity-75'>
                  <Link to='..' type='button' className='w-full'>
                    Save
                  </Link>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
