import { SAVE_SEARCH, SAVE_SHAPE, SAVE_LINES } from '../constants/actionTypes'

export const saveSearch = payload => ({
  type: SAVE_SEARCH,
  payload
})

export const saveShape = payload => ({
  type: SAVE_SHAPE,
  payload
})

export const saveLines = payload => ({
  type: SAVE_LINES,
  payload
})
