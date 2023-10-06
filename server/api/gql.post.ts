import { graphql } from 'graphql'
import { schema } from '@/server/gql/schema.js'
import jwt, { type JwtPayload } from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid Request form user',
    })
  }
  const contextValue: { currentUser: any | null } = { currentUser: null }
  const auth = getHeader(event, 'authorization')
  if (auth) {
    const [prefix, token] = auth.split(' ')
    if (prefix.toLowerCase() === 'bearer') {
      try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
        const current = await User.findById(id).populate('friends')
        if (!current) throw createError({
          statusCode: 400,
          statusMessage: 'Request user is null.'
        })
        contextValue.currentUser = current
      } catch (error) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Request can not be authorized.',
          data: error
        })
      }
    } else {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad authorization request'
      })
    }
  }
  const source = body.query || body
  return graphql({ schema, source, contextValue })
})
