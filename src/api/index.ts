import * as path from 'path'
import * as http from 'http'
import * as express from 'express'
import { Pub, Sub } from 'jszmq'

import { PORT, CONNECTION } from '../lib/constants'
import { HTML } from '../lib/html'

const { NODE_ENV } = process.env

const app = express()

const dist = path.resolve(__dirname, '..', 'dist')

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

const pub = new Pub()
const sub = new Sub()

pub.bind(`ws://localhost:${PORT}/browser`, server)

sub.subscribe('SERVER_EVENTS')
sub.bind(`ws://localhost:${PORT}/server`, server)

sub.on('message', (msg: string) => {
  console.log('msg', msg.toString())
  pub.send(`BROWSER_EVENTS:${msg.toString().substr('SERVER_EVENTS:'.length)}`)
})

// sub.on('attach', (x) => {
//   console.log('client attached', x)
//   pub.send([TOPIC, 'client ready'])
// })

// pub.on('attach', (x) => {
//   console.log('client attached', x)
//   pub.send('client ready')
// })

// pub.on('message', (x) => {
//   console.log('client attached', x)
//   pub.send('client ready')
// })

setInterval(() => {
  console.log('sending work')
  pub.send('BROWSER_EVENTS:some work')
}, 10000)

server.listen(PORT, () => {
  console.info('listening on port', PORT)
})
