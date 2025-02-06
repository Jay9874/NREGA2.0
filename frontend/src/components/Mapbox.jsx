import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { Geocoder } from '@mapbox/search-js-react'

import 'mapbox-gl/dist/mapbox-gl.css'
import { useAdminStore } from '../api/store'
const accessToken = import.meta.env.VITE_MAPBOX_API

const Mapbox = ({ setCords }) => {
  const { profile } = useAdminStore()
  const mapContainerRef = useRef()
  const mapRef = useRef()
  const [coordinates, setCoordinates] = useState()
  const [, setMapLoaded] = useState(false)
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    mapboxgl.accessToken = accessToken
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      // style: 'mapbox://styles/mapbox/standard-satellite',
      center: [78.0, 22.0],
      zoom: 2
    })

    const marker = new mapboxgl.Marker({
      draggable: true
    })
      .setLngLat(profile?.location_id?.geotag || [0, 0])
      .addTo(mapRef.current)
    function onDragEnd () {
      const lngLat = marker.getLngLat()
      setCoordinates([`Longitude: ${lngLat.lng}`, `Latitude: ${lngLat.lat}`])
      setCords([lngLat.lng, lngLat.lat])
    }

    marker.on('dragend', onDragEnd)
    mapRef.current.on('load', () => {
      setMapLoaded(true)
    })
    mapRef.current.addControl(new mapboxgl.FullscreenControl())
    mapRef.current.addControl(new mapboxgl.NavigationControl())

    return () => {
      mapRef.current.remove()
    }
  }, [])

  return (
    <>
      <Geocoder
        accessToken={accessToken}
        map={mapRef.current}
        mapboxgl={mapboxgl}
        value={inputValue}
        onChange={d => {
          setInputValue(d)
        }}
        marker
      />
      <div
        ref={mapContainerRef}
        id='map'
        style={{ height: '100%', width: '100%' }}
      ></div>
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.5)',
          color: '#fff',
          position: 'absolute',
          bottom: '40px',
          left: '10px',
          padding: '5px 10px',
          margin: 0,
          fontFamily: 'monospace',
          fontWeight: 'bold',
          fontSize: '11px',
          lineHeight: '18px',
          borderRadius: '3px',
          display: coordinates ? 'block' : 'none'
        }}
      >
        {coordinates &&
          coordinates.map((coord, index) => (
            <p key={index} style={{ marginBottom: 0 }}>
              {coord}
            </p>
          ))}
      </div>
    </>
  )
}

export default Mapbox
