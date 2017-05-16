import React, { Component } from 'react'

class Map extends Component {

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
    this.setState({ mapHeight: window.innerHeight - 64 })
  }

  render () {
    return (
      <div id="map" style={{height: this.state.mapHeight}}></div>
    )
  }
}

export default Map
