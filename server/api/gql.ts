import { graphql } from 'graphql'
import schema from '@/server/gql/schema'
import jwt, { type JwtPayload } from "jsonwebtoken";
import { createHandler } from 'graphql-sse/lib/use/http'

const handler = createHandler({
  schema,
  context: async (req) => {
    const auth = req.headers.get('authorization')
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
          return { currentUser: current }
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
  }
})


export default defineEventHandler(async (event) => {

  return handler(event.node.req, event.node.res)
  // const source = body.query || body
  // return graphql({ schema, source, contextValue })
})
