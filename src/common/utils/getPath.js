import _ from 'lodash'
import { isBrowser } from './env'

export default (ctx = {}) => {
  if (!isBrowser) return _.get(ctx, 'url', '')
  // Get path from location.
  return _.first(_.get(window, 'location.pathname').split('?'))
}
