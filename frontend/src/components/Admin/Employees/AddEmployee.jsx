import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAdminStore } from '../../../api/store'
import { FormLoading } from '../../Errors'
import { toast } from 'sonner'
import { Input } from '.'
import { Switch } from '@headlessui/react'
import {
  CloudArrowDownIcon
} from '@heroicons/react/20/solid'

function classNames (...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function AddEmployee () {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const {
    lastAddedUser,
    lastAddedAadhaar,
    setAadhaarData,
    profile,
    loading,
    createEmployee,
    fetchARandomAadhaar,
    fetchARandomFamily,
    validateNregaId
  } = useAdminStore()

  const [aadhaarNo, setAadhaarNo] = useState(
    lastAddedAadhaar ? lastAddedAadhaar.aadhar_no : ''
  )
  const [demo, setDemo] = useState(false)
  const [uniqueId, setUniqueId] = useState('')
  const [randomFamily, setRandomFamily] = useState(false)
  const [preview, setPreview] = useState(null)
  const [formData, setFormData] = useState({
    family_id: '',
    first_name: '',
    last_name: '',
    sex: '',
    id: lastAddedUser.id,
    mgnrega_id: '',
    address: profile.location_id.id,
    mobile_no: '',
    photo: null,
    email: lastAddedUser.email,
    age: lastAddedAadhaar ? lastAddedAadhaar.age : '',
    dob: lastAddedAadhaar ? lastAddedAadhaar.dob : '',
    father_name: lastAddedAadhaar ? lastAddedAadhaar.father_name : '',
    bank_account_no: lastAddedAadhaar ? lastAddedAadhaar.bank_account_no : ''
  })

  async function handleSubmit (e) {
    try {
      e.preventDefault()
      if (uniqueId == 'Not available')
        return toast.error('Not unique MGNREGA ID.')
      const { employee } = await createEmployee(formData)
      toast.success(`Worker "${employee.first_name}" added successfully.`)
      navigate('..')
    } catch (err) {
      console.log(err)
      return toast.error('Something went wrong.')
    }
  }
  function handleChange (e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle MGNREGA id change with live validation
  async function handleIDChange (e) {
    try {
      const { name, value } = e.target
      setFormData(prev => ({ ...prev, [name]: value }))
      if (value.length == 6) {
        setUniqueId('checking...')
        toast.loading('checking availability...', { duration: Infinity })
        const data = await validateNregaId(value)
        toast.dismiss()
        toast.success(`${value} is available.`)
        setUniqueId('available')
      } else {
        toast.dismiss()
        setUniqueId('atleast 6 characters')
      }
    } catch (err) {
      toast.dismiss()
      toast.error("Something went wrong.")
      setUniqueId('not available')
    }
  }

  function cantChange (e) {
    e.preventDefault()
  }

  async function handleDemoToggle (e) {
    try {
      if (!demo) {
        const data = await fetchARandomAadhaar()
        setAadhaarNo(data.aadhaar_no)
        setDemo(true)
      } else {
        setAadhaarNo('')
        setDemo(false)
      }
    } catch (err) {
      console.log(err)
    }
  }

  async function handleAadhaarClick (e) {
    e.preventDefault()
    const isNum = /^\d+$/.test(aadhaarNo)
    if (aadhaarNo.length != 12 || !isNum) {
      toast.warning('Aadhaar number should be 12 digits.')
      return null
    }
    const data = await setAadhaarData(aadhaarNo)
    delete data.id
    setFormData(prev => ({ ...prev, ...data }))
  }

  // control the image file change
  function handleFileChange (event) {
    const file = event.target.files[0]
    if (file && file.type.substring(0, 5) === 'image') {
      setFormData(prev => ({
        ...prev,
        photo: file
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        photo: null
      }))
    }
  }
  useEffect(() => {
    if (formData.photo != null) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(formData.photo) //represented as a base64string
      reader.onload = () => {
        setFormData(prev => ({ ...prev, queryImage: reader.result }))
      }
    } else {
      setPreview(null)
    }
  }, [formData.photo])

  async function RandomFamilyID () {
    try {
      if (!randomFamily) {
        const data = await fetchARandomFamily()
        toast.success('Fetched a random family id, proceed with form.')
        setFormData(prev => ({ ...prev, family_id: data.family_id }))
        setRandomFamily(true)
      } else {
        setFormData(prev => ({ ...prev, family_id: '' }))
        setRandomFamily(false)
      }
    } catch (err) {
      console.log(err)
    }
  }

  return loading ? (
    <div className='w-full text-center'>loading...</div>
  ) : (
    <main className='mt-4'>
      {/* The Form with all the fields. */}
      <div className='px-6'>
        <h2 className='text-base font-semibold leading-7 text-gray-900'>
          Fill New Worker Details
        </h2>
        <p className='mt-1 text-sm leading-6 text-gray-600'>
          Informations will be will be used only for this platform.{' '}
          <strong>All fields are required.</strong>
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='space-y-6 px-6'>
          <div className='border-b border-gray-900/10 pb-6'>
            <div className='mt-10 grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2'>
              <div className='lg:col-span-1 col-span-2 sm:col-start-1'>
                <label
                  htmlFor='uuid'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Worker ID
                </label>
                <div className='mt-2'>
                  <div className='flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md'>
                    <input
                      type='text'
                      name='uuid'
                      id='uuid'
                      value={formData.id}
                      onChange={cantChange}
                      disabled
                      className='peer block w-full border-gray-300 rounded-none rounded-l-md border-0 text-gray-900 shadow-sm disabled:bg-gray-50 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:text-gray-500 sm:text-sm sm:leading-6'
                      // className='peer block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm sm:leading-6'
                      placeholder='id'
                    />
                    <div className='px-3 flex items-center justify-center whitespace-nowrap text-center invisible peer-disabled:visible text-gray-600 text-sm font-medium'>
                      <p>Last created</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Aadhaar Number */}
              <div className='lg:col-span-1 col-span-2 col-start-1 lg:col-start-2'>
                <div className='sm:max-w-md'>
                  <div className='flex justify-between items-center'>
                    <label
                      htmlFor='aadhaar'
                      className='block text-sm font-medium leading-6 text-gray-900 whitespace-nowrap'
                    >
                      Aadhaar Number
                    </label>

                    {/* Demo toggler */}
                    <div className='flex items-center gap-2'>
                      <span className='text-sm font-normal text-gray-600'>
                        Random
                      </span>
                      <Switch
                        checked={demo}
                        onChange={handleDemoToggle}
                        className='group relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                      >
                        <span className='sr-only'>
                          fetch random aadhaar number for demo
                        </span>

                        <span
                          aria-hidden='true'
                          className='pointer-events-none absolute h-full w-full rounded-md bg-white'
                        />
                        <span
                          aria-hidden='true'
                          className={classNames(
                            demo ? 'bg-green-600' : 'bg-gray-200',
                            'pointer-events-none absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out'
                          )}
                        />
                        <span
                          aria-hidden='true'
                          className={classNames(
                            demo ? 'translate-x-5' : 'translate-x-0',
                            'pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full border border-gray-200 bg-white shadow ring-0 transition-transform duration-200 ease-in-out'
                          )}
                        />
                      </Switch>
                    </div>
                  </div>
                  <div className='mt-2'>
                    <div className='mt-1 flex rounded-md shadow-sm'>
                      <div className='relative flex flex-grow items-stretch focus-within:z-10'>
                        <input
                          type='text'
                          name='aadhar_no'
                          id='aadhaar'
                          value={aadhaarNo}
                          onChange={e => setAadhaarNo(e.target.value)}
                          className='block w-full border-gray-300 rounded-none rounded-l-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                          placeholder='0000-0000-0000'
                          required
                          title='Fetch details'
                        />
                      </div>
                      <button
                        type='button'
                        disabled={loading ? true : false}
                        onClick={handleAadhaarClick}
                        className={
                          loading
                            ? 'cursor-not-allowed'
                            : 'relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
                        }
                      >
                        <CloudArrowDownIcon
                          className='h-5 w-5 text-green-600'
                          aria-hidden='true'
                        />
                        <span>Get bio</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='pb-12'>
            <h2 className='text-base font-semibold leading-7 text-gray-900'>
              Personal Information
            </h2>
            <p className='mt-1 text-sm leading-6 text-gray-600'>
              Fill in the actual details of the worker except those auto filled.
            </p>
            {loading ? (
              <div className='mt-12'>
                <FormLoading />
              </div>
            ) : (
              <div>
                <div className='mt-10 w-full grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-3 sm:grid-cols-2'>
                  {/* MGNREGA ID */}
                  <Input
                    type='text'
                    name='mgnrega_id'
                    id='mgnrega_id'
                    label='MGNREGA ID'
                    value={formData.mgnrega_id}
                    onChange={handleIDChange}
                    className='col-span-1'
                    placeholder='MG1234'
                    hint={`${uniqueId}`}
                    pattern='[a-zA-Z]{2}[0-9]{4}'
                  />

                  {/* Family ID */}
                  <div className='col-span-1'>
                    <div className=''>
                      <div className='flex justify-between items-center pr-1'>
                        <label
                          htmlFor='family-id'
                          className='block text-sm font-medium leading-6 text-gray-900 whitespace-nowrap'
                        >
                          Family ID
                        </label>

                        {/* Demo toggler */}
                        <div className='flex items-center gap-2'>
                          <span className='text-sm font-normal text-gray-600'>
                            Random family
                          </span>
                          <Switch
                            checked={randomFamily}
                            onChange={RandomFamilyID}
                            className='group relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                          >
                            <span className='sr-only'>
                              fetch random family id for demo
                            </span>

                            <span
                              aria-hidden='true'
                              className='pointer-events-none absolute h-full w-full rounded-md bg-white'
                            />
                            <span
                              aria-hidden='true'
                              className={classNames(
                                randomFamily ? 'bg-green-600' : 'bg-gray-200',
                                'pointer-events-none absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out'
                              )}
                            />
                            <span
                              aria-hidden='true'
                              className={classNames(
                                randomFamily
                                  ? 'translate-x-5'
                                  : 'translate-x-0',
                                'pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full border border-gray-200 bg-white shadow ring-0 transition-transform duration-200 ease-in-out'
                              )}
                            />
                          </Switch>
                        </div>
                      </div>
                      <div className='mt-2'>
                        <div className='mt-1 flex rounded-md shadow-sm'>
                          <div className='relative flex flex-grow items-stretch focus-within:z-10'>
                            <input
                              type='text'
                              name='family_id'
                              id='family-id'
                              value={formData.family_id}
                              onChange={handleChange}
                              className='peer block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm'
                              placeholder='FAPLOC-2-2'
                              required
                              title='Fetch details'
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Picture */}
                  <div className='col-span-1'>
                    <label
                      htmlFor='cover-photo'
                      className='block text-sm font-medium leading-6 text-gray-900'
                    >
                      Profile photo
                    </label>
                    <div className='mt-2 flex items-center gap-6'>
                      <div className='shrink-0 '>
                        <span className='inline-block h-14 w-14 overflow-hidden rounded-full bg-gray-100'>
                          {formData.photo ? (
                            <img
                              src={preview}
                              alt='photo'
                              className='h-full w-full'
                            />
                          ) : (
                            <svg
                              className='h-full w-full text-gray-300'
                              fill='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' />
                            </svg>
                          )}
                        </span>
                      </div>
                      <label className='block'>
                        <span className='sr-only'>Choose profile photo</span>
                        <input
                          type='file'
                          name='photo'
                          id='photo'
                          accept='images/*'
                          ref={fileInputRef}
                          multiple={false}
                          onChange={handleFileChange}
                          className='block w-full text-sm text-slate-500
                                      file:mr-4 file:py-2 file:px-4
                                      file:rounded-full file:border-0
                                      file:text-sm file:font-semibold
                                    file:bg-violet-50 file:text-violet-700
                                    hover:file:bg-violet-100'
                          required
                        />
                      </label>
                    </div>
                  </div>
                  {/* First Name */}
                  <Input
                    type='text'
                    name='first_name'
                    id='first-name'
                    value={formData.first_name}
                    onChange={handleChange}
                    label='First Name'
                    className='col-span-1'
                    disabled={false}
                  />
                  {/* Last Name */}
                  <Input
                    id='last_name'
                    label='Last Name'
                    className='col-span-1'
                    type='text'
                    name='last_name'
                    value={formData.last_name}
                    onChange={handleChange}
                    disabled={false}
                  />
                  {/* Sex of worker */}
                  <Input
                    id='sex'
                    label='Sex'
                    className='col-span-1'
                    type='text'
                    name='sex'
                    value={formData.sex}
                    onChange={handleChange}
                    disabled={false}
                    placeholder={'M/F'}
                    pattern='[MF]'
                  />
                  {/* Father's Name */}
                  <Input
                    id='father_name'
                    name='father_name'
                    type='text'
                    label="Father's Name"
                    value={formData.father_name}
                    onChange={cantChange}
                    disabled={true}
                    hint='Prefilled with Aadhaar Data'
                    colValue='col-span-1'
                  />
                  {/* Email address */}
                  <Input
                    id='email'
                    name='email'
                    type='email'
                    colValue='col-span-1'
                    label='Email address'
                    value={formData.email}
                    onChange={cantChange}
                    disabled={true}
                    hint="Prefilled with Worker's Data"
                  />
                  {/* Age/ DOB */}
                  <Input
                    type='text'
                    name='age'
                    id='age'
                    label='Age / DOB'
                    colValue='col-span-1'
                    value={`${formData.age} / ${formData.dob}`}
                    onChange={cantChange}
                    placeholder='00 / DD-MM-YYYY'
                    disabled={true}
                    hint='Prefilled with Aadhaar Data'
                  />
                  {/* Bank Account Number*/}
                  <Input
                    type='text'
                    name='account-number'
                    id='account-number'
                    value={formData.bank_account_no}
                    onChange={cantChange}
                    hint='Prefilled with Aadhaar Data'
                    colValue='col-span-1'
                    label='Bank Account Number'
                    disabled={true}
                  />
                  {/* Mobile Number */}
                  <Input
                    type='text'
                    name='mobile_no'
                    id='mobile'
                    value={formData.mobile_no}
                    onChange={handleChange}
                    label=' Mobile Number'
                    colValue='col-span-1'
                    placeholder='10 Digits'
                    pattern='[0-9]{10}'
                  />
                  {/* Location ID */}
                  <Input
                    colValue='col-span-1'
                    label='Location ID'
                    id='location_id'
                    onChange={cantChange}
                    name='address'
                    disabled={true}
                    hint='Prefilled with Sachiv Location'
                    value={formData.address}
                  />
                </div>
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
                    Create Worker
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </main>
  )
}
