import React, { Component } from 'react'
import {
  buildMap,
  buildMarkers
} from './builders'

class Map extends Component {

  constructor () {
    super()
    this.state = {
      mapHeight: 0
    }
  }

  componentDidMount () {
    this.parseProps(this.props)
    window.onresize = () => this.updateMapHeight()
  }

  componentWillReceiveProps (nextProps) {
    this.parseProps(nextProps)
  }

  parseProps (props) {
    if (props.lat && props.lng) buildMap(props.lat, props.lng)
    if (props.markers) buildMarkers(props.markers)
  }

  updateMapHeight () {
    this.setState({
      mapHeight: window.innerHeight
    })
  }

  render () {
    return (
      <div>
        <div id="map" style={{height: this.state.mapHeight}}></div>
      </div>
    )
  }
}

export default Map
