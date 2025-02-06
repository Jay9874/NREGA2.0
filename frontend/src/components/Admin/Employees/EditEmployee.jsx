import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLongLeftIcon } from '@heroicons/react/24/solid'
import { useAdminStore } from '../../../api/store'
import { toast } from 'sonner'

export default function EditEmployee () {
  const { id } = useParams()
  const { employees, updateWorker } = useAdminStore()
  const [selectedFile, setSelectedFile] = useState()
  const [loading, setLoading] = useState()
  const [employee, setEmployee] = useState()
  const [preview, setPreview] = useState()
  const navigate = useNavigate()
  const [profile, setProfile] = useState({
    id: '',
    mobile_no: ''
  })

  // function for file preview
  const onSelectFile = e => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined)
      return
    }
    // I've kept this example simple by using the first image instead of multiple
    const image = e.target.files[0]
    const imageSize = image.size / 1048576
    if (imageSize > 1) {
      toast.warning('Image size is large, keep it within 1 MB.')
      setSelectedFile(null)
    } else {
      setSelectedFile(image)
    }
  }

  // handle changes in input fields.
  function handleChange (e) {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  // send update worker form to backend
  async function handleSubmit (e) {
    try {
      e.preventDefault()
      if (selectedFile != null) {
        await updateWorker({ ...profile, updatedImage: preview })
      } else await updateWorker(profile)
      navigate('..')
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    const [currEmployee] = employees.filter((emp, index) => emp.id == id)
    setEmployee(currEmployee)
    setPreview(currEmployee?.photo)
    setProfile({
      id: currEmployee?.id,
      mobile_no: currEmployee?.mobile_no
    })
  }, [])

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(selectedFile) //represented as a base64string
      reader.onload = () => {
        setPreview(reader.result)
      }
    } else {
      setPreview(employee?.photo)
    }
  }, [selectedFile])

  useEffect(() => {
    setPreview(employee?.photo)
  }, [employee])

  return (
    <>
      <Link to='..'>
        <ArrowLongLeftIcon
          className='h-12 w-12 text-indigo-600'
          aria-hidden='true'
          title='Back to Employees List'
        />
      </Link>
      <div className='col-span-full px-6'>
        <div className='sm:flex-auto'>
          <h1 className='text-lg font-semibold text-gray-900'>Edit Profile</h1>
          <p className='text-sm text-gray-700'>
            Update the worker profile of
            <b> {employee?.first_name + ' ' + employee?.last_name}.</b>
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          {/* New mobile number */}
          <div className='mt-2 md:w-1/2'>
            <label
              htmlFor='mobile'
              className='block text-sm font-medium text-gray-700'
            >
              New mobile number
            </label>
            <div className='relative mt-1 rounded-md shadow-sm'>
              <input
                type='text'
                required
                name='mobile_no'
                id='mobile'
                value={profile.mobile_no}
                onChange={handleChange}
                className='w-full focus:outline-none border-gray-300 rounded-md focus:outline:none valid:text-green-600 sm:text-sm'
                placeholder={employee?.mobile_no}
                aria-invalid='true'
                aria-describedby='mobile-error'
              />
            </div>
          </div>
          <div className='sm:col-span-6 mt-2'>
            <label
              htmlFor='photo'
              className='block text-sm font-medium text-gray-700'
            >
              New photo
            </label>
            <div className='mt-1 w-fit rounded-md border-2 border-dashed border-gray-300 p-1'>
              {/* Preview Image if uploaded */}
              <div className='preview-cont relative h-[150px] w-[150px]'>
                <img
                  className='h-[100%] w-[100%]'
                  src={preview}
                  alt='worker image'
                />
                <div className='absolute flex flex-col items-center gap-2 top-0 right-0 z-10 p-1'>
                  <label
                    title='Change Image'
                    htmlFor='worker_photo'
                    className='edit-btn cursor-pointer flex items-center justify-center rounded-full h-[24px] w-[24px] bg-gray-200 '
                  >
                    <ion-icon color='primary' name='pencil-outline'></ion-icon>
                    <input
                      id='worker_photo'
                      name='worker_photo'
                      type='file'
                      multiple={false}
                      accept='image/png, image/jpeg, image/jpg'
                      className='sr-only'
                      onChange={onSelectFile}
                    />
                  </label>
                  {selectedFile && (
                    <button
                      onClick={() => {
                        setSelectedFile(null)
                        setPreview(employee.photo)
                      }}
                      title='Cancel'
                      type='button'
                      className='close-btn flex items-center justify-center rounded-full h-[24px] w-[24px] bg-gray-200 '
                    >
                      <ion-icon color='danger' name='close-outline'></ion-icon>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* action buttons */}
          <div className='mt-6 flex items-center justify-end gap-x-6 pb-12'>
            <Link
              to='..'
              className='rounded-md text-sm font-semibold leading-6 px-3 py-2 text-gray-900 hover:bg-gray-200'
            >
              Cancel
            </Link>
            <button
              type='submit'
              disabled={loading}
              className={`rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold
                         text-white shadow-sm ${
                           !loading
                             ? 'hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                             : 'cursor-not-allowed'
                         } `}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
