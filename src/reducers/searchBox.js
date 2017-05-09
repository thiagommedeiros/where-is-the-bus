import { UPDATE_SEARCHBOX } from '../constants/actionTypes'

const defaultState = {
  visible: true,
  autocompleteData: []
}

const searchBoxReducer = (state = defaultState, action = {}) => {
  switch (action.type) {
    case UPDATE_SEARCHBOX:
      const payload = action.payload
      let visible = state.visible
      if ('visible' in payload) {
        visible = payload.visible
      }
      return Object.assign({}, state, {
        visible,
        autocompleteData: payload.autocompleteData || state.autocompleteData
      })

    default:
      return state
  }
}

export default searchBoxReducer
