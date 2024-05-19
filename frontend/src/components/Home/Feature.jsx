import { FeatureCard, FeatureToggler } from '.'
import {
  CheckCircleIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from '@heroicons/react/20/solid'
import featureImg from '../../../public/feature.png'
import featureAdminImg from '../../../public/admin_scr.png'
import { useEffect, useState } from 'react'
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
  const [dir, setDir] = useState('normal')
  setInterval(function () {
    if (dir === 'normal' || dir === 'left') setDir('right')
    else setDir('left')
  }, 5000)
  return (
    <main className='bg-white text-center'>
      <div className='relative overflow-hidden bg-white py-24 sm:py-32'>
        <div className={`home-feature-cont ${dir}`}>
          <div className='home-feature-card'>
            <FeatureCard
              features={workerPanelFeatures}
              imgSrc={featureImg}
              panelName='Worker Panel'
            />
          </div>
          <div className='home-feature-card'>
            <FeatureCard
              features={workerPanelFeatures}
              imgSrc={featureAdminImg}
              panelName='Admin Panel'
            />
          </div>
        </div>
      </div>
      <div></div>
    </main>
  )
}
