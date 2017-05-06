import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import { Loader } from '../components'

const AppContainer = ({ children }) => (
  <MuiThemeProvider>
    <main>
      <Loader />
      {children}
    </main>
  </MuiThemeProvider>
)

export default AppContainer
