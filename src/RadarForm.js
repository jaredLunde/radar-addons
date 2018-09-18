import React from 'react'
import PropTypes from 'prop-types'
import {callIfExists} from '@render-props/utils'
import objectFromForm from 'object-from-form'
import emptyObj from 'empty/object'
import {Updater} from 'react-radar'


export class Form extends React.Component {
  static propTypes = {
    initialData: PropTypes.object,
    confirm: PropTypes.func
  }

  form = null
  setRef = e => this.form = e

  getFormData = () => {
    const initialData = this.props.initialData || emptyObj
    return Object.assign({}, initialData, objectFromForm(this.form))
  }

  getQueries = () => {
    let {confirm, query} = this.props
    const formData = this.getFormData()

    if (confirm && confirm(formData) === false) {
      return []
    }

    return query(formData)
  }

  render () {
    return this.props.children({
      formRef: this.setRef,
      run: this.getQueries(),
      getFormData: this.getFormData
    })
  }
}


export default function RadarForm ({
  // updater
  query,  // function
  connect,
  parallel,
  // query
  confirm,
  initialData,
  // status changes
  onLoading,
  onError,
  onDone,
  // child
  children
}) {
  let prevStatus

  return (
    <Form confirm={confirm} query={query} initialData={initialData}>
      {function ({run, getFormData, formRef}) {
        return Updater({
          run,
          connect,
          parallel,
          children: (state, radar) => {
            if (radar === void 0) {
              radar = state
              state = void 0
            }

            if (radar.status !== prevStatus) {
              prevStatus = radar.status

              switch (radar.status) {
                case Updater.LOADING:
                  callIfExists(onLoading, radar)
                  break;
                case Updater.DONE:
                  callIfExists(onDone, state, radar)
                  break;
                case Updater.ERROR:
                  callIfExists(onError, radar)
                  break;
              }
            }

            return props.children({getFormData, formRef, state, radar})
          }
        })
      }}
    </Form>
  )
}
