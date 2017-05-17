import React from 'react'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh'

import { refresh } from '../../utils'
import styles from './FloatingMenu.css'

function FloatingMenu () {
  return (
    <FloatingActionButton
      className={styles.refreshButton}
      mini={true}
      backgroundColor="#ccc"
      onTouchTap={() => refresh()}>
      <RefreshIcon />
    </FloatingActionButton>
  )
}

export default FloatingMenu
