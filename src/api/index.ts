import * as path from 'path'
import * as http from 'http'
import * as express from 'express'
import { Pub, Sub } from '@prodatalab/jszmq'
import { encode, decode } from '@msgpack/msgpack'

import { PORT } from '../lib/constants'
import { HTML } from '../lib/html'

const { NODE_ENV } = process.env

// HTTP Server
const app = express()

const dist = path.resolve(process.cwd(), 'lib', 'dist')

const serveFile = (file: string, mime: string) =>
  app.get(file, (_req, res) => {
    res.set({ 'Content-Type': mime })
    res.sendFile(path.join(dist, file), mime)
  })

serveFile('/main.js', 'text/javascript')
serveFile('/styles.css', 'text/css')

app.get('*', (req, res) => {
  const { path } = req
  console.info(path)
  res.send(HTML(NODE_ENV))
})

const server = http.createServer(app)

// Serialization
interface ActionEvent<T> {
  type: string
  payload: T
}

const formatTopic = (str: string) => Buffer.from(encode([str])).slice(0, -1)

const createEvents = (type = '') => ({
  browserEvent: <T extends {}>(payload: T) =>
    Buffer.from(encode(['BROWSER_EVENTS:', { type, payload }])),
  serverEvent: <T extends {}>(payload: T) =>
    Buffer.from(encode(['SERVER_EVENTS:', { type, payload }])),
})

const decodeEvent = <T extends {}>(msg: Buffer): ActionEvent<T> => {
  const [_topic, action] = decode(msg) as [string, ActionEvent<T>]
  return action
}

// ZeroMQ Connections
const pub = new Pub()
const sub = new Sub()

pub.bind(`ws://localhost:${PORT}/browser`, server)

sub.subscribe(formatTopic('SERVER_EVENTS:'))
sub.bind(`ws://localhost:${PORT}/server`, server)

// Events
sub.on('message', (msg: Buffer) => {
  const action = decodeEvent(msg)
  console.info(JSON.stringify(action, null, 2))
  const { browserEvent } = createEvents(action.type)
  pub.send(browserEvent(action.payload))
})

// Run Server
server.listen(PORT, () => {
  console.info('listening on port', PORT)
})
