import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute } from 'react-router'
import injectTapEventPlugin from 'react-tap-event-plugin'
import sptrans from 'sptrans-promise'

import { sptransAuth, showLoader, hideLoader } from './actions'
import { AppContainer, SearchBoxContainer } from './containers'
import { history, store } from './store'
import { Home } from './screens'
import './assets/css/styles.css'

injectTapEventPlugin()

//free token
const TOKEN = '1e7c20905fe86990c5227e7e9f00002fe908d4d4dd4d7c0091032dacd2d0e07d'

store.dispatch(showLoader())
sptrans.auth(TOKEN).then(auth => {
  //temporary timeout to development
  setTimeout(() => {
    store.dispatch(sptransAuth(auth))
    store.dispatch(hideLoader())
  }, 2000)
})

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={AppContainer}>
        <IndexRoute component={Home} />
        <Route path="blz" component={SearchBoxContainer} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)
