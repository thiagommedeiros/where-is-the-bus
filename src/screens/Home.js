import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Map, SearchBox } from '../components'
import { geolocation } from '../helpers'

class Home extends Component {

  constructor (props) {
    super(props)
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
        <SearchBox />
        <Map
          lat={this.state.lat}
          lng={this.state.lng}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.sptransState.auth
})

export default connect(mapStateToProps)(Home)
