import React from 'react'
import { HeaderBar, SearchBox, Map, FloatingMenu } from '../containers'
import { buildRoutePath } from '../utils'

function Home (props) {
  return (
    <div>
      <HeaderBar>
        <SearchBox
          inputPlaceholder="Qual ônibus deseja encontrar?"
          onNewRequest={choice => buildRoutePath(choice) }
        />
      </HeaderBar>
      <FloatingMenu />
      <Map />
    </div>
  )
}

export default Home
