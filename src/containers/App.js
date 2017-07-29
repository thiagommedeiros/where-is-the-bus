import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import * as bus from 'bus-promise'

import { Loader } from './'
import { store } from '../store'
import { geolocation } from '../utils/geolocation'
import * as Map from '../utils/map'
import {
  sptransAuth,
  loader,
  updateSearchState,
  updateGeolocation,
  saveLines,
  saveStops
} from '../actions'

const TOKEN = '2d5a4ee1443cb4047633305bf371c72213f6c3aefc9fe3362e42bccb3c01ebf4'

Promise.resolve(TOKEN)
  .then(getGeolocation)
  .then(buildUserMarker)
  .then(authSPTrans)
  .then(getAllStops)
  .then(buildStopsMarkers)
  .then(getAllLines)
  .then(buildAutocomplete)

const geolocationError = () =>
  alert('Não foi possível obter sua localização! Tente novamente.')

async function getGeolocation () {
  const pos = await geolocation().catch(geolocationError)
  const lat = pos ? pos.coords.latitude : '-23.5498772'
  const lng = pos? pos.coords.longitude : '-46.6361809'

  Map.build({ lat, lng, zoom: 16})
  store.dispatch(updateGeolocation({ lat, lng }))

  return { lat, lng }
}

async function buildUserMarker ({ lat, lng }) {
  const marker = [{
    lat: Number(lat),
    lng: Number(lng),
    icon: 'user',
    zIndex: 1
  }]
  const userMarker = Map.createMarkers(marker)
  Map.addMarkers(userMarker)
}

async function authSPTrans () {
  const auth = await bus.auth(TOKEN)
  store.dispatch(sptransAuth(auth))

  return { auth }
}

async function getAllStops ({ auth }) {
  const storagedStops = store.getState().storagedState.stops
  if (storagedStops.length) return { auth, stops: storagedStops }

  const stops = await bus.find({
    auth,
    type: 'stops',
    terms: '*'
  })
  store.dispatch(saveStops(stops))

  return { auth, stops }
}

async function buildStopsMarkers ({ auth, stops }) {
  const busStops = stops.map(item => ({
    lat: Number(item.lat),
    lng: Number(item.lng),
    icon: 'busStop',
    infoWindow: {
      content: `
        ${item.name}<br>
        ${item.address}
      `
    }
  }))

  const stopsMarkers = Map.createMarkers(busStops)
  Map.addMarkers(stopsMarkers)

  Map.bindEvent('zoom_changed', () => {
    if (Map.getZoom() < 16) Map.setVisible(stopsMarkers, false)
  })

  Map.bindEvent('tilesloaded', () => {
    const zoom = Map.getZoom()
    const bounds = Map.getBounds()

    stopsMarkers.forEach(stop => {
      if (bounds.contains(stop.position) && zoom >= 16) {
        Map.setVisible(stop)
      } else {
        Map.setVisible(stop, false)
      }
    })
  })

  return { auth }
}

async function getAllLines ({ auth }) {
  const storagedLines = store.getState().storagedState.lines
  if (storagedLines.length) return storagedLines[0]

  const lines = await bus.find({
    auth,
    type: 'lines',
    terms: '*'
  })
  store.dispatch(saveLines(lines))

  return lines
}

function buildAutocomplete (lines) {
  const buildData = item => ({
    text: `${item.displaySign} - ${item.mainTerminal}`,
    shapeId: item.shapeId,
    displaySign: item.displaySign,
    directionId: item.direction
  })
  const autocompleteData = lines.map(buildData)
  store.dispatch(updateSearchState({ autocompleteData }))
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
