import React from 'react'
import { HeaderBar, SearchBox, Map, FloatingMenu } from '../containers'
import { buildRoutePath } from '../utils'

function Home (props) {
  return (
    <section>
      <HeaderBar>
        <SearchBox
          inputPlaceholder="Qual ônibus deseja encontrar?"
          onNewRequest={choice => buildRoutePath(choice) }
        />
      </HeaderBar>
      <FloatingMenu />
      <Map />
    </section>
  )
}

export default Home
