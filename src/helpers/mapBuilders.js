import GMaps from '../assets/js/gmaps'
import mapStyle from '../assets/js/mapStyle'

import bus from '../assets/img/bus-icon3.png'
import flagStart from '../assets/img/flag-start.png'
import flagFinish from '../assets/img/flag-finish.png'

export function buildMap (lat, lng) {
  window.map = new GMaps({
    div: '#map',
    lat,
    lng,
    styles: mapStyle,
    disableDefaultUI: true,
    zoom: 14
  })
}

export function buildMarkers (markers, remove=false) {
  if (markers.length) {
    if (remove) {
      window.map.removeMarkers()
    }
    markers.forEach(marker => {
      let icon
      if (marker.icon === 'bus') icon = bus
      if (marker.icon === 'flagStart') icon = flagStart
      if (marker.icon === 'flagFinish') icon = flagFinish
      window.map.addMarker({
        lat: marker.lat,
        lng: marker.lng,
        icon
      })
    })
  }
}

export function buildPolyline (path) {
  if (path.length) {
    window.map.removePolylines()
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
