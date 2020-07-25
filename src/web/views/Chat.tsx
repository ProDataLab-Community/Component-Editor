import * as React from 'react'
import { Pub, Sub } from '@prodatalab/jszmq'
import * as cuid from 'cuid'

import { createEvents, decodeEvent, formatTopic } from 'lib/interfaces'

// Styles
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

// Component
interface Message {
  id: string
  user: string
  text: string
  time: number
}

interface Test {
  pub: Pub
  sub: Sub
  type: string
}

type MessageReducer = React.Reducer<Message[], Message>
const messageReducer = (
  state: Message[],
  action: React.ReducerAction<MessageReducer>,
) => {
  return [...state, action]
}

export const ChatLog: React.FC<Test> = ({ pub, sub, type }) => {
  const [messages, dispatchMessage] = React.useReducer<MessageReducer>(
    messageReducer,
    [],
  )

  const [username, setUsername] = React.useState<string>('')

  const usernameInput = React.createRef<HTMLInputElement>()

  const { serverEvent } = createEvents(type)

  const usernameHandler = (evt: React.FormEvent) => {
    const value = usernameInput.current?.value || ''
    setUsername(value)
    pub.send(
      serverEvent<Message>({
        id: cuid(),
        user: value,
        text: `has entered the chat`,
        time: Date.now(),
      }),
    )
    evt.preventDefault()
  }

  const messageHandler = (msg: Buffer) => {
    const { type: actionType, payload } = decodeEvent<Message>(msg)
    if (actionType === type) {
      dispatchMessage(payload)
    }
  }

  React.useEffect(() => {
    sub.subscribe(formatTopic('BROWSER_EVENTS:'))
    sub.on('message', messageHandler)

    return () => {
      sub.removeListener('message', messageHandler)
      sub.unsubscribe(formatTopic('BROWSER_EVENTS:'))
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

    pub.send(
      serverEvent<Message>({
        id: cuid(),
        user: username,
        text: value,
        time: Date.now(),
      }),
    )

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
        {messages.map((message: Message) => {
          const { id, user, text } = message
          return (
            <div key={id} className="chat-message">
              <span className={colorClassHash(user)}>{user}</span>
              &nbsp;
              <span>{text}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const PORT = 3000

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

  return <ChatLog pub={pub} sub={sub} type={'CHAT_LOG'} />
}
