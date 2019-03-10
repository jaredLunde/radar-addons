import React from 'react'
import {Formik} from 'formik'
import {callIfExists} from '@render-props/utils'
import {Updater} from 'react-radar'


export default function RadarForm ({
  // updater
  query,
  connect,
  // form state
  confirm,
  initialValues,
  enableReinitialize,
  // status changes
  onLoading,
  onError,
  onDone,
  onSubmit,
  onReset,
  // validation
  validate,
  validateOnBlur,
  validateOnChange,
  validationSchema,
  // child
  children
}) {
  let prevStatus, radarUpdater

  return (
    <Formik
      onReset={onReset}
      onSubmit={(...args) => {
        if (typeof confirm !== 'function' || confirm(...args)) {
          radarUpdater.update()
          callIfExists(onSubmit, ...args)
        }
      }}
      initialValues={initialValues}
      enableReinitialize={enableReinitialize}
      validate={validate}
      validateOnBlur={validateOnBlur}
      validateOnChange={validateOnBlur}
      validationSchema={validationSchema}
    >
      {({
        resetForm,
        isSubmitting,
        isValid,
        setSubmitting,
        handleSubmit,
        values,
        errors
      }) => (
        <Updater run={query(values)} connect={connect}>
          {(state, radar) => {
            if (radar === void 0) {
              radar = state
              state = void 0
            }

            radarUpdater = radar

            switch (radar.status) {
              case Updater.LOADING:
                if (radar.status !== prevStatus) {
                  callIfExists(onLoading, radar)
                }
                break
              case Updater.DONE:
                if (radar.status !== prevStatus) {
                  callIfExists(onDone, state, radar)
                  setSubmitting(false)
                }
                break
              case Updater.ERROR:
                if (radar.status !== prevStatus) {
                  callIfExists(onError, radar)
                  setSubmitting(false)
                }
                break
              case Updater.WAITING:
                if (isSubmitting === true) {
                  setSubmitting(false)
                }
            }

            prevStatus = radar.status

            function submit (e) {
              e.preventDefault()
              handleSubmit(e)
            }

            return children(
              {
                state,
                values,
                errors,
                isValid,
                submit,
                reset: resetForm
              },
              radar
            )
          }}
        </Updater>
      )}
    </Formik>
  )
}
