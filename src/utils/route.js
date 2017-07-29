import * as bus from 'bus-promise'

import { store } from '../store'
import { loader, updateSearchState, saveShape } from '../actions'
import * as Map from './map'

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
    vehicles: res.vehicles || []
  }))
}

function buildVehiclesPosition (data) {
  if (data.vehicles.length <= 0) {
    alert('Nenhum ônibus circulando nesta linha.')
    return data
  }

  const markers = data.vehicles.map(bus => ({
    lat: bus.lat,
    lng: bus.lng,
    icon: bus.accessible === true ? 'busAccessible' : 'bus'
  }))

  Map.removeMarkers(window.busMarkers)
  window.busMarkers = Map.createMarkers(markers)
  Map.addMarkers(window.busMarkers)

  return data
}

function buildFlagMarkers (data) {
  const first = data.shape[0]
  const last = data.shape[data.shape.length-1]
  const markers = [{
    lat: first.lat,
    lng: first.lng,
    icon: 'flagStart',
    zIndex: 1
  },
  {
    lat: last.lat,
    lng: last.lng,
    icon: 'flagFinish',
    zIndex: 1
  }]

  Map.removeMarkers(window.flagMarkers)
  window.flagMarkers = Map.createMarkers(markers)
  Map.addMarkers(window.flagMarkers)

  return data
}

function buildRoute (data) {
  const shape = data.shape.map(pos => ([ pos.lat, pos.lng ]))
  const middle = Math.round(shape.length / 2)

  Map.removePolylines()
  Map.drawPolyline(shape)
  Map.centerMap(shape[middle][0], shape[middle][1])
  Map.setZoom(13)

  store.dispatch(loader({ visible: false }))

  return data
}

function updateSearch (data) {
  store.dispatch(updateSearchState({ search: data }))

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
