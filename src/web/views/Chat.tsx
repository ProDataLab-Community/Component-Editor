import * as React from 'react'
import { Pub, Sub } from 'jszmq'
import * as cuid from 'cuid'

const PORT = 3000

interface Test {
  pub: Pub
  sub: Sub
  topic: string
}

const createEvents = (topic = '') => ({
  browserEvent: (data = '') => `BROWSER_EVENTS:${topic}:${data}`,
  serverEvent: (data = '') => `SERVER_EVENTS:${topic}:${data}`,
})

type MessageReducer = React.Reducer<string[], string>
const messageReducer = (
  state: string[],
  action: React.ReducerAction<MessageReducer>,
) => {
  return [...state, action]
}

export const ChatLog: React.FC<Test> = ({ pub, sub, topic }) => {
  const [messages, dispatchMessage] = React.useReducer<MessageReducer>(
    messageReducer,
    [],
  )

  const { browserEvent, serverEvent } = createEvents(topic)

  const messageHandler = (msg: string) => {
    console.log(messages)
    dispatchMessage(msg.toString().substr(browserEvent().length))
  }

  React.useEffect(() => {
    sub.subscribe(browserEvent())
    sub.on('message', messageHandler)

    return () => {
      sub.removeListener('message', messageHandler)
      sub.unsubscribe(browserEvent())
    }
  }, [true])

  const text = React.createRef<HTMLTextAreaElement>()

  const submitHandler = (evt: React.FormEvent) => {
    const value = text.current?.value || ''
    pub.send(serverEvent([cuid(), value].join(':')))
    evt.preventDefault()
  }

  return (
    <div className="chat">
      <div className="chat-header">Turtle Chat</div>
      <form autoComplete="false" onSubmit={submitHandler}>
        <textarea ref={text} />
        <input type="submit" value="Send" />
      </form>
      <div className="chat-log">
        {messages.map((message: string) => {
          const [id, text] = message.split(':')
          return (
            <div key={id} className="chat-message">
              {text}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const Chat: React.FC = () => {
  const pub = new Pub()
  const sub = new Sub()

  React.useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'

    pub.connect(`${protocol}//localhost:${PORT}/server`)
    sub.connect(`${protocol}//localhost:${PORT}/browser`)

    return () => {
      pub.close()
      sub.close()
    }
  })

  return <ChatLog pub={pub} sub={sub} topic={'CHAT_LOG'} />
}
