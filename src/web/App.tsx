import * as React from 'react'
import { Router, View } from 'react-navi'

import { routes } from './routes'
import { Editor, Error, ErrorBoundary } from './views'

export const App = () => (
  <Router routes={routes}>
    <ErrorBoundary>
      <Editor>
        <React.Suspense fallback={<Error />}>
          <View />
        </React.Suspense>
      </Editor>
    </ErrorBoundary>
  </Router>
)
