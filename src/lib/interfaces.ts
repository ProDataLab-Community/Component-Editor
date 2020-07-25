import { encode, decode } from '@msgpack/msgpack'
import { Buffer } from 'buffer'

// Serialization
export interface ActionEvent<T> {
  type: string
  payload: T
}

export const formatTopic = (str: string) =>
  Buffer.from(encode([str])).slice(0, -1)

export const createEvents = (type = '') => ({
  browserEvent: <T extends {}>(payload: T) =>
    Buffer.from(encode(['BROWSER_EVENTS:', { type, payload }])),
  serverEvent: <T extends {}>(payload: T) =>
    Buffer.from(encode(['SERVER_EVENTS:', { type, payload }])),
})

export const decodeEvent = <T extends {}>(msg: Buffer): ActionEvent<T> => {
  const [_topic, action] = decode(msg) as [string, ActionEvent<T>]
  return action
}
