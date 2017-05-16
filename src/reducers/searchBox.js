import { UPDATE_SEARCHBOX } from '../constants/actionTypes'

const defaultState = {
  autocompleteData: []
}

const searchBoxReducer = (state = defaultState, action = {}) => {
  switch (action.type) {
    case UPDATE_SEARCHBOX:
      const payload = action.payload
      return Object.assign({}, state, {
        autocompleteData: payload.autocompleteData || state.autocompleteData
      })

    default:
      return state
  }
}

export default searchBoxReducer
