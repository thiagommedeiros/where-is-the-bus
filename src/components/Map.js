/*eslint no-undef: 0*/

import React, { Component } from 'react'
import GMaps from '../assets/js/gmaps'

class Map extends Component {
  componentDidMount () {
    this.parseProps(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.parseProps(nextProps)
  }

  parseProps (props) {
    if (props.lat && props.lng) this.buildMap(props.lat, props.lng)
    if (props.markers) this.buildMarkers(props.markers)
  }

  buildMap (lat, lng) {
    window.map = new GMaps({
      div: '#map',
      lat,
      lng
    })
  }

  buildMarkers (markers) {
    markers.forEach(marker => {
      window.map.addMarker({
        lat: marker.lat,
        lng: marker.lng
      })
    })
  }

  buildPolyline (data) {
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

  render () {
    return (
      <div>
        <div id="map" style={{height: '500px'}}></div>
      </div>
    )
  }
}

export default Map
