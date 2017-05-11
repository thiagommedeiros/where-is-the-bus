import React, { Component } from 'react'
import { Map } from '../components'

class MapContainer extends Component {

  constructor () {
    super()
    this.state = {
      mapHeight: 0
    }
  }

  componentDidMount () {
    window.addEventListener('resize', () => this.updateMapHeight())
    this.updateMapHeight()
  }

  componentWillUnmount () {
    window.removeEventListener('resize', () => this.updateMapHeight())
  }

  updateMapHeight () {
    this.setState({ mapHeight: window.innerHeight })
  }

  render () {
    return (
      <Map height={this.state.mapHeight} />
    )
  }
}

export default MapContainer
