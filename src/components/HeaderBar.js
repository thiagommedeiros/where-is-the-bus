import React from 'react'
import PropTypes from 'prop-types'
import AppBar from 'material-ui/AppBar'

const HeaderBar = props => (
  <AppBar
    title={props.title}
    iconClassNameRight="muidocs-icon-navigation-expand-more"
  />
)

HeaderBar.propTypes = {
  title: PropTypes.string
}

export default HeaderBar
