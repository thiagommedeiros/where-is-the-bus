import GMaps from '../../assets/js/gmaps'
import mapStyle from './mapStyle'

export function buildMap (lat, lng) {
  window.map = new GMaps({
    div: '#map',
    lat,
    lng,
    styles: mapStyle,
    disableDefaultUI: true
  })
}

export function buildMarkers (markers) {
  markers.forEach(marker => {
    window.map.addMarker({
      lat: marker.lat,
      lng: marker.lng
    })
  })
}

export function buildPolyline (data) {
  const path = data.map(pos => {
    return [
      pos.lat,
      pos.lon
    ]
  })

  window.map.drawPolyline({
    path,
    strokeColor: '#131540',
    strokeOpacity: 0.6,
    strokeWeight: 6
  })
}
