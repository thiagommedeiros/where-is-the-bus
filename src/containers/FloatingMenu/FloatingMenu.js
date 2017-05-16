import React from 'react'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh'

const FloatingMenu = props => (
  <div>
    <FloatingActionButton
      mini={true}
      className="refreshButton"
      backgroundColor="#ccc"
      onTouchTap={() => {}}>
      <RefreshIcon />
    </FloatingActionButton>
  </div>
)


export default FloatingMenu
