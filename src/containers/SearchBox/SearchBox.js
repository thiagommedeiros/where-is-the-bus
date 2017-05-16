import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AutoComplete } from 'material-ui'
import sptrans from 'sptrans-promise'

import { removeAccents } from '../../helpers'
import { loader, updateSearchBox } from '../../actions'
import styles from './SearchBox.css'

const dataSourceConfig = {
  text: 'text',
  value: 'shapeId',
  routeId: 'routeId',
  directionId: 'directionId'
}

class SearchBox extends Component {

  constructor (props) {
    super(props)
    this.state = {
      searchText: '',
      buses: []
    }
  }

  componentWillReceiveProps (props) {
    if(props.auth && !props.searchBoxState.autocompleteData.length) {
      this.updateAutocompleteData(props.auth)
    }
  }

  updateAutocompleteData (auth) {
    this.getBusesLines(auth).then(data => {
      const buildData = item => ({
        text: `${item.route_id} - ${item.trip_headsign}`,
        shapeId: item.shape_id,
        routeId: item.route_id,
        directionId: item.direction_id
      })
      const autocompleteData = data.map(buildData)
      this.props.updateSearchBox({ autocompleteData })
      this.props.loader({ visible: false })
    })
  }

  getBusesLines (auth) {
    this.props.loader({
      visible: true,
      text: 'Obtendo linhas...'
    })
    const options = {
      auth,
      tipo: 'linhas',
      termosBusca: '*'
    }
    return sptrans.find(options).then(data => data)
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
      <AutoComplete
        className={styles.searchBox}
        hintText={this.props.inputPlaceholder}
        searchText={this.state.searchText}
        maxSearchResults={10}
        onUpdateInput={searchText => this.handleUpdateInput(searchText)}
        dataSource={this.props.searchBoxState.autocompleteData}
        dataSourceConfig={dataSourceConfig}
        filter={this.filterBuses}
        fullWidth={true}
        onNewRequest={choice => {
          this.setState({ searchText: '' })
          this.props.onNewRequest(choice)
        }}
      />
    )
  }
}

const mapStateToProps = state => ({
  auth: state.sptransState.auth,
  searchBoxState: state.searchBoxState
})

const mapDispatchToProps = dispatch => ({
  loader: payload => dispatch(loader(payload)),
  updateSearchBox: payload => dispatch(updateSearchBox(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchBox)
