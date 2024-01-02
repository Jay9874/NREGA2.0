import CommonNav from '../components/CommonNav'
import useWindowHeight from '../utils/useWindowHeight'
import formImg from '../assets/images/mgn.webp'
import { Outlet } from 'react-router-dom'


export default function Auth () {
  const { height, isReady } = useWindowHeight()

  return (
    <>
      <div
        style={{
          height: `${height}px`,
          opacity: isReady ? 1 : 0,
          transition: 'opacity 0.5s linear'
        }}
      >
        <CommonNav />
        <div className='flex min-h-full'>
          <Outlet />
          <div className='relative hidden w-0 flex-1 lg:block'>
            <img
              className='absolute inset-0 -z-10 h-full w-full object-cover'
              src={formImg}
              alt='Kaamgaar'
            />
          </div>
        </div>
      </div>
    </>
  )
}
