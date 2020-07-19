// import { useSelector, useDispatch } from 'react-redux'

// import { RootState, actions } from '.'
// import { Component, Name, Endpoint } from '../types/component'

// // TODO: not sure about this one

// export const createComponent = (name: Name, endpoint: Endpoint) => {
//   const dispatch = useDispatch()
//   const endpoints = useSelector((state: RootState) => state.endpoints)

//   if (endpoints.has(name)) {
//     throw new Error(`Component with endpoint ${name} already exists.`)
//   }

//   dispatch(actions.endpoints.create(endpoint))
//   dispatch(actions.names.create(name))
// }

// export const readComponent = (name: Name): Component | false => {
//   const names = useSelector((state: RootState) => state.names)
//   const inputs = useSelector((state: RootState) => state.inputs)
//   const outputs = useSelector((state: RootState) => state.outputs)

//   if (names.has(name)) {
//     return {
//       name,
//       subscribers: inputs.get(name),
//       publishers: outputs.get(name),
//     }
//   } else {
//     return false
//   }
// }

// export const updateComponent = (name: Name, component: Partial<Component>) => {
//   const names = useSelector((state: RootState) => state.names)
//   const inputs = useSelector((state: RootState) => state.inputs)
//   const outputs = useSelector((state: RootState) => state.outputs)

//   if (names.has(name)) {
//   }
// }

// export const removeComponent = (name: Name): Component | false => {
//   const names = useSelector((state: RootState) => state.names)
//   const inputs = useSelector((state: RootState) => state.inputs)
//   const outputs = useSelector((state: RootState) => state.outputs)

//   if (names.has(name)) {
//     return {
//       name,
//       subscribers: inputs.get(name),
//       publishers: outputs.get(name),
//     }
//   } else {
//     return false
//   }
// }
