import sptrans from 'sptrans-promise'

import { store } from '../store'
import { loader, updateSearchBox } from '../actions'
import { buildMarkers, buildPolyline } from './'

export function buildRoutePath (choice) {
  stopRefresh()

  Promise.resolve(choice)
  .then(getRoutePaths)
  .then(getLineCode)
  .then(getVehicles)
  .then(buildVehiclesPosition)
  .then(buildFlagMarkers)
  .then(buildRoute)
  .then(updateSearchBoxState)
  .then(startRefresh)
  .catch(err => {
    //TODO: tratar erro
    console.log(err)
    store.dispatch(loader({ visible: false }))
  })
}

function getRoutePaths (choice) {
  const auth = store.getState().sptransState.auth
  store.dispatch(loader({
    visible: true,
    spin: 'big',
    text: 'Montando trajeto...'
  }))
  return sptrans.find({
    auth,
    tipo: 'trajeto',
    codigoTrajeto: choice.shapeId
  }).then(path => ({ auth, path, choice }))
}

function getLineCode (data) {
  store.dispatch(loader({
    visible: true,
    spin: 'big',
    text: 'Obtendo posição dos veículos...'
  }))
  return sptrans.find({
    auth: data.auth,
    tipo: 'linhas',
    termosBusca: data.choice.routeId
  }).then(lines => {
    const line = lines.filter(item => item.Sentido === data.choice.directionId +1)
    return {
      ...data,
      lineCode: line[0].CodigoLinha
    }
  })
}

function getVehicles (data) {
  return sptrans.find({
    auth: data.auth,
    tipo: 'posicaoVeiculos',
    codigoLinha: data.lineCode
  }).then(res => ({
    ...data,
    vehiclesPosition: res.vs
  }))
}

function buildFlagMarkers (data) {
  const first = data.path[0]
  const last = data.path[data.path.length-1]
  const markers = [{
    lat: Number(first.shape_pt_lat),
    lng: Number(first.shape_pt_lon),
    icon: 'flagStart'
  },
  {
    lat: Number(last.shape_pt_lat),
    lng: Number(last.shape_pt_lon),
    icon: 'flagFinish'
  }]
  buildMarkers(markers)
  return data
}

function buildVehiclesPosition (data) {
  const markers = data.vehiclesPosition.map(pos => ({
    lat: pos.py,
    lng: pos.px,
    icon: 'bus'
  }))
  buildMarkers(markers, true)
  return data
}

function buildRoute (data) {
  const polyline = data.path.map(pos => ([
    pos.shape_pt_lat,
    pos.shape_pt_lon
  ]))
  buildPolyline(polyline)
  store.dispatch(loader({ visible: false }))
  return data
}

function updateSearchBoxState (data) {
  store.dispatch(updateSearchBox({ searchState: data }))
  return data
}

function stopRefresh () {
  clearTimeout(window.refresh)
}

export function refresh () {
  startRefresh()
}

function startRefresh (data) {
  let time = 15000

  if (!data) {
    time = 0
    data = store.getState().searchBoxState.searchState
  }

  stopRefresh()
  store.dispatch(loader({ visible: false }))

  window.refresh = setTimeout(() => {
    store.dispatch(loader({ visible: true, spin: 'small' }))
    Promise.resolve(data)
    .then(getVehicles)
    .then(buildVehiclesPosition)
    .then(buildFlagMarkers)
    .then(updateSearchBoxState)
    .then(startRefresh)
  }, time)
}
