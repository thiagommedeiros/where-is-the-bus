import bus from 'bus-promise'

import { store } from '../store'
import { loader, updateSearchBox, saveShape } from '../actions'
import { centerMap, buildMarkers, buildPolyline, removeMarkers } from './'

const hasShapeInStorage = (shapeId, storagedShapes) =>
  storagedShapes.find(item =>
    item.find(shape => shape.shape_id === shapeId))

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
    tipo: 'trajeto',
    codigoTrajeto: choice.shapeId
  }).then(shape => {
    store.dispatch(saveShape(shape))
    return { auth, shape, choice }
  })
}

function getLineCode (data) {
  const { auth, shape, choice } = data

  return bus.find({
    auth,
    tipo: 'linhas',
    termosBusca: choice.routeId
  }).then(lines => {
    const line = lines.filter(item =>
      item.Sentido === Number(choice.directionId) +1)

    return {
      auth,
      shape,
      choice,
      lineCode: line[0].CodigoLinha
    }
  })
}

function getVehicles (data) {
  const { auth, shape, choice, lineCode } = data

  return bus.find({
    auth,
    tipo: 'posicaoVeiculos',
    codigoLinha: lineCode
  }).then(res => ({
    ...data,
    vehiclesPosition: res.vs
  }))
}

function buildFlagMarkers (data) {
  const { auth, shape, choice, lineCode, vehiclesPosition } = data
  const first = data.shape[0]
  const last = data.shape[data.shape.length-1]
  const markers = [{
    lat: first.shape_pt_lat,
    lng: first.shape_pt_lon,
    icon: 'flagStart'
  },
  {
    lat: last.shape_pt_lat,
    lng: last.shape_pt_lon,
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
  const markers = data.vehiclesPosition.map(pos => ({
    lat: pos.py,
    lng: pos.px,
    icon: pos.a === true ? 'busAccessible' : 'bus'
  }))
  buildMarkers(markers)

  return data
}

function buildRoute (data) {
  const shape = data.shape.map(pos => ([
    pos.shape_pt_lat,
    pos.shape_pt_lon
  ]))
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
    console.log(err)
    alert('Ocorreu um erro! Tente novamente.')
    store.dispatch(loader({ visible: false }))
  })
}
