import * as React from 'react'
import { Pub, Sub } from 'jszmq'

const PORT = 3000

interface Test {
  pub: Pub
  sub: Sub
  name: string
}

export const Test: React.FC<Test> = ({ pub, sub, name }) => {
  const [data, setData] = React.useState('')

  React.useEffect(() => {
    // router.subscribe(topic)

    const messageHandler = (msg: string) => {
      console.log(msg.toString())
      setData(msg.toString().substr('BROWSER_EVENTS:'.length))
    }

    sub.on('message', messageHandler)

    return () => {
      // router.unsubscribe(topic)
      console.log('eh?')
      sub.removeListener('message', messageHandler)
    }
  }, [true])

  const text = React.createRef<HTMLTextAreaElement>()

  const changeHandler = () => {
    const value = text.current?.value || ''
    setData(value)
    console.log(value)
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

  React.useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'

    pub.connect(`${protocol}//localhost:${PORT}/server`)
    // pub.send([TOPIC, 'pub hello from frontend'])

    sub.subscribe('BROWSER_EVENTS')
    sub.connect(`${protocol}//localhost:${PORT}/browser`)
    // pub.send([TOPIC, 'sub hello from frontend'])

    return () => {
      console.log('no!')
      pub.close()
      sub.close()
    }
  })

  return (
    <>
      <Test pub={pub} sub={sub} name={'terrapin'} />
      <Test pub={pub} sub={sub} name={'tortoise'} />
    </>
  )
}
