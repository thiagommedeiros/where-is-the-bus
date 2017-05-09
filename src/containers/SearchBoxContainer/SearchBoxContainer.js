import React, { Component } from 'react'
import { connect } from 'react-redux'
import Paper from 'material-ui/Paper'
import sptrans from 'sptrans-promise'

import { SearchBox } from '../../components'
import { removeAccents } from '../../helpers'
import { loader, updateSearchBox } from '../../actions'

import styles from './SearchBoxContainer.css'

const dataSourceConfig = {
  text: 'text',
  value: 'shapeId',
  routeId: 'routeId',
  directionId: 'directionId'
}

class SearchBoxContainer extends Component {

  constructor (props) {
    super(props)
    this.state = {
      searchText: '',
      buses: [],
      paperMarginLeft: 0
    }
  }

  componentWillReceiveProps (props) {
    if(props.auth && !props.searchBoxState.autocompleteData.length) {
      this.updateAutocompleteData(props.auth)
    }
  }

  componentDidMount () {
    window.addEventListener('resize', () => this.updateSearchBoxPosition())
    this.updateSearchBoxPosition()
  }

  componentWillUnmount () {
    window.removeEventListener('resize', () => this.updateSearchBoxPosition())
  }

  updateSearchBoxPosition () {
    const paperWidth = document.querySelector('#paper').offsetWidth
    const paperMarginLeft = -(paperWidth / 2)
    this.setState({ paperMarginLeft })
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

  handleUpdateInput (searchText) {
    this.setState({ searchText })
  }

  filterBuses (searchText, key) {
    const text = removeAccents(searchText).toLowerCase()
    const buses = removeAccents(key).toLowerCase()
    return text !== '' && buses.indexOf(text) !== -1
  }

  classNames () {
    return [
      styles.paper,
      !this.props.visible ? styles.hidden : ''
    ].join(' ')
  }

  render () {
    return (
      <Paper
        id="paper"
        className={this.classNames()}
        style={{marginLeft: this.state.paperMarginLeft}}
        zDepth={3}>
        <SearchBox
          hintText={this.props.inputPlaceholder}
          searchText={this.state.searchText}
          maxSearchResults={5}
          onUpdateInput={searchText => this.handleUpdateInput(searchText)}
          dataSource={this.props.searchBoxState.autocompleteData}
          dataSourceConfig={dataSourceConfig}
          filter={this.filterBuses}
          fullWidth={true}
          onNewRequest={this.props.onNewRequest}
        />
      </Paper>
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchBoxContainer)
