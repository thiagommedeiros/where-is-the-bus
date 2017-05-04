import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute } from 'react-router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'
import sptrans from 'sptrans-promise'

import { AppContainer } from './containers'
import { history, store } from './store'
import { sptransAuth } from './actions'
import { Home } from './screens'
import './assets/css/styles.css'

injectTapEventPlugin()

const TOKEN = '1e7c20905fe86990c5227e7e9f00002fe908d4d4dd4d7c0091032dacd2d0e07d' //free token

sptrans.auth(TOKEN).then(auth => {
  store.dispatch(sptransAuth(auth))
  renderApp(Home)
})

function renderApp (indexRoute) {
  ReactDOM.render(
    <MuiThemeProvider>
      <Provider store={store}>
        <Router history={history}>
          <Route path="/" component={AppContainer}>
            <IndexRoute component={indexRoute} />
          </Route>
        </Router>
      </Provider>
    </MuiThemeProvider>,
    document.getElementById('root')
  )
}
