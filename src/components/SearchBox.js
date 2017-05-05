import React from 'react'
import AutoComplete from 'material-ui/AutoComplete'

const SearchBox = (props) => (
  <AutoComplete
    hintText={props.hintText}
    searchText={props.searchText}
    maxSearchResults={props.maxSearchResults}
    onUpdateInput={props.onUpdateInput}
    dataSource={props.dataSource}
    filter={props.filter}
    fullWidth={props.fullWidth}
  />
)

export default SearchBox
