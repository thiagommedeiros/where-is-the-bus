import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute } from 'react-router'

import { AppContainer } from './containers'
import { history, store } from './store'

import { Home } from './screens'

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={AppContainer}>
        <IndexRoute component={Home} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)
