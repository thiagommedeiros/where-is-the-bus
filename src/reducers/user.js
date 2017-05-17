import { UPDATE_GEOLOCATION } from '../constants/actionTypes'

const defaultState = {
  geolocation: {
    lat: 0,
    lng: 0
  }
}

const userReducer = (state = defaultState, action = {}) => {
  switch (action.type) {
    case UPDATE_GEOLOCATION:
      return Object.assign({}, state, {
        geolocation: {
          lat: action.payload.lat,
          lng: action.payload.lng
        }
      })

    default:
      return state
  }
}

export default userReducer
