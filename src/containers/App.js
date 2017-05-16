import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import { Loader } from './'

const App = ({ children }) => (
  <MuiThemeProvider>
    <main>
      <Loader />
      {children}
    </main>
  </MuiThemeProvider>
)

export default App
