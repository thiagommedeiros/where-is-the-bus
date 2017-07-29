import GMaps from '../assets/js/gmaps'
import mapStyle from '../assets/js/mapStyle'

import user from '../assets/img/user.png'
import bus from '../assets/img/bus-icon.png'
import busStop from '../assets/img/bus-stop.png'
import busAccessible from '../assets/img/bus-icon-accessible.png'
import flagStart from '../assets/img/flag-start.png'
import flagFinish from '../assets/img/flag-finish.png'

import { store } from '../store'
import { updateGeolocation } from '../actions'
import { geolocation } from './'

const markerIcons = {
  user,
  bus,
  busStop,
  busAccessible,
  flagStart,
  flagFinish
}

export function build ({ lat, lng, zoom=13 }) {
  window.map = new GMaps({
    div: '#map',
    lat: Number(lat),
    lng: Number(lng),
    styles: mapStyle,
    disableDefaultUI: true,
    zoom
  })
}

export function createMarkers (markers) {
  if (markers.length) {
    return markers.map(marker =>
      window.map.createMarker({
        lat: Number(marker.lat),
        lng: Number(marker.lng),
        icon: markerIcons[marker.icon],
        zIndex: marker.zIndex || 0
      }))
  }
}

export function addMarkers (markers) {
  if (markers.length) window.map.addMarkers(markers)
}

export function removeMarkers (markerName='') {
  window.map.removeMarkers(markerName)
}

export function removePolylines () {
  window.map.removePolylines()
}

export function drawPolyline (path) {
  if (path.length) {
    window.map.drawPolyline({
      path,
      strokeColor: '#00bcd4',
      strokeOpacity: 0.6,
      strokeWeight: 5
    })
  }
}

export async function centerMap (lat=0, lng=0) {
  if (lat && lng) {
    window.map.setCenter(lat, lng)
    return
  }

  const pos = store.getState().userState.geolocation
  window.map.setCenter(pos.lat, pos.lng, () => {
    geolocation().then(geo => {
      if (geo.coords.latitude !== pos.lat && geo.coords.longitude !== pos.lng) {
        store.dispatch(updateGeolocation({
          lat: geo.coords.latitude,
          lng: geo.coords.longitude
        }))
        centerMap(pos.lat, pos.lng)
      }
    })
  })
}

export function bindEvent (event, fn) {
  window.google.maps.event.addListener(window.map.map, event, fn)
}

export function setVisible (markers, option=true) {
  if (markers instanceof Array) {
    markers.forEach(marker => marker.setVisible(option))
    return
  }

  markers.setVisible(option)
}

export function getZoom () {
  return window.map.getZoom()
}

export function getBounds () {
  return window.map.getBounds()
}

export function setZoom (zoom) {
  return window.map.setZoom(zoom)
}
