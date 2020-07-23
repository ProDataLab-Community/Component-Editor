import * as React from 'react'
import { Pub, Sub } from '@prodatalab/jszmq'
import * as cuid from 'cuid'

const PORT = 3000

interface Test {
  pub: Pub
  sub: Sub
  topic: string
}

const colorClasses = [
  'flat-green-1',
  'flat-green-2',
  'flat-green-3',
  'flat-green-4',
  'flat-blue-1',
  'flat-blue-2',
  'flat-blue-3',
  'flat-blue-4',
  'flat-purple-1',
  'flat-purple-2',
  'flat-yellow-1',
  'flat-orange-1',
  'flat-orange-2',
  'flat-orange-3',
  'flat-red-1',
  'flat-red-2',
]

const classNames = (...classes: string[]): string => {
  return classes.join(' ')
}

const colorClassHash = (str: string) => {
  const total = str
    .split('')
    .reduce((acc, char: string) => acc + char.charCodeAt(0), 0)

  return colorClasses[total % colorClasses.length]
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

  const [username, setUsername] = React.useState<string>('')

  const usernameInput = React.createRef<HTMLInputElement>()

  const usernameHandler = (evt: React.FormEvent) => {
    const value = usernameInput.current?.value || ''
    setUsername(value)
    pub.send(serverEvent([cuid(), value, `has entered the chat`].join(':')))
    evt.preventDefault()
  }

  const { browserEvent, serverEvent } = createEvents(topic)

  const messageHandler = (msg: string) => {
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

  if (!username.length) {
    return (
      <div className="chat">
        <form autoComplete="false" onSubmit={usernameHandler}>
          <input
            type="text"
            ref={usernameInput}
            className={classNames('username', username)}
            placeholder="Your Username"
          />
          <input type="submit" value="Set Username" />
        </form>
      </div>
    )
  }

  const text = React.createRef<HTMLInputElement>()

  const submitHandler = (evt: React.FormEvent) => {
    const value = text.current?.value || ''
    pub.send(serverEvent([cuid(), username, value].join(':')))
    if (text.current) {
      text.current.value = ''
    }
    evt.preventDefault()
  }

  return (
    <div className="chat">
      <div className="chat-header">Turtle Chat</div>
      <form autoComplete="false" onSubmit={submitHandler}>
        <input type="text" ref={text} />
        <input type="submit" value="Send" />
      </form>
      <div className="chat-log">
        {messages.map((message: string) => {
          const [id, username, text] = message.split(':')
          return (
            <div key={id} className="chat-message">
              <span className={colorClassHash(username)}>{username}</span>
              &nbsp;
              <span>{text}</span>
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
