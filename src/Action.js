import React from 'react'
import PropTypes from 'prop-types'
import Promise from 'cancelable-promise'
import {callIfExists} from '@render-props/utils'
import {RadarConsumer} from 'react-radar'


const STATUS = {
  WAITING: 'waiting',
  LOADING: 'loading',
  FAILED: 'failed',
  DONE: 'done'
}


function removeCommit (commits, ...removedCommits) {
  for (let x = 0; x < removedCommits.length; x++) {
    commits.splice(commits.indexOf(removedCommits[x]), 1)
  }
}


export class Action extends React.PureComponent {
  static displayName = 'Action'
  static propTypes = {
    action: PropTypes.any.isRequired,
    onLoading: PropTypes.func,
    onFailed: PropTypes.func,
    onDone: PropTypes.func
  }
  static status = STATUS

  constructor (props) {
    super(props)
    this.state = {status: STATUS.WAITING}
    this.commits = []
    this.actionContext = {
      commitAction: this.commitAction,
      status: this.state.status
    }
  }

  componentWillUnmount () {
    for (let x = 0; x < this.commits.length; x++) {
      this.commits[x].cancel()
    }
  }

  commitAction = e => {
    e && e.preventDefault && e.preventDefault()

    const promisedAction = new Promise(
      resolve => {
        let {radar, action, onLoading, onDone, onFailed} = this.props
        // we are officially 'loading'
        this.setState({status: STATUS.LOADING})
        callIfExists(onLoading)

        // gets the action from props
        action = typeof action === 'function' ? action() : action

        if (action === null || action === void 0 || action === false) {
          this.setState({status: STATUS.WAITING})
          resolve()
        }

        // commits the action to radar
        action = radar.commit(action)
        // makes it cancelable
        this.commits.push(action)
        // handles resolves/rejects
        action.then(
          ({response, status}) => {
            // action was successfully posted
            this.setState({status, response})
            callIfExists(onDone)
            removeCommit(this.commits, promisedAction, action)
            resolve({status, response})
          }
        ).catch(
          (...args) => {
            console.log('Caught error:', ...args)
            this.setState({status: STATUS.FAILED})
            callIfExists(onFailed)
            removeCommit(this.commits, promisedAction, action)
            resolve(...args)
          }
        )
      }
    )

    this.commits.push(promisedAction)
    return promisedAction
  }

  render () {
    this.actionContext.status = this.state.status
    return this.props.children(this.actionContext)
  }
}


export function composeAction (name, Component) {
  function Composer ({action, onDone, onLoading, onFailed, radar, ...props}) {
    return ActionWithConsumer({
      action,
      onDone,
      onLoading,
      onFailed,
      radar,
      // can mutate because new object is created each render in Action
      children: actionContext => Component(Object.assign(props, actionContext))
    })
  }

  if (__DEV__) {
    Object.defineProperty(Composer, 'name', {value: name})
  }

  return Composer
}


export default function ActionWithConsumer ({radar, ...props}) {
  return RadarConsumer({
    children: consumerRadar => React.createElement(
      Action,
      Object.assign({radar: radar || consumerRadar, ref: props.innerRef}, props)
    )
  })
}
