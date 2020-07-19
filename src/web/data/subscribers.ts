// import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// import { Name, Names, Subscribers } from '../types/component'

// const initialState: Subscribers = new Map<Name, Names>()

// interface InputPayload {
//   subscriber: Name
//   publisher: Name
// }

// export const subscribers = createSlice({
//   name: 'inputs',
//   reducers: {
//     create: (state, action: PayloadAction<InputPayload>) => {
//       const { subscriber } = action.payload

//       if (subscriber) {
//       }

//       state.set(name)
//     },
//     update: (state, action: PayloadAction<Name>) => {
//       const name = action.payload
//       const prev = state.get(name)

//       if (prev) {
//         state.set(name)
//       }

//       state.set(name)
//     },
//     delete: (state, action: PayloadAction<Name>) => {
//       const name = action.payload

//       state.delete(name)
//     },
//   },
//   initialState,
// })
