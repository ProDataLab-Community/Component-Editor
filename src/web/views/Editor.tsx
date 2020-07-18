import * as React from 'react'
import { useCurrentRoute } from 'react-navi'

export const Editor: React.FC = ({ children }) => {
  const route = useCurrentRoute()

  return <div id="editor">{children}</div>
}
