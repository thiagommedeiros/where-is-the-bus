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
  if (markers.length) {
    markers.forEach(marker => {
      window.map.addMarker({
        lat: marker.lat,
        lng: marker.lng
      })
    })
  }
}

export function buildPolyline (path) {
  if (path.length) {
    const middle = Math.round(path.length / 2)
    window.map.setCenter(path[middle][0], path[middle][1])
    window.map.drawPolyline({
      path,
      strokeColor: '#00bcd4',
      strokeOpacity: 0.6,
      strokeWeight: 5
    })
  }
}
