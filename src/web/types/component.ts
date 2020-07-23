export type Name = string

export interface Adapter {
  endpoint: string
  platform: string // node-js, web-js, etc.
  implementation: string // express, react
}
export type Adapters = Map<Name, Adapter[]>

// export type Subscriptions = Map<Endpoint, Endpoints>
// export type Publishing = Map<Endpoint, Endpoints>

// export interface Component {
//   name: Name
//   endpoints: Endpoints
//   subscribers: Subscribers
//   publishers: Publishers
// }
