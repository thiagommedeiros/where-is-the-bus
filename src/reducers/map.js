import { UPDATE_MAP } from '../constants/actionTypes'

const defaultState = {
  lat: 0,
  lng: 0,
  polyline: [],
  markers: [],
  mapHeight: 0
}

const mapReducer = (state = defaultState, action = {}) => {
  switch (action.type) {
    case UPDATE_MAP:
      return Object.assign({}, state, {
        lat: action.payload.lat || state.lat,
        lng: action.payload.lng || state.lng,
        markers: action.payload.markers || state.markers,
        polyline: action.payload.polyline || state.polyline,
        mapHeight: action.payload.mapHeight || state.mapHeight
      })

    default:
      return state
  }
}

export default mapReducer
