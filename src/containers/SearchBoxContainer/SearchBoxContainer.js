import React, { Component } from 'react'
import { connect } from 'react-redux'
import Paper from 'material-ui/Paper'
import sptrans from 'sptrans-promise'

import { SearchBox } from '../../components'
import { removeAccents } from '../../helpers'

import styles from './SearchBoxContainer.css'

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
    if(props.auth) this.getBusesLines(props.auth)
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

  classNames () {
    return [
      styles.paper,
      this.props.hidden ? styles.hidden : ''
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
          dataSource={this.state.buses}
          filter={this.filterBuses}
          fullWidth={true}
          onNewRequest={this.props.onNewRequest}
        />
      </Paper>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.sptransState.auth
})

export default connect(mapStateToProps)(SearchBoxContainer)
