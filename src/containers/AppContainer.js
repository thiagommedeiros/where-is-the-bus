import React from 'react'
import PropTypes from 'prop-types'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

const AppContainer = ({ children, location }) => (
  <ReactCSSTransitionGroup
    transitionName="page-transition"
    transitionAppear={true}
    transitionAppearTimeout={50}
    transitionLeave={false}
    transitionEnterTimeout={300}>
      { React.cloneElement(children, { key: location.pathname }) }
  </ReactCSSTransitionGroup>
)

AppContainer.propTypes = {
  children: PropTypes.string,
  location: PropTypes.string
}

export default AppContainer
