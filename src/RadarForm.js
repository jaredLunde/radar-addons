import React from 'react'
import {Formik} from 'formik'
import {callIfExists} from '@render-props/utils'
import {Updater} from 'react-radar'


const RadarForm = (
  {
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
  }
) => {
  let prevStatus, radarUpdater

  return (
    <Formik
      onReset={onReset}
      onSubmit={(values, actions) => {
        actions.setSubmitting(true)

        if (typeof confirm !== 'function' || confirm(values, actions)) {
          radarUpdater.update().then(() => actions.setSubmitting(false))
          callIfExists(onSubmit, values,actions)
        }
      }}
      initialValues={initialValues}
      enableReinitialize={enableReinitialize}
      validate={validate}
      validateOnBlur={validateOnBlur}
      validateOnChange={validateOnBlur}
      validationSchema={validationSchema}
    >
      {({resetForm, isSubmitting, isValid, handleSubmit, values, errors }) => (
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
                }
                break
              case Updater.ERROR:
                if (radar.status !== prevStatus) {
                  callIfExists(onError, radar)
                }
                break
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

export default RadarForm

RadarForm.WAITING = Updater.WAITING
RadarForm.LOADING = Updater.LOADING
RadarForm.DONE = Updater.DONE
RadarForm.ERROR = Updater.ERROR
