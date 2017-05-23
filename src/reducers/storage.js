import { SAVE_STATE } from '../constants/actionTypes'
import { loadStoredState, updateStoredState } from '../utils'

const defaultState = {
  searches: [],
  ...loadStoredState(),
}

const storage = (state = defaultState, action = {}) => {
  switch (action.type) {
    case SAVE_STATE:
      const newState = Object.assign({}, state, {
        ...loadStoredState(),
        searches: [action.payload.choice].concat(state.searches)
      })
      updateStoredState(newState)
      return newState

    default:
      return state
  }
}

export default storage
