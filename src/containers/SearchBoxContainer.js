import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'

import { SearchBox } from '../components'
import { removeAccents } from '../helpers'

class SearchBoxContainer extends Component {

  constructor (props) {
    super(props)
    this.state = {
      searchText: '',
      buses: []
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
      <SearchBox
        hintText={this.props.inputPlaceholder}
        searchText={this.state.searchText}
        maxSearchResults={5}
        onUpdateInput={searchText => this.handleUpdateInput(searchText)}
        dataSource={this.state.buses}
        filter={this.filterBuses}
        fullWidth={true}
      />
    )
  }
}

const mapStateToProps = state => ({
  auth: state.sptransState.auth
})

export default connect(mapStateToProps)(SearchBoxContainer)
