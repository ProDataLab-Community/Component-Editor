import * as path from 'path'
import * as http from 'http'
import * as express from 'express'
import { Pub, Sub } from '@prodatalab/jszmq'

import { PORT } from 'lib/constants'
import { HTML } from 'lib/html'
import {
  encodeActionEvent,
  decodeActionEvent,
  formatPrefix,
  Topic,
  Endpoint,
} from 'lib/interfaces'

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

// ZeroMQ Connections
const pub = new Pub()
const sub = new Sub()

pub.bind(`ws://localhost:${PORT}/browser`, server)

sub.subscribe(formatPrefix(Endpoint.Server, Topic.Chat_Message))
sub.bind(`ws://localhost:${PORT}/server`, server)

// Relay Browser Events
sub.on('message', (msg: Buffer) => {
  const { endpoint, topic, payload } = decodeActionEvent(msg)
  if (endpoint === Endpoint.Server && topic === Topic.Chat_Message) {
    pub.send(encodeActionEvent(Endpoint.Browser, topic, payload))
  }
})

// Run Server
server.listen(PORT, () => {
  console.info('listening on port', PORT)
})
