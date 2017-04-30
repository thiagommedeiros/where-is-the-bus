import React from 'react'
import PropTypes from 'prop-types'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'

injectTapEventPlugin()

const AppContainer = ({ children, location }) => (
  <MuiThemeProvider>
    <ReactCSSTransitionGroup
      transitionName="page-transition"
      transitionAppear={true}
      transitionAppearTimeout={50}
      transitionLeave={false}
      transitionEnterTimeout={300}>
        { React.cloneElement(children, { key: location.pathname }) }
    </ReactCSSTransitionGroup>
  </MuiThemeProvider>
)

AppContainer.propTypes = {
  children: PropTypes.string,
  location: PropTypes.string
}

export default AppContainer
