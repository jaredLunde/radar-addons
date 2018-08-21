import React from 'react'
import PropTypes from 'prop-types'
import objectFromForm from 'object-from-form'
import emptyObj from 'empty/object'
import Action from './Action'


export class ActionForm extends React.Component {
  static propTypes = {
    initialData: PropTypes.object,
    confirm: PropTypes.func
  }

  form = null
  setRef = e => this.form = e

  getFormData = () => {
    const initialData = this.props.initialData || {}
    return {...initialData, ...objectFromForm(this.form)}
  }

  getAction = () => {
    const formData = this.getFormData()

    if (this.props.confirm && this.props.confirm(formData) === false) {
      return null
    }

    return this.props.action(formData)
  }

  render () {
    return this.props.children({
      formRef: this.setRef,
      action: this.getAction,
      getFormData: this.getFormData
    })
  }
}


export default function ActionFormBox ({
  action,
  confirm,
  initialData = emptyObj,
  innerRef,
  onLoading,
  onFailed,
  onDone,
  ...props
}) {
  return (
    <ActionForm confirm={confirm} action={action} initialData={initialData}>
      {function ({action, getFormData, formRef}) {
        return (
          Action({
            action,
            onLoading,
            onFailed,
            onDone,
            innerRef,
            children: function (actionContext) {
              return props.children({
                ...actionContext,
                getFormData,
                formRef
              })
            }
          })
        )
      }}
    </ActionForm>
  )
}
