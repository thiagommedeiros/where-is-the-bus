import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import sptrans from 'sptrans-promise'

import { Loader } from './'
import { sptransAuth, loader, updateSearchBox } from '../actions'
import { geolocation, buildMap } from '../helpers'
import { store } from '../store'

const TOKEN = '1e7c20905fe86990c5227e7e9f00002fe908d4d4dd4d7c0091032dacd2d0e07d'

Promise.resolve(TOKEN)
  .then(authSPTrans)
  .then(getGeolocation)
  .then(getAllLines)
  .then(buildAutocomplete)

async function authSPTrans () {
  store.dispatch(loader({
    visible: true,
    spin: 'big',
    text: 'Conectando no serviço da SPTrans...'
  }))
  const auth = await sptrans.auth(TOKEN)
  store.dispatch(sptransAuth(auth))
  return { auth }
}

async function getGeolocation (auth) {
  const pos = await geolocation().catch(console.log)
  buildMap(pos.coords.latitude, pos.coords.longitude)
  return auth
}

async function getAllLines (auth) {
  const lines = await sptrans.find({
    auth,
    tipo: 'linhas',
    termosBusca: '*'
  })
  return lines
}

function buildAutocomplete (lines) {
  const buildData = item => ({
    text: `${item.route_id} - ${item.trip_headsign}`,
    shapeId: item.shape_id,
    routeId: item.route_id,
    directionId: item.direction_id
  })
  const autocompleteData = lines.map(buildData)
  store.dispatch(updateSearchBox({ autocompleteData }))
  store.dispatch(loader({ visible: false }))
}

const App = ({ children }) => (
  <MuiThemeProvider>
    <main>
      <Loader />
      {children}
    </main>
  </MuiThemeProvider>
)

export default App
