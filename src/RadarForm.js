import React from 'react'
import {Formik} from 'formik'
import {callIfExists} from '@render-props/utils'
import {Updater} from 'react-radar'


const RadarForm = (
  {
    // updater
    query,
    connect,
    async,
    // form state
    confirm,
    initialValues,
    enableReinitialize,
    // status changes
    onSubmit = () => {},
    onDone,
    onReset,
    // validation
    validate,
    validateOnBlur,
    validateOnChange,
    validationSchema,
    // child
    children,
  },
) => (
  <Formik
    onSubmit={onSubmit}
    onReset={onReset}
    initialValues={initialValues}
    enableReinitialize={enableReinitialize}
    validate={validate}
    validateOnBlur={validateOnBlur}
    validateOnChange={validateOnChange}
    validationSchema={validationSchema}
  >
    {formikBag => {
      const {resetForm, setSubmitting, isValid, handleSubmit, values, errors} = formikBag
      return (
        <Updater run={query(values)} async={async} connect={connect}>
          {(state, radar) => {
            if (radar === void 0) {
              radar = state
              state = void 0
            }

            const submit = e => {
              e.preventDefault()

              if (typeof confirm !== 'function' || confirm(values, formikBag)) {
                setSubmitting(true)
                handleSubmit(e)
                radar.update().then(() => {
                  setSubmitting(false)
                  callIfExists(onDone, formikBag, radar)
                })
                callIfExists(onSubmit, values, formikBag)
              }
            }

            return children({state, values, errors, isValid, submit, reset: resetForm}, radar)
          }}
        </Updater>
      )
    }}
  </Formik>
)

export default RadarForm

RadarForm.WAITING = Updater.WAITING
RadarForm.LOADING = Updater.LOADING
RadarForm.DONE = Updater.DONE
RadarForm.ERROR = Updater.ERROR
