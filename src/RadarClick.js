import React from 'react'
import {Updater} from 'react-radar'
import {callIfExists} from '@render-props/utils'


const Click = React.memo(
  ({
    // action
    state,
    radar,
    confirm,
    // props
    as = 'button',
    childAs,
    onClick,
    innerRef,
    // Button props
    ...props
  }) => {
    props.onClick = e => {
      callIfExists(onClick, e)

      if (!confirm || confirm() === true) {
        radar.update()
      }
    }

    if (childAs) {
      props.as = childAs
    }

    props.role = props.role || 'button'

    if (state !== void 0) {
      props.radar = radar
      props.state = state
    }

    props.ref = innerRef
    return React.createElement(as, props)
  }
)

const RadarClick = React.forwardRef(
  ({query, connect, parallel, ...props}, innerRef) => (
    <Updater run={query} connect={connect} parallel={parallel}>
      {(state, radar) => {
        if (radar === void 0) {
          radar = state
          state = void 0
        }

        return <Click state={state} radar={radar} innerRef={innerRef} {...props}/>
      }}
    </Updater>
  )
)

export default RadarClick

RadarClick.WAITING = Updater.WAITING
RadarClick.LOADING = Updater.LOADING
RadarClick.DONE = Updater.DONE
RadarClick.ERROR = Updater.ERROR