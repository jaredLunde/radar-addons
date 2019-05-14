import {useCallback} from 'react'
import {useUpdater} from 'react-radar'


export default (run, opt = {}) => {
  const
    {confirm, ...options} = opt,
    {update} = useUpdater(run, options)
  return useCallback(
    e => {
      e.preventDefault()
      return typeof confirm !== 'function' || confirm() === true
        ? update()
        : Promise.resolve(false)
    },
    [confirm]
  )
}