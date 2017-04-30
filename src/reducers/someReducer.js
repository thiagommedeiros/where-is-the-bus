const someReducer = (state = {}, action = {}) => {
  switch (action.type) {
    case 'SOME_ACTION':
      return state

    default:
      return state
  }
}

export default someReducer
