import RadarEndpoint from './RadarEndpoint'


/**
 * Provides a way to access Endpoint contexts OUTSIDE of the
 * Endpoint's context Provider
 */
export default function RadarPortal ({id, children}) {
  return RadarEndpoint({
    id,
    children: endpoint => children(endpoint && endpoint.endpointContext)
  })
}
