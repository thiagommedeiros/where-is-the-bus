import React from 'react'
import {
  buildMap,
  buildMarkers,
  buildPolyline
} from './builders'

const Map = (props) => {

  if(props.lat && props.lng) buildMap(props.lat, props.lng)
  if(props.markers) buildMarkers(props.markers)
  if(props.polyline) buildPolyline(props.polyline)

  return (
    <div id="map" style={{height: props.height}}></div>
  )
}

export default Map
