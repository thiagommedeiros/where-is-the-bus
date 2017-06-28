import { SAVE_SEARCHES } from '../constants/actionTypes'
import { loadStoredState, updateStoredState } from '../utils'

const defaultState = {
  searches: [],
  ...loadStoredState(),
}

const findByMatchingProperties = (arr, wanted) =>
	arr.filter(item =>
		Object.keys(wanted).every(key =>
			item[key] === wanted[key]
		)
  )

const storage = (state = defaultState, action = {}) => {
  switch (action.type) {
    case SAVE_SEARCHES:
      const alreadyHasValue = findByMatchingProperties(state.searches, action.payload.choice)
      if (alreadyHasValue.length) return state

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
