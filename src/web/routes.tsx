import * as React from 'react'
import { mount, route } from 'navi'

import { Help } from './views'

export const routes = mount({
  '/': route({
    view: <Help />,
  }),
})
