import { SHOW_LOADER, HIDE_LOADER } from '../constants/actionTypes'

const defaultState = {
  visible: false
}

const loaderReducer = (state = defaultState, action = {}) => {
  switch (action.type) {
    case SHOW_LOADER:
      return Object.assign({}, state, {
        visible: true
      })

    case HIDE_LOADER:
      return Object.assign({}, state, {
        visible: false
      })

    default:
      return state
  }
}

export default loaderReducer
