import * as React from 'react'
import { mount, route } from 'navi'

import { Help, Stacks, Orchestrator, Chat } from './views'

export const routes = mount({
  '/': route({
    view: <Help />,
  }),
  '/components': route({
    view: <Stacks />,
  }),
  '/test': route({
    view: <Orchestrator />,
  }),
  '/chat': route({
    view: <Chat />,
  }),
})
