import React from 'react'
import PropTypes from 'prop-types'
import {Updater} from 'react-radar'
import {callIfExists} from '@render-props/utils'


class Click extends React.PureComponent {
  static displayName = 'Click'

  render () {
    const {
      // action
      state,
      radar,
      confirm,
      // props
      nodeType = 'button',
      childNodeType,
      onClick,
      // Button props
      ...props
    } = this.props

    props.onClick = e => {
      callIfExists(onClick, e)

      if (!confirm || confirm() === true) {
        radar.update()
      }
    }

    if (childNodeType) {
      props.nodeType = buttonType
    }
    props.role = props.role || 'button'
    props.radar = radar

    if (state !== void 0) {
      props.state = state
    }

    return React.createElement(nodeType, props)
  }
}

export default function RadarClick ({query, connect, parallel, ...props}) {
  <Updater run={props.query} connect={connect} parallel={parallel}>
    {(state, radar) => {
      if (radar === void 0) {
        radar = state
        state = void 0
      }

      return <Click state={state} radar={radar} {...props}/>
    }}
  </Updater>
}
