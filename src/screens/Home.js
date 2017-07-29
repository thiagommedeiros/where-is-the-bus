import React from 'react'
import { HeaderBar, SearchBox, Map, FloatingMenu } from '../containers'
import { buildRouteShape } from '../utils'

function Home (props) {
  return (
    <section>
      <HeaderBar>
        <SearchBox
          inputPlaceholder="Qual ônibus deseja encontrar?"
          onNewRequest={choice => buildRouteShape(choice) }
        />
      </HeaderBar>
      <FloatingMenu />
      <Map />
    </section>
  )
}

export default Home
