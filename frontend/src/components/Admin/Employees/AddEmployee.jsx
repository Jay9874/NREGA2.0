import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminStore } from '../../../api/store'
import { FormLoading } from '../../Errors'
import { Input } from '.'

export default function AddEmployee () {
  const { lastAddedUser, lastAadhaarData, setAadhaarData, profile } =
    useAdminStore()
  const [aadhaarNo, setAadhaarNo] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    ...lastAadhaarData,
    first_name: '',
    last_name: '',
    mgnrega_id: '',
    address: '',
    photo: '',
    street: '',
    mobile: ''
  })
  async function handleSubmit () {
    console.log('Cant change')
  }
  function handleChange (e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    console.log(name, value)
  }
  function cantChange (e) {
    e.preventDefault()
  }
  async function handleAadhaarClick (e) {
    e.preventDefault()
    console.log('clicked aadhaar button')
    await setAadhaarData(aadhaarNo)
  }
  console.log(lastAddedUser)
  useEffect(() => {
    if (lastAddedUser) {
      setLoading(true)
      ;async () => {
        console.log('hello')
      }
      setLoading(false)
    }
  }, [aadhaarNo])
  return (
    <main>
      {/* The Form with all the fields. */}
      <div className='px-6'>
        <h2 className='text-base font-semibold leading-7 text-gray-900'>
          Fill New Worker's Details
        </h2>
        <p className='mt-1 text-sm leading-6 text-gray-600'>
          This information will be will be used only for this system.{' '}
          <strong>All fields are required.</strong>
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='space-y-6 px-12'>
          <div className='border-b border-gray-900/10 pb-6'>
            <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
              <div className='sm:col-span-3 sm:col-start-1'>
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
                      value={lastAddedUser.id}
                      onChange={cantChange}
                      disabled
                      className='peer block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm sm:leading-6'
                      placeholder='id'
                    />
                    <p className='px-3 py-0.5 invisible peer-disabled:visible text-gray-400 text-sm'>
                      Last Created User ID
                    </p>
                  </div>
                </div>
              </div>
              {/* Aadhaar Number */}
              <div className='sm:col-span-3'>
                <label
                  htmlFor='aadhaar'
                  className='block text-sm font-medium leading-6 text-gray-900 whitespace-nowrap'
                >
                  Aadhaar Number
                </label>
                <div className='mt-2 flex items-center rounded-md shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-md'>
                  <input
                    type='text'
                    name='aadhaar'
                    id='aadhaar'
                    value={aadhaarNo}
                    onChange={e => setAadhaarNo(e.target.value)}
                    className='block w-full border-gray-300 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    placeholder='0000-0000-0000'
                    required
                  />
                  <button onClick={handleAadhaarClick}>
                    <p className='flex px-6'>
                      <ion-icon
                        style={{ color: '#00D100' }}
                        size='large'
                        name='cloud-download-outline'
                      ></ion-icon>
                    </p>
                  </button>
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
                <div className='border-b border-gray-900/10 pb-12 mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
                  {/* MGNREGA ID */}
                  <Input
                    type='text'
                    name='mgnrega_id'
                    id='mgnrega_id'
                    label='MGNREGA ID'
                    value={formData.mgnrega_id}
                    onChange={handleChange}
                    colValue='sm:col-start-1 sm:col-span-3'
                    placeholder='MG-00-00'
                  />
                  {/* Profile Picture */}
                  <div className='sm:col-span-4'>
                    <label
                      htmlFor='cover-photo'
                      className='block text-sm font-medium leading-6 text-gray-900'
                    >
                      Profile photo
                    </label>
                    <div className='mt-2 flex items-center gap-6'>
                      <div className='shrink-0 '>
                        <span className='inline-block h-14 w-14 overflow-hidden rounded-full bg-gray-100'>
                          <svg
                            className='h-full w-full text-gray-300'
                            fill='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' />
                          </svg>
                        </span>
                      </div>
                      <label className='block'>
                        <span className='sr-only'>Choose profile photo</span>
                        <input
                          type='file'
                          name='photo'
                          id='photo'
                          value={formData.photo}
                          onChange={handleChange}
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
                    name='first-name'
                    id='first-name'
                    value={formData.first_name}
                    onChange={handleChange}
                    label='First Name'
                    colValue='col-start-1 col-span-full sm:col-span-2'
                    disabled={false}
                  />
                  {/* Last Name */}
                  <Input
                    id='last_name'
                    label='Last Name'
                    colValue='sm:col-span-2'
                    type='text'
                    name='last_name'
                    value={formData.last_name}
                    onChange={handleChange}
                    disabled={false}
                  />
                  {/* Father's Name */}
                  <Input
                    id='father_name'
                    name='father_name'
                    type='text'
                    label="Father's Name"
                    value={lastAadhaarData.father_name}
                    onChange={cantChange}
                    disabled={true}
                    hint='Prefilled with Aadhaar Data'
                    placeholder="Worker's Father Name"
                    colValue='sm:col-span-2 sm:col-start-1'
                  />
                  {/* Email address */}
                  <Input
                    id='email'
                    name='email'
                    type='email'
                    colValue='sm:col-span-3'
                    label='Email address'
                    value={lastAddedUser.email}
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
                    colValue='sm:col-span-2'
                    value={`${lastAadhaarData.dob}`}
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
                    value={lastAadhaarData.bank_account}
                    onChange={cantChange}
                    hint='Prefilled with Aadhaar Data'
                    colValue='sm:col-span-3'
                    label='Bank Account Number'
                    disabled={true}
                  />
                  {/* Mobile Number */}
                  <Input
                    type='text'
                    name='mobile'
                    id='mobile'
                    value={formData.mobile}
                    onChange={handleChange}
                    label=' Mobile Number'
                    colValue='sm:col-span-2'
                    placeholder='10 Digits'
                  />
                  {/* Street Address */}
                  <Input
                    type='text'
                    name='street-address'
                    id='street-address'
                    value={formData.street}
                    onChange={handleChange}
                    cols={20}
                    rows={3}
                    label='Street address'
                    colValue='col-span-3'
                    placeholder='234, Hadipur, Bihar 82.'
                  />
                  {/* Location ID */}
                  <Input
                    colValue='col-start-1 col-span-full'
                    label='Location ID'
                    id='location_id'
                    onChange={cantChange}
                    name='location_id'
                    disabled={true}
                    value={profile.location_id.id}
                  />
                </div>
                <div className='mt-6 flex items-center justify-end gap-x-6 pb-12'>
                  <Link
                    to='..'
                    className='text-sm font-semibold leading-6 text-gray-900'
                  >
                    Cancel
                  </Link>
                  <button
                    type='submit'
                    className='rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                  >
                    Save
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
