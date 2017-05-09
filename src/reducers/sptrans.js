import { SPTRANS_AUTH } from '../constants/actionTypes'

const defaultState = {
  auth: null
}

const sptransReducer = (state = defaultState, action = {}) => {
  switch (action.type) {
    case SPTRANS_AUTH:
      return Object.assign({}, state, {
        auth: action.payload
      })

    default:
      return state
  }
}

export default sptransReducer
