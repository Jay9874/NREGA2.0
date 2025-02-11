import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { Geocoder } from '@mapbox/search-js-react'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useAdminStore } from '../api/store'
import { createGeoJSONCircle } from '../utils/geoJSON'
import { distance } from '../utils/getLocation'

const accessToken = import.meta.env.VITE_MAPBOX_API

const Mapbox = ({ setCords }) => {
  const { profile } = useAdminStore()
  const mapContainerRef = useRef()
  const mapRef = useRef()
  const [coordinates, setCoordinates] = useState()
  const [, setMapLoaded] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [pinDistance, setPinDistance] = useState(0)

  // Data to add a layer of 15 km radius
  const data = {
    type: 'Feature',
    properties: {
      ethnicity: 'Asian'
    },
    geometry: {
      type: 'Point',
      coordinates: [-122.447303, 37.753574]
    }
  }

  // Gram Panchayat office cords
  const pointCoordinates = profile?.location_id?.geotag
  const pointData = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: pointCoordinates
        },
        properties: { name: 'Marker' } // Optional properties
      }
    ]
  }

  useEffect(() => {
    mapboxgl.accessToken = accessToken
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/jay225/cm6z53cps01hi01s2fijben43',
      center: [78.0, 22.0],
      zoom: 2
    })

    const marker = new mapboxgl.Marker({
      draggable: true,
      color: '#ea4236'
    })
      .setLngLat(profile?.location_id?.geotag || [0, 0])
      .addTo(mapRef.current)
    function onDragEnd () {
      const lngLat = marker.getLngLat()
      setPinDistance(
        distance(
          [lngLat.lng, lngLat.lat],
          profile?.location_id?.geotag,
          'K'
        ).toFixed(2)
      )
      setCoordinates([`Longitude: ${lngLat.lng}`, `Latitude: ${lngLat.lat}`])
      setCords([lngLat.lng, lngLat.lat])
    }
    mapRef.current.flyTo({
      center: marker.getLngLat(),
      zoom: 15 // Adjust zoom level as needed
    });
    marker.on('dragend', onDragEnd)
    mapRef.current.on('load', () => {
      setMapLoaded(true)
    })

    mapRef.current.on('load', () => {
      mapRef.current.addSource(
        'polygon',
        createGeoJSONCircle(profile?.location_id?.geotag, 15)
      )

      mapRef.current.addLayer({
        id: 'polygon',
        type: 'fill',
        source: 'polygon',
        layout: {},
        paint: {
          'fill-color': 'green',
          'fill-opacity': 0.3
        }
      })
    })
    mapRef.current.on('click', event => {
      // If the user clicked on one of your markers, get its information.
      const features = mapRef.current.queryRenderedFeatures(event.point, {
        layers: ['gp-data'] // replace with your layer name
      })
      if (!features.length) {
        return
      }
      const feature = features[0]
      const popup = new mapboxgl.Popup({ offset: [0, -15] })
        .setLngLat(feature.geometry.coordinates)
        .setHTML(
          `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
        )
        .addTo(mapRef.current)
    })

    mapRef.current.addControl(new mapboxgl.FullscreenControl())
    mapRef.current.addControl(new mapboxgl.NavigationControl())
    mapRef.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      })
    )

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
        className='shadow-lg rounded-md mt-1 h-96'
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
        {coordinates && (
          <div>
            {coordinates.map((coord, index) => (
              <p key={index} style={{ marginBottom: 0 }}>
                {coord}
              </p>
            ))}
            <p>Distance: {pinDistance} km from GP</p>
          </div>
        )}
      </div>
    </>
  )
}

export default Mapbox
