import React from 'react'
import { connect } from 'react-redux'
import sptrans from 'sptrans-promise'

import { HeaderBar, SearchBox, Map } from '../containers'
import { loader } from '../actions'
import { buildMarkers, buildPolyline } from '../helpers'

function Home (props) {

  const getRoutePath = choice => {
    props.loader({
      visible: true,
      text: 'Montando trajeto...'
    })
    return sptrans.find({
      auth: props.auth,
      tipo: 'trajeto',
      codigoTrajeto: choice.shapeId
    }).then(path => ({ path, choice }))
  }

  const getLineCode = data => {
    props.loader({
      visible: true,
      text: 'Obtendo posição dos veículos...'
    })
    return sptrans.find({
      auth: props.auth,
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

  const getVehicles = data => {
    return sptrans.find({
      auth: props.auth,
      tipo: 'posicaoVeiculos',
      codigoLinha: data.lineCode
    }).then(res => ({
      ...data,
      vehiclesPosition: res.vs
    }))
  }

  const buildFlagMarkers = data => {
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

  const buildVehiclesPosition = data => {
    const markers = data.vehiclesPosition.map(pos => ({
      lat: pos.py,
      lng: pos.px,
      icon: 'bus'
    }))
    buildMarkers(markers, true)
    return data
  }

  const buildRoute = data => {
    const polyline = data.path.map(pos => ([
      pos.shape_pt_lat,
      pos.shape_pt_lon
    ]))
    buildPolyline(polyline)
    props.loader({ visible: false })
    return data
  }

  const refreshVehiclesPosition = data => {
    setTimeout(() => {
      Promise.resolve(data)
      .then(getVehicles)
      .then(buildVehiclesPosition)
      .then(buildFlagMarkers)
      .then(refreshVehiclesPosition)
    }, 15000)
  }

  const handleSearchBoxChoice = choice => {
    Promise.resolve(choice)
    .then(getRoutePath)
    .then(getLineCode)
    .then(getVehicles)
    .then(buildVehiclesPosition)
    .then(buildFlagMarkers)
    .then(buildRoute)
    .then(refreshVehiclesPosition)
    .catch(err => {
      //TODO: tratar erro
      console.log(err)
      props.loader({ visible: false })
    })
  }

  return (
    <div>
      <HeaderBar>
        <SearchBox
          inputPlaceholder="Qual ônibus deseja encontrar?"
          onNewRequest={choice => handleSearchBoxChoice(choice) }
        />
      </HeaderBar>
      <Map />
    </div>
  )
}

const mapStateToProps = state => ({
  auth: state.sptransState.auth,
})

const mapDispatchToProps = dispatch => ({
  loader: payload => dispatch(loader(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
