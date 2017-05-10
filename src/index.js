import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute } from 'react-router'
import injectTapEventPlugin from 'react-tap-event-plugin'
import sptrans from 'sptrans-promise'

import { sptransAuth, loader, updateMap } from './actions'
import { AppContainer, SearchBoxContainer } from './containers'
import { history, store } from './store'
import { Home } from './screens'
import { geolocation, buildMap } from './helpers'
import './assets/css/styles.css'

injectTapEventPlugin()

const TOKEN = '1e7c20905fe86990c5227e7e9f00002fe908d4d4dd4d7c0091032dacd2d0e07d'

store.dispatch(loader({
  visible: true,
  text: 'Conectando no serviço da SPTrans...'
}))

sptrans.auth(TOKEN).then(auth => {
  store.dispatch(sptransAuth(auth))
})

//TODO: tratar erro geolocation
geolocation().then(pos => {
  buildMap(pos.coords.latitude, pos.coords.longitude)
}).catch(console.log)

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
