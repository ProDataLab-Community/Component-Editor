import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Endpoint, Endpoints } from '../types/component'

const initialState: Endpoints = new Set<Endpoint>()

export const endpoints = createSlice({
  name: 'endpoints',
  reducers: {
    create: (state, action: PayloadAction<Endpoint>) => {
      const name = action.payload

      state.add(name)
    },
    update: (state, action: PayloadAction<Endpoint>) => {
      const name = action.payload
      const prev = state.has(name)

      if (prev) {
        state.delete(name)
      }

      state.add(name)
    },
    delete: (state, action: PayloadAction<Endpoint>) => {
      const name = action.payload

      state.delete(name)
    },
  },
  initialState,
})
