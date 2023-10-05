import { graphql } from 'graphql'
import { schema } from '@/server/gql/schema.js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body) {
    return createError({
      statusCode: 400,
      statusMessage: 'Invalid Request form user',
    })
  }
  const source = body.query || body
  return graphql({ schema, source })
})
