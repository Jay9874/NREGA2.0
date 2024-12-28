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
import { useAdminStore } from '../../../api/store'
import { getToday } from '../../../utils/dataFormating'

function classNames (...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function JobAttendance () {
  const { jobId } = useParams()
  const [imageUploaded, setImageUploaded] = useState(false)
  const [selectedFile, setSelectedFile] = useState()
  const [preview, setPreview] = useState()
  const [location, locationGrant] = useOutletContext()
  const { profile, enrollments, addAttendance } = useAdminStore()
  const [workers, setWorkers] = useState({})
  const [work, setWork] = useState()
  const navigate = useNavigate()

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

  useEffect(() => {
    const filteredJobs = enrollments.filter((job, index) => {
      const impId = job.worker_id.id
      const emp = {
        id: job.worker_id.id,
        name: job.worker_id.first_name + ' ' + job.worker_id.last_name,
        attendance: 'absent',
        attendance_uid: job.worker_id.id + '-' + getToday()
      }
      if (job.job_id.job_id == jobId) {
        setWorkers(prev => ({ ...prev, [impId]: emp }))
        if (!work) {
          setWork({
            name: job.job_id.job_name,
            gp: `${profile?.location_id?.panchayat} GP`,
            coordinates: `${job.job_id.geotag[0]}, ${job.job_id.geotag[1]}`,
            live: location,
            date: `Date: ${new Date().toLocaleDateString()}`
          })
        }
        return true
      } else return false
    })
  }, [jobId])

  async function saveAttendance () {
    try {
      toast.loading("Saving attendance...")
      const data = await addAttendance(jobId, workers)
      toast.dismiss()
      toast.success("Attendance saved successfully.")
      navigate('..')
    } catch (err) {
      console.log(err)
      toast.dismiss()
      return toast.error('Something went wrong!')
    }
  }

  return (
    <div className='overlay-modal overscroll-contain h-full overflow-scroll sticky top-0 w-full backdrop-blur-sm z-20 bg-gray-300 bg-opacity-75'>
      <div className='flex justify-center px-4 py-6'>
        <div className='rounded-lg bg-white'>
          <div className='flex w-full items-center gap-2 flex-wrap justify-between p-6'>
            <div className='flex-1'>
              <div className='flex items-center space-x-3'>
                <h3 className='text-sm font-medium text-gray-900'>
                  {work?.name}
                </h3>
                <span className='inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800'>
                  {work?.gp}
                </span>
              </div>
              <p className='mt-1 truncate text-sm text-gray-500'>
                Geo-tag: {work?.coordinates}
              </p>
              <p className='mt-1 truncate text-sm text-gray-500'>
                Live: {`${work?.live?.lat}, ${work?.live?.long}`}
              </p>
              <p className='mt-1 truncate text-sm text-gray-500'>
                {work?.date}
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
                          required
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
          <div className='max-h-[300px] rounded-lg overflow-scroll'>
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
                    className='sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-right text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter'
                  >
                    Attendance
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white'>
                {Object.keys(workers).map((worker_id, index) => {
                  const worker = workers[worker_id]
                  return (
                    <tr key={index}>
                      <td className='border-b border-gray-200 whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'>
                        {worker.name}
                      </td>
                      <td className='border-b border-gray-200 whitespace-nowrap flex items-center justify-end px-3 py-4 text-sm text-right text-gray-500'>
                        <Toggle
                          onToggle={(state, id) =>
                            setWorkers(prev => {
                              var currEmp = workers[id]
                              currEmp = { ...currEmp, attendance: state }
                              return {
                                ...prev,
                                [worker_id]: currEmp
                              }
                            })
                          }
                          id={worker.id}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className='no-scrollbar py-4 px-6 sticky w-full z-10 bottom-0 flex items-center gap-4 justify-center backdrop-blur backdrop-filter bg-gray-50 bg-opacity-75'>
              <button
                disabled={locationGrant == 'denied'}
                className='w-full inline-flex items-center justify-center rounded-full border border-transparent bg-red-100 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200 bg-opacity-75'
              >
                <Link to='..' type='button' className='w-full'>
                  Cancel
                </Link>
              </button>
              <button
                onClick={saveAttendance}
                className='w-full inline-flex items-center justify-center rounded-full border border-transparent bg-indigo-100 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-200 bg-opacity-75'
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
