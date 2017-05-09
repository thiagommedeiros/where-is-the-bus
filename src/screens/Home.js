import React from 'react'
import { connect } from 'react-redux'
import sptrans from 'sptrans-promise'

import { Menu } from '../components'
import { MapContainer, SearchBoxContainer } from '../containers'
import { loader, updateMap, updateSearchBox } from '../actions'

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

  const buildRoute = data => {
    const markers = data.vehiclesPosition.map(pos => ({
      lat: pos.py,
      lng: pos.px
    }))
    const polyline = data.path.map(pos => ([
      pos.shape_pt_lat,
      pos.shape_pt_lon
    ]))
    props.updateMap({ markers, polyline })
    props.updateSearchBox({ visible: false })
    props.loader({ visible: false })
  }

  const handleSearchBoxChoice = choice => {
    Promise.resolve(choice)
    .then(getRoutePath)
    .then(getLineCode)
    .then(getVehicles)
    .then(buildRoute)
    .catch(err => {
      //TODO: tratar erro
      props.loader({ visible: false })
    })
  }

  return (
    <div>
      <Menu />
      <SearchBoxContainer
        inputPlaceholder="Qual ônibus deseja encontrar?"
        onNewRequest={choice => handleSearchBoxChoice(choice) }
        visible={props.searchBoxState.visible}
      />
      <MapContainer />
    </div>
  )
}

const mapStateToProps = state => ({
  auth: state.sptransState.auth,
  mapState: state.mapState,
  searchBoxState: state.searchBoxState
})

const mapDispatchToProps = dispatch => ({
  loader: payload => dispatch(loader(payload)),
  updateMap: payload => dispatch(updateMap(payload)),
  updateSearchBox: payload => dispatch(updateSearchBox(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
