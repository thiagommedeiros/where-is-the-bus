import { UPDATE_SEARCHSTATE } from '../constants/actionTypes'

const defaultState = {
  autocompleteData: [],
  lastSearch: {
    vehicles: []
  }
}

const searchStateReducer = (state = defaultState, action = {}) => {
  switch (action.type) {
    case UPDATE_SEARCHSTATE:
      const payload = action.payload
      return Object.assign({}, state, {
        autocompleteData: payload.autocompleteData || state.autocompleteData,
        lastSearch: payload.search || state.lastSearch
      })

    default:
      return state
  }
}

export default searchStateReducer
