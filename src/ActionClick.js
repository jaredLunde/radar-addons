import React from 'react'
import PropTypes from 'prop-types'
import {callIfExists} from '@render-props/utils'
import Action, {composeAction} from './Action'


class PlainClick_ extends React.PureComponent {
  static displayName = 'PlainClick'

  render () {
    const {
      // action
      commitAction,
      status,
      confirm,
      // router
      history,
      location,
      match,
      staticContext,
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
        commitAction(e)
      }
    }

    if (childNodeType) {
      props.nodeType = buttonType
    }
    props.role = props.role || 'button'

    return React.createElement(nodeType, props)
  }
}


function PlainClick (props) {
  // composeAction takes a function, hence this wrapper
  return React.createElement(PlainClick_, props)
}


export const ActionClick = composeAction('ActionClick', PlainClick)
