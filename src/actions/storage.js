import { SAVE_SEARCH, SAVE_SHAPE } from '../constants/actionTypes'

export const saveSearch = payload => ({
  type: SAVE_SEARCH,
  payload
})

export const saveShape = payload => ({
  type: SAVE_SHAPE,
  payload
})
