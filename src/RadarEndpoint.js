import React from 'react'
import {InternalConsumer} from 'react-radar'


export default function RadarEndpoint ({id = 0, children}) {
  return (
    <InternalConsumer>
      {({getEndpoint,...other}) => children(getEndpoint(id))}
    </InternalConsumer>
  )
}
