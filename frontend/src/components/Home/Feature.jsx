import { FeatureCard, FeatureToggler } from '.'
import {
  CheckCircleIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from '@heroicons/react/20/solid'
import featureImg from '../../../public/feature.png'
import featureAdminImg from '../../../public/admin_sc.png'
import { useState } from 'react'
const workerPanelFeatures = [
  {
    name: 'Job Application: ',
    description: 'for the works around the Panchayat.',
    icon: CheckCircleIcon,
  },
  {
    name: 'Attendance with Filtration: ',
    description:
      'for sorting out attendances spreaded in States, Districts, Blocks and Panchayats.',
    icon: CheckCircleIcon,
  },
  {
    name: 'Payment Status: ',
    description: 'for daily wages paid on certain work.',
    icon: CheckCircleIcon,
  },
]

export default function Feature() {
  const [active, setActive] = useState(0)
  return (
    <main className='bg-white text-center'>
      <div className='py-12 sm:py-16 px-12'>
        <div className='feature-toggler'>
          <button
            onClick={() => setActive(0)}
            className={active === 0 ? 'active' : ''}
          >
            <p>Worker Panel</p>
          </button>
          <button
            name='live'
            value={1}
            onClick={() => setActive(1)}
            className={active === 1 ? 'active' : ''}
          >
            <p>Admin Panel</p>
          </button>
          <div className='toggle-activator'></div>
        </div>
        {/* <FeatureToggler handleToggler={handleToggler} /> */}
      </div>
      <div className='relative overflow-hidden bg-white pb-24 sm:pb-32'>
        <div className='grid'>
          {/* <div className='home-feature-card'> */}
          <FeatureCard
            features={workerPanelFeatures}
            imgSrc={featureImg}
            panelName='Worker Panel'
          />
          {/* </div>
          <div className='home-feature-card'> */}
          <FeatureCard
            features={workerPanelFeatures}
            imgSrc={featureAdminImg}
            panelName='Admin Panel'
          />
          {/* </div> */}
        </div>
        {/* <button className='home-btn-cont-lft home-slide-btn'>
          <ChevronLeftIcon />
        </button>
        <button className='home-btn-cont-rgt home-slide-btn'>
          <ChevronRightIcon />
        </button> */}
      </div>
    </main>
  )
}
