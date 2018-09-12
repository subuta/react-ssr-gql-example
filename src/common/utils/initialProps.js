import React from 'react'

import _ from 'lodash'
import { isBrowser } from './env'
import getPath from './getPath'

const KEY = '__INITIAL_PROPS__'

export const getInitialPropsFromComponent = async (Component) => {
  // Use getInitialProps if exists.
  const getInitialProps = Component.getInitialProps || (() => Promise.resolve())

  // Await for resolving initialProps promise.
  const result = await getInitialProps()

  return result || {}
}

// Keep initialProps reference to ctx.
export const rememberInitialProps = (initialProps, ctx) => {
  // Set initialProps to window if browser
  if (isBrowser) return _.set(window, [KEY], initialProps)
  _.set(ctx, 'res.locals', { initialProps })
}

export const forgetInitialProps = () => {
  if (!isBrowser) return
  // Clear initialProps from window if browser
  _.set(window, [KEY], null)
}

// Get initialProps from ctx.
export const getInitialProps = (ctx = {}) => {
  // Get initialProps from window if browser
  if (isBrowser) return _.get(window, [KEY], null)
  // Get initialProps from ctx otherwise.
  return _.get(ctx, 'res.locals.initialProps', null)
}

// Get initialProps from ctx.
export const getInitialPropsFromContext = (context) => {
  // Access ctx from react-router's staticContext.
  const ctx = _.get(context, 'ctx', {})

  // get currentPath and initialProps.
  const currentPath = getPath(ctx)

  // get initialProps ctx/window (if SSR)
  return _.get(getInitialProps(ctx), currentPath, null)
}

const getScriptContent = (ctx) => {
  // Retrieve initialProps for page.
  const initialProps = getInitialProps(ctx)
  return `window.${KEY} = ${JSON.stringify(initialProps)};`
}

export const getScriptTag = (ctx) => {
  return `<script>${getScriptContent(ctx)}</script>`
}

export const getScriptElement = (ctx) => {
  return (
    <script dangerouslySetInnerHTML={{ __html: getScriptContent(ctx) }} />
  )
}
