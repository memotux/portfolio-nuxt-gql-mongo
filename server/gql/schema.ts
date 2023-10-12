import { makeExecutableSchema } from '@graphql-tools/schema'
import jwt from 'jsonwebtoken'
import { createError } from 'h3'
import { GraphQLError } from 'graphql'
import { PubSub } from 'graphql-subscriptions';
import type { authors, posts } from './data.js'
import type { IResolvers, TypeSource } from '@graphql-tools/utils'

export interface CtxUser { currentUser: any | null }

const pubsub = new PubSub();

const PUBSUB_EVENTS = {
  CREATE_USER: 'CREATE_USER'
}

export const typeDefs: TypeSource = /* GraphQL */ `
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
    friends: [User]!
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
    allUsers: [User]!
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
    deleteUser(id: ID!): User
    login(userName: String!, password: String!): Token
    addUserFriend(id: ID!): User
  }

  type Subscription {
    onCreateUser: [User]
  }
`

const resolvers: IResolvers = {
  Query: {
    countAuthors: () => Author.count(),
    allAuthors: () => Author.find(),
    allUsers: () => User.find().populate('friends'),
    findAuthor: (_: undefined, args: typeof authors[0]) => Author.findOne({ firstName: args.firstName }),
    me: (_r, _a, ctx: CtxUser) => ctx?.currentUser || null
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
    createUser: async (_r, args, ctx: CtxUser) => {
      if (await User.findOne({ userName: args.userName })) {
        throw createError('User already exist.')
      }

      const newUser = new User({ userName: args.userName })

      try {
        const res = await (await newUser.save()).populate('friends')
        if (ctx?.currentUser) {
          try {
            ctx.currentUser.friends = ctx.currentUser.friends.concat(res)
            await ctx.currentUser.save()
          } catch (error) {
            throw new GraphQLError('Error on updating current User.', { originalError: error as Error })
          }
        }
        pubsub.publish(PUBSUB_EVENTS.CREATE_USER, { ...res.toObject() })
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
    },
    async deleteUser(_: undefined, args: { id: string }, ctx: { currentUser: CtxUser }) {
      if (!ctx.currentUser) {
        throw new GraphQLError('Not Authorized.')
      }
      try {
        const doc = await User.findByIdAndDelete(args.id)
        if (doc) {
          return doc
        }
        throw new GraphQLError('User can not be deleted')

      } catch (error) {
        throw new GraphQLError('Error deleting user.', { originalError: error as Error })
      }
    }
  },
  Author: {
    fullName: (root: typeof authors[0]) => `${root.firstName} ${root.lastName}`,
  },
  Subscription: {
    onCreateUser: {
      resolve: () => {
        return User.find().populate('friends')
      },
      subscribe: () => pubsub.asyncIterator(PUBSUB_EVENTS.CREATE_USER)
    }
  }
}

export default makeExecutableSchema({ typeDefs, resolvers })
