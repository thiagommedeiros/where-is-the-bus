import React, { Component } from 'react'
import { connect } from 'react-redux'
import Paper from 'material-ui/Paper'
import AutoComplete from 'material-ui/AutoComplete'
import axios from 'axios'

import { removeAccents } from '../helpers'

class SearchBox extends Component {

  constructor (props) {
    super(props)
    this.state = {
      searchText: '',
      buses: [],
      paperStyle: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: '-24px',
        marginLeft: '0',
        padding: '0 15px',
        width: '80%',
        zIndex: '1'
      }
    }
  }

  componentWillMount () {
    //temporary until sptrans-promise adds find by trips
    axios.get('https://sptrans-server.herokuapp.com/trips')
    .then(res => {
      const buses = res.data.map(item => ({
        text: `${item.route_id} - ${item.trip_headsign}`,
        value: item.shape_id
      }))

      this.setState({ buses })
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

  handleUpdateInput (searchText) {
    this.setState({
      searchText
    })
  }

  filterBuses (searchText, key) {
    const text = removeAccents(searchText).toLowerCase()
    const buses = removeAccents(key).toLowerCase()
    return text !== '' && buses.indexOf(text) !== -1
  }

  render () {
    return (
      <Paper id='paper' style={this.state.paperStyle} zDepth={3}>
        <AutoComplete
          hintText="Qual ônibus deseja encontrar?"
          searchText={this.state.searchText}
          maxSearchResults={5}
          onUpdateInput={searchText => this.handleUpdateInput(searchText)}
          dataSource={this.state.buses}
          filter={this.filterBuses}
          fullWidth={true}
        />
      </Paper>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.sptransState.auth
})

export default connect(mapStateToProps)(SearchBox)
