import React, { Component } from 'react'
import { HeaderBar, Map } from '../components'
import { geolocation } from '../helpers'

class Home extends Component {

  constructor () {
    super()
    this.state = {
      lat: 0,
      lng: 0
    }
  }

  componentWillMount () {    
    geolocation().then(pos => {
      this.setState({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      })
    })
  }

  render () {
    return (
      <div>
        <HeaderBar />
        <Map
          lat={this.state.lat}
          lng={this.state.lng}
        />
      </div>
    )
  }
}

export default Home
