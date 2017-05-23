export const loadStoredState = () => {
  const serializedState = localStorage.getItem('WhereIsTheBus_state')
  if(serializedState) return JSON.parse(serializedState)
}

export const updateStoredState = state => {
  const serializedState = JSON.stringify(state)
  localStorage.setItem('WhereIsTheBus_state', serializedState)
}
