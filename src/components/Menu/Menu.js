import React, { Component } from 'react'
import { connect } from 'react-redux'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import MenuIcon from 'material-ui/svg-icons/navigation/menu'
import SearchIcon from 'material-ui/svg-icons/action/search'
import MenuItem from 'material-ui/MenuItem'
import Drawer from 'material-ui/Drawer'

import { updateSearchBox } from '../../actions'
import styles from './Menu.css'

class Menu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      openDrawer: false
    }
  }

  openDrawer (action) {
    this.setState({
      openDrawer: action || !this.state.openDrawer
    })
  }

  openSearchBox () {
    this.props.updateSearchBox({ visible: true })
  }

  classNames (el) {
    switch (el) {
      case 'searchButton':
        return [
          styles.searchButton,
          this.props.searchBoxState.visible ? styles.hidden : ''
        ].join(' ')

      default:
    }
  }

  render () {
    return (
      <div>
        <FloatingActionButton
          mini={true}
          className={styles.menuButton}
          onTouchTap={() => this.openDrawer() }>
          <MenuIcon />
        </FloatingActionButton>
        <Drawer
          open={this.state.openDrawer}
          docked={false}
          onRequestChange={action => this.openDrawer(action)}>
          <MenuItem>Menu Item</MenuItem>
          <MenuItem>Menu Item 2</MenuItem>
        </Drawer>
        <FloatingActionButton
          mini={true}
          className={this.classNames('searchButton')}
          backgroundColor='#ccc'
          onTouchTap={() => this.openSearchBox() }>
          <SearchIcon />
        </FloatingActionButton>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  searchBoxState: state.searchBoxState
})

const mapDispatchToProps = dispatch => ({
  updateSearchBox: payload => dispatch(updateSearchBox(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(Menu)
