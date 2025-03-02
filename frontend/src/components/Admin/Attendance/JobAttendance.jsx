import Toggle from './Toggle'
import { useState, useEffect } from 'react'
import {
  Link,
  useNavigate,
  useOutletContext,
  useParams
} from 'react-router-dom'
import { toast } from 'sonner'
import { useAdminStore } from '../../../api/store'
import { getToday } from '../../../utils/dataFormating'
import ImageField from './ImageField'
import { distance } from '../../../utils/getLocation'

function classNames (...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function JobAttendance () {
  const { jobId } = useParams()
  const [location, locationGrant] = useOutletContext()
  const { profile, enrollments, addAttendance } = useAdminStore()
  const [workers, setWorkers] = useState({})
  const [imgVerification, setImgVerification] = useState(false)
  const [work, setWork] = useState()
  const [metadata, setMetadata] = useState({
    workers: null,
    progress: null
  })
  const [images, setImages] = useState({
    workers: '',
    progress: ''
  })
  const navigate = useNavigate()

  async function saveAttendance () {
    try {
      const dist = distance(work.geotag, location, 'K').toFixed(2)
      if (dist > 0.2) {
        toast.message(`Your distance is ${dist}km from work site.`, {
          description: 'Please, stay within 200m from work site.'
        })
        throw new Error('Stay within 200m.')
      }
      if (!imgVerification) {
        toast.error('The images uploaded is/are not authentic.')
        throw new Error('The images uploaded is/are not authentic.')
      }
      toast.loading('Saving attendance...')
      const data = await addAttendance(jobId, workers, images)
      toast.dismiss()
      toast.success('Attendance saved successfully.')
      navigate('..')
    } catch (err) {
      console.log(err)
      toast.dismiss()
      return toast.error('Something went wrong!')
    }
  }

  function onImageSelect (imageFor, imageFile, metadata) {
    const imgPosition = [metadata.longitude, metadata.latitude]
    const imgCreation = new Date(metadata.CreateDate).toDateString()
    var created = new Date(imgCreation)
    var now = new Date()
    created.setHours(0, 0, 0, 0)
    now.setHours(0, 0, 0, 0)
    const capturingDistance = distance(imgPosition, location, 'K').toFixed(2)
    setMetadata(prev => ({
      ...prev,
      [imageFor]: { imgPosition, imgCreation, capturingDistance }
    }))
    setImages(prev => ({ ...prev, [imageFor]: imageFile }))
    if (capturingDistance > 0.2) {
      setImgVerification(false)
      return toast.warning(
        `The image captured at ${capturingDistance}km from work site, should be within 200m.`
      )
    }
    if (created < now) {
      setImgVerification(false)
      return toast.warning(
        `The image captured is an old one, upload today's image.`
      )
    }
    setImgVerification(true)
  }

  function resetImg (imgName) {
    setMetadata(prev => ({ ...prev, [imgName]: null }))
    setImages(prev => ({ ...prev, [imgName]: '' }))
  }

  useEffect(() => {
    const filteredJobs = enrollments.filter((job, index) => {
      const impId = job.by_worker.id
      const emp = {
        id: job.by_worker.id,
        name: job.by_worker.first_name + ' ' + job.by_worker.last_name,
        attendance: 'absent',
        attendance_uid: job.by_worker.id + '-' + getToday()
      }
      var today = new Date()
      today.setHours(0, 0, 0, 0)
      if (job.job.job_id == jobId && new Date(job.end_date) >= today) {
        setWorkers(prev => ({ ...prev, [impId]: emp }))
        if (!work) {
          setWork({
            ...job.job,
            name: job.job.job_name,
            gp: `${profile?.location_id?.panchayat} GP`,
            coordinates: `${job.job.geotag[0]}, ${job.job.geotag[1]}`,
            date: `${new Date().toLocaleDateString()}`
          })
        }
        return true
      } else return false
    })
  }, [jobId])

  return (
    <div className='overlay-modal overscroll-contain h-full overflow-scroll sticky top-0 w-full backdrop-blur-sm z-20 bg-gray-300 bg-opacity-75'>
      <div className='max-w-[500px] mx-auto px-4 py-6'>
        <div className='rounded-lg bg-white'>
          <div className='grid p-6'>
            <div className='flex-1'>
              <div className='flex items-center space-x-3'>
                <h3 className='text-sm font-medium text-gray-900'>
                  {work?.name}
                </h3>
                <span className='inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800'>
                  {work?.gp}
                </span>
              </div>
              <p className='italic text-sm text-gray-700'>
                _{work?.job_description}
              </p>
              <div className='font-medium'>
                <p className='mt-2 truncate font-medium text-sm text-gray-500'>
                  Geo-tag: {work?.coordinates}
                </p>
                <p className='mt-1 truncate text-sm text-gray-500'>
                  Live location: {`${location[0]}, ${location[1]}`}
                </p>
                <p className='mt-1 truncate text-sm text-gray-500'>
                  Today: {work?.date}
                </p>
              </div>
            </div>
            <div className='mt-6 grid sm:grid-cols-2 gap-4'>
              <div className='col-start-1 flex sm:flex-col justify-center gap-2 flex-wrap'>
                <ImageField
                  id='worker-img'
                  name='worker-img'
                  imgName='workers'
                  label='Workers photo'
                  onChange={onImageSelect}
                  clickReset={() => resetImg('workers')}
                />
                {metadata.workers && (
                  <div className='p-2 text-left text-xs text-gray-400'>
                    <p className='font-mono'>
                      lon: {metadata?.workers?.imgPosition[0]}
                    </p>
                    <p className='font-mono'>
                      lat: {metadata?.workers?.imgPosition[1]}
                    </p>

                    <p className='font-mono'>
                      Date: {metadata?.workers?.imgCreation}
                    </p>
                    <p className='font-mono'>
                      Distance: {metadata?.workers?.capturingDistance}km
                    </p>
                  </div>
                )}
              </div>
              <div className='sm:col-start-2 col-start-1 flex justify-center gap-2 sm:flex-col flex-wrap'>
                <ImageField
                  id='progress-img'
                  name='progress-img'
                  imgName='progress'
                  label='Progress photo'
                  onChange={onImageSelect}
                  clickReset={() => resetImg('progress')}
                />
                {metadata.progress && (
                  <div className='p-2 text-left text-xs text-gray-400'>
                    <p className='font-mono'>
                      lon: {metadata?.progress?.imgPosition[0]}
                    </p>
                    <p className='font-mono'>
                      lat: {metadata?.progress?.imgPosition[1]}
                    </p>
                    <p className='font-mono'>
                      Date: {metadata?.progress?.imgCreation}
                    </p>
                    <p className='font-mono'>
                      Distance: {metadata?.progress?.capturingDistance}km
                    </p>
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
