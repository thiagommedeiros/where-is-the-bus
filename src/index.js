import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute } from 'react-router'
import injectTapEventPlugin from 'react-tap-event-plugin'
import sptrans from 'sptrans-promise'

import { sptransAuth, loader } from './actions'
import { App } from './containers'
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

geolocation().then(pos => {
  buildMap(pos.coords.latitude, pos.coords.longitude)
}).catch(err => {
  //TODO: tratar erro geolocation
  alert('Erro ao obter localização.')
  buildMap(-23.4830182, -46.7462071)
})

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)
