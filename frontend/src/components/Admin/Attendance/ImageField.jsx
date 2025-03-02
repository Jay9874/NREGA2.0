import { useState, useEffect } from 'react'
import exifr from 'exifr'

export default function ImageField ({
  onChange,
  id,
  name,
  imgName,
  label,
  clickReset
}) {
  const [selectedFile, setSelectedFile] = useState()
  const [preview, setPreview] = useState()

  // for image preview
  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
        exifr.parse(selectedFile).then(output => {
          onChange(imgName, reader.result, output)
        })
      }
      reader.readAsDataURL(selectedFile) //represented as a base64string
      reader.onload = () => {
        setPreview(reader.result)
        exifr.parse(selectedFile).then(output => {
          onChange(imgName, reader.result, output)
        })
      }
    } else {
      setPreview(null)
    }
  }, [selectedFile])

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
  return (
    <div className='w-[200px]'>
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
                htmlFor={id}
                className='relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500'
              >
                <span>{label}</span>
                <input
                  id={id}
                  name={name}
                  type='file'
                  required
                  accept='image/png, image/jpeg, image/jpg'
                  className='sr-only'
                  onChange={onSelectFile}
                />
              </label>
            </div>
            <p className='text-xs text-gray-500'>PNG, or JPG up to 1MB</p>
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
                <ion-icon color='primary' name='pencil-outline'></ion-icon>
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
                onClick={() => {
                  setSelectedFile(null)
                  clickReset()
                }}
                title='Cancel'
                className='close-btn flex items-center justify-center rounded-full h-[24px] w-[24px] bg-gray-200 '
              >
                <ion-icon color='danger' name='close-outline'></ion-icon>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
