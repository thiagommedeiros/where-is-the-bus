import * as bus from 'bus-promise'

import { store } from '../store'
import { loader, updateSearchBox, saveShape } from '../actions'
import { centerMap, buildMarkers, buildPolyline, removeMarkers } from './'

const hasShapeInStorage = (shapeId, storagedShapes) =>
  storagedShapes.find(item =>
    item.find(shape => shape.shapeId === shapeId))

function getRouteShapes (choice) {
  const auth = store.getState().sptransState.auth
  const storagedShapes = store.getState().storagedState.shapes
  const shape = hasShapeInStorage(choice.shapeId, storagedShapes)

  if (shape) {
    store.dispatch(loader({
      visible: true,
      spin: 'big',
      text: 'Localizando veículos...'
    }))
    return { auth, shape, choice }
  }

  store.dispatch(loader({
    visible: true,
    spin: 'big',
    text: 'Montando este trajeto pela primeira vez, isso pode levar alguns minutos...'
  }))

  return bus.find({
    auth,
    type: 'shapes',
    shapeId: choice.shapeId
  }).then(shape => {
    store.dispatch(saveShape(shape))
    return { auth, shape, choice }
  })
}

function getLineCode (data) {
  const { auth, shape, choice } = data

  return bus.find({
    auth,
    type: 'lines',
    terms: choice.displaySign
  }).then(lines => {
    const line = lines.filter(item =>
      item.direction === Number(choice.directionId) +1)

    return {
      auth,
      shape,
      choice,
      lineId: line[0].lineId
    }
  })
}

function getVehicles (data) {
  return bus.find({
    auth: data.auth,
    type: 'vehiclesPosition',
    lineId: data.lineId
  }).then(res => ({
    ...data,
    vehicles: res.vehicles
  }))
}

function buildFlagMarkers (data) {
  const first = data.shape[0]
  const last = data.shape[data.shape.length-1]
  const markers = [{
    lat: first.lat,
    lng: first.lng,
    icon: 'flagStart'
  },
  {
    lat: last.lat,
    lng: last.lng,
    icon: 'flagFinish'
  }]

  removeMarkers()
  buildMarkers(markers)

  return data
}

function buildUserMarker (data) {
  const pos = store.getState().userState.geolocation
  const marker = [{
    lat: pos.lat,
    lng: pos.lng,
    icon: 'user'
  }]
  buildMarkers(marker)

  return data
}

function buildVehiclesPosition (data) {
  const markers = data.vehicles.map(bus => ({
    lat: bus.lat,
    lng: bus.lng,
    icon: bus.accessible === true ? 'busAccessible' : 'bus'
  }))
  buildMarkers(markers)

  return data
}

function buildRoute (data) {
  const shape = data.shape.map(pos => ([ pos.lat, pos.lng ]))
  buildPolyline(shape)

  const middle = Math.round(shape.length / 2)
  centerMap(shape[middle][0], shape[middle][1])

  store.dispatch(loader({ visible: false }))

  return data
}

function updateSearchState (data) {
  store.dispatch(updateSearchBox({ searchState: data }))

  return data
}

function stopRefresh () {
  clearTimeout(window.refresh)
}

function startRouteRefresh (data) {
  const time = !data ? 0 : 15000

  if (!data) {
    data = store.getState().searchBoxState.searchState
  }

  stopRefresh()
  setTimeout(() => store.dispatch(loader({ visible: false })), 1000)

  window.refresh = setTimeout(() => {
    store.dispatch(loader({ visible: true, spin: 'small' }))
    Promise.resolve(data)
    .then(getVehicles)
    .then(buildFlagMarkers)
    .then(buildUserMarker)
    .then(buildVehiclesPosition)
    .then(updateSearchState)
    .then(startRouteRefresh)
  }, time)
}

export function refreshRoute () {
  startRouteRefresh()
}

export function buildRoutePath (choice) {
  stopRefresh()

  Promise.resolve(choice)
  .then(getRouteShapes)
  .then(getLineCode)
  .then(getVehicles)
  .then(buildFlagMarkers)
  .then(buildUserMarker)
  .then(buildVehiclesPosition)
  .then(buildRoute)
  .then(updateSearchState)
  .then(startRouteRefresh)
  .catch(err => {
    alert('Ocorreu um erro! Tente novamente.')
    store.dispatch(loader({ visible: false }))
  })
}
