import React, { Component } from 'react'
import { connect } from 'react-redux'
import sptrans from 'sptrans-promise'

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

  componentWillReceiveProps (props) {
    if(props.auth) this.getBusesLines(props.auth)
  }

  getBusesLines (auth) {
    const options = {
      auth,
      tipo: 'linhas',
      termosBusca: '*'
    }
    sptrans.find(options).then(data => this.updateBusesLines(data))
  }

  updateBusesLines (data) {
    const buildData = item => ({
      text: `${item.route_id} - ${item.trip_headsign}`,
      value: item.shape_id
    })
    const buses = data.map(buildData)
    this.setState({ buses })
  }

  handleUpdateInput (searchText) {
    this.setState({ searchText })
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
