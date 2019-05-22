import React from 'react'
import {Formik} from 'formik'
import {useRadar} from 'react-radar'


const noop = () => {}
const RadarForm = ({query, async, onDone, confirm, children, onSubmit = noop, ...formikProps}) => {
  const radar = useRadar()
  query = Array.isArray(query) ? query : [query]

  return (
    <Formik onSubmit={onSubmit} {...formikProps}>
      {formik => {
        const submit =  e => {
          e.preventDefault()

          if (typeof confirm !== 'function' || confirm(formik.values, formik)) {
            formik.setSubmitting(true)
            formik.handleSubmit(e)
            return radar.commit(query.map(q => q(formik.values)), {async}).then(response => {
              formik.setSubmitting(false)
              typeof onDone === 'function' && onDone(formik, response)
            })
          }

          return Promise.resolve(false)
        }

        return children({...formik, handleSubmit: submit, submit})
      }}
    </Formik>
  )
}

export default RadarForm
