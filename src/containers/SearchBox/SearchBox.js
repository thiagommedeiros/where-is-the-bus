import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AutoComplete } from 'material-ui'

import { removeAccents } from '../../helpers'
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
      searchText: ''
    }
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
  searchBoxState: state.searchBoxState
})

export default connect(mapStateToProps)(SearchBox)
