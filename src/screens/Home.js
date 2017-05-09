import React, { Component } from 'react'
import { connect } from 'react-redux'
import sptrans from 'sptrans-promise'

import { Map, Menu } from '../components'
import { SearchBoxContainer } from '../containers'
import { geolocation } from '../helpers'
import { loader } from '../actions'

class Home extends Component {

  constructor (props) {
    super(props)
    this.state = {
      lat: 0,
      lng: 0,
      polylinePaths: [],
      searchBoxHidden: false
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

  handleSearchBoxChoice (choice) {
    this.props.loader({
      visible: true,
      text: 'Montando trajeto...'
    })
    const options = {
      auth: this.props.auth,
      tipo: 'trajeto',
      codigoTrajeto: choice.value
    }
    sptrans.find(options).then(route => this.buildBusRoute(route))
  }

  buildBusRoute (route) {
    const path = route.map(pos => {
      return [
        pos.shape_pt_lat,
        pos.shape_pt_lon
      ]
    })
    this.setState({
      polylinePaths: path,
      searchBoxHidden: true
    })
    this.props.loader({ visible: false })
  }

  render () {
    return (
      <div>
        <Menu />
        <SearchBoxContainer
          inputPlaceholder="Qual ônibus deseja encontrar?"
          onNewRequest={choice => this.handleSearchBoxChoice(choice)}
          hidden={this.state.searchBoxHidden}
        />
        <Map
          lat={this.state.lat}
          lng={this.state.lng}
          polyline={this.state.polylinePaths}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.sptransState.auth
})

const mapDispatchToProps = dispatch => ({
  loader: payload => dispatch(loader(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
