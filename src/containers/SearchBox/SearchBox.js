import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AutoComplete, List, ListItem, Subheader } from 'material-ui'

import { saveSearch } from '../../actions'
import { removeAccents } from '../../utils'
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
      hiddenRecentSearches: true
    }
  }

  handleUpdateInput (searchText) {
    this.setState({
      searchText,
      hiddenRecentSearches: true
    })
  }

  filterBuses (searchText, key) {
    const text = removeAccents(searchText).toLowerCase()
    const buses = removeAccents(key).toLowerCase()
    return text !== '' && buses.indexOf(text) !== -1
  }

  onNewRequest (choice, save=true) {
    this.setState({ searchText: '' })
    this.props.onNewRequest(choice)
    if (save) this.props.saveSearch({ choice })
  }

  buildRecentSearches () {
    return this.props.searchesState.map((item, key) => (
      <ListItem
        key={key}
        primaryText={item.text}
        onTouchTap={() => this.onNewRequest(item, false)}
      />
    ))
  }

  classNames () {
    return [
      styles.recentSearches,
      this.state.hiddenRecentSearches ? styles.hidden : ''
    ].join(' ')
  }

  render () {
    return (
      <div style={{width: '100%'}}>
        <AutoComplete
          className={styles.searchBox}
          hintText={this.props.inputPlaceholder}
          searchText={this.state.searchText}
          maxSearchResults={10}
          onUpdateInput={searchText => this.handleUpdateInput(searchText)}
          dataSource={this.props.searchState.autocompleteData}
          dataSourceConfig={dataSourceConfig}
          filter={this.filterBuses}
          fullWidth={true}
          onNewRequest={choice => this.onNewRequest(choice)}
          onFocus={() => {
            if (this.props.searchesState.length) {
              this.setState({ hiddenRecentSearches: false })
            }
          }}
          onBlur={() =>
            setTimeout(() =>
              this.setState({ hiddenRecentSearches: true })
            , 300)
          }
        />
        <List className={this.classNames()}>
          <Subheader>Buscas recentes</Subheader>
          {this.buildRecentSearches()}
        </List>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  searchState: state.searchState,
  searchesState: state.storagedState.searches
})

const mapDispatchToProps = dispatch => ({
  saveSearch: choice => dispatch(saveSearch(choice))
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchBox)
