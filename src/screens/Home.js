import React, { Component } from 'react'
import { connect } from 'react-redux'
import Paper from 'material-ui/Paper'

import { Map, Menu } from '../components'
import { SearchBoxContainer } from '../containers'
import { geolocation } from '../helpers'

const menuStyle = {
  position: 'absolute',
  top: '10px',
  left: '10px',
  zIndex: '10'
}

class Home extends Component {

  constructor (props) {
    super(props)
    this.state = {
      lat: 0,
      lng: 0,
      paperStyle: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: '-24px',
        marginLeft: '0',
        padding: '0 15px',
        width: '90%',
        zIndex: '1'
      }
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

  componentDidMount () {
    const paperWidth = document.querySelector('#paper').offsetWidth
    const marginLeft = {
      marginLeft: -(paperWidth / 2)
    }
    const paperStyle = Object.assign({}, this.state.paperStyle, marginLeft)
    this.setState({ paperStyle })
  }

  render () {
    return (
      <div>
        <Menu />
        <Paper id='paper' style={this.state.paperStyle} zDepth={3}>
          <SearchBoxContainer
            inputPlaceholder="Qual ônibus deseja encontrar?"
          />
        </Paper>
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
