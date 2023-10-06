import { makeExecutableSchema } from '@graphql-tools/schema'
import { authors, posts } from './data.js'
import { createError } from 'h3'
import jwt from 'jsonwebtoken'
import { GraphQLError } from 'graphql'

export interface CtxUser { currentUser: any | null }

const typeDefs = `#graphql
  type Author {
    _id: ID!
    id: ID
    firstName: String!
    lastName: String!
    fullName: String!
    createdAt: String
    updatedAt: String
  }
  type User {
    _id: ID!
    userName: String!
    friends: [User!]
    createdAt: String
    updatedAt: String
  }
  type Post {
    id: ID!
    authorId: ID!
    title: String
    votes: Int 
  }

  type Token {
    value: String!
  }

  type Query {
    countAuthors: Int!
    allAuthors: [Author]!
    findAuthor(firstName: String!): Author
    me: User
  }

  input CreateAuthorInput {
    firstName: String!
    lastName: String!
  }

  type Mutation {
    createAuthor(input: CreateAuthorInput): Author
    createUser(userName: String!): User
    login(userName: String!, password: String!): Token
    addUserFriend(id: ID!): User
  }
`

const resolvers = {
  Query: {
    countAuthors: () => Author.count(),
    allAuthors: () => Author.find(),
    findAuthor: (_: undefined, args: typeof authors[0]) => Author.findOne({ firstName: args.firstName }),
    me: (_r: undefined, _a: undefined, ctx: CtxUser) => ctx.currentUser
  },
  Mutation: {
    async createAuthor(_: undefined, { input }: { input: Omit<typeof authors[0], 'id'> }, ctx: CtxUser) {
      if (!ctx.currentUser) {
        throw createError({
          statusCode: 403,
          statusMessage: 'Not Authorized.'
        })
      }
      if (
        await Author.findOne({ firstName: input.firstName, lastName: input.lastName })
      ) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Invalid request.'
        })
      }
      const newAuthor = new Author({ ...input })

      return newAuthor.save()
    },
    createUser: async (_: undefined, args: { userName: string }, ctx: CtxUser) => {
      if (await User.findOne({ userName: args.userName })) {
        throw createError('User already exist.')
      }

      const newUser = new User({ userName: args.userName })

      try {
        const res = await newUser.save()
        if (ctx.currentUser) {
          try {
            ctx.currentUser.friends = ctx.currentUser.friends.concat(res)
            await ctx.currentUser.save()
          } catch (error) {
            throw new GraphQLError('Error on updating current User.', { originalError: error as Error })
          }
        }
        return res || null
      } catch (error) {
        return createError({
          statusMessage: 'Error on saving new user',
          statusCode: 500,
          data: error
        })
      }
    },
    login: async (_: undefined, args: { userName: string, password: string }) => {
      const logged = await User.findOne({ userName: args.userName })

      if (!logged || args.password !== 'secret') {
        throw createError('Invalid credentials form User.')
      }

      const forToken = {
        userName: logged.userName,
        id: logged._id
      }

      return {
        value: jwt.sign(forToken, process.env.JWT_SECRET!)
      }
    },
    async addUserFriend(_: undefined, args: { id: string }, ctx: CtxUser) {
      if (!ctx.currentUser) {
        throw new GraphQLError('Not Authorized.')
      }
      let friend: any
      try {
        friend = await User.findById(args.id)

      } catch (error) {
        throw new GraphQLError('Error on finding your friend.', { originalError: error as Error })
      }

      if (!friend) throw new GraphQLError('Friend not exist.')

      if (ctx.currentUser.friends.length > 0 && !ctx.currentUser.friends.find((f: any) => f._id === friend._id)) {
        return null
      }

      try {
        ctx.currentUser.friends = ctx.currentUser.friends.concat(friend)
        return await ctx.currentUser.save()
      } catch (error) {
        throw new GraphQLError('Error adding User Friend', { originalError: error as Error });
      }
    }
  },
  Author: {
    fullName: (root: typeof authors[0]) => `${root.firstName} ${root.lastName}`,
  },
}

export const schema = makeExecutableSchema({ typeDefs, resolvers })
