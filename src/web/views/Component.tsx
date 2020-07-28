// React Component Orchestrator and Adapter
import * as React from 'react'
import { Pub, Sub } from '@prodatalab/jszmq'

const PORT = 3000

interface Adapter {
  pub: Pub
  sub: Sub
  name: string
}

export const Adapter: React.FC<Adapter> = ({ pub, sub, name }) => {
  const [data, setData] = React.useState('')

  React.useEffect(() => {
    const messageHandler = (msg: string) => {
      setData(msg.toString().substr('BROWSER_EVENTS:'.length))
    }

    sub.on('message', messageHandler)

    return () => {
      sub.removeListener('message', messageHandler)
    }
  }, [true])

  const text = React.createRef<HTMLTextAreaElement>()

  const changeHandler = () => {
    const value = text.current?.value || ''
    setData(value)
    pub.send(`SERVER_EVENTS:${value}`)
  }

  return (
    <div>
      <textarea ref={text} value={data} onChange={changeHandler} />
    </div>
  )
}

export const Orchestrator: React.FC = () => {
  const pub = new Pub()
  const sub = new Sub()

  // `chat` Component Configuration
  const config = [
    'BROWSER_CONFIG',
    {
      main: { subsciptions: ['chat_list_reversed'] },
      components: [],
    },
  ]

  React.useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'

    pub.connect(`${protocol}//localhost:${PORT}/server`)

    sub.subscribe('BROWSER_EVENTS')
    sub.connect(`${protocol}//localhost:${PORT}/browser`)

    return () => {
      pub.close()
      sub.close()
    }
  }, [true])

  return (
    <>
      <Adapter pub={pub} sub={sub} name={'chat_list_reversed'} />
      <Adapter pub={pub} sub={sub} name={'chat_input'} />
    </>
  )
}
