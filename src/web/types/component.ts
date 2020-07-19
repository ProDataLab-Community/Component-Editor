export type Endpoint = string // Socket connection string
export type Endpoints = Set<Endpoint>

export type Implementation = string // e.g. nodejs, react, etc.
export type Implementations = Map<Implementation, Endpoint>

export type Name = string
export type Names = Map<Endpoint, Name>

export type Subscribers = Map<Endpoint, Endpoints>
export type Publishers = Map<Endpoint, Endpoints>

export interface Component {
  name: Name
  endpoints: Endpoints
  subscribers: Subscribers
  publishers: Publishers
}
