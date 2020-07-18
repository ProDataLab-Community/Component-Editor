import * as path from 'path'
import * as express from 'express'

import { PORT } from '../lib/constants'
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

app.get('/', (req, res) => {
  const { path } = req
  console.info(path)
  res.send(HTML(NODE_ENV))
})

app.listen(PORT, () => {
  console.info('listening on port', PORT)
})
