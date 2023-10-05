import { makeExecutableSchema } from '@graphql-tools/schema'
import { authors, posts } from './data.js'
import { createError } from 'h3'

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
  type Post {
    id: ID!
    authorId: ID!
    title: String
    votes: Int 
  }

  type Query {
    countAuthors: Int!
    allAuthors: [Author]!
    findAuthor(firstName: String!): Author
  }

  input CreateAuthorInput {
    firstName: String!
    lastName: String!
  }

  type Mutation {
    createAuthor(input: CreateAuthorInput): Author
  }
`

const resolvers = {
  Query: {
    countAuthors: () => author.count(),
    allAuthors: () => author.find(),
    findAuthor: (_: undefined, args: typeof authors[0]) => author.findOne({ firstName: args.firstName }),
  },
  Mutation: {
    async createAuthor(_: undefined, { input }: { input: Omit<typeof authors[0], 'id'> }) {
      if (
        await author.findOne({ firstName: input.firstName, lastName: input.lastName })
      ) {
        return createError('User must be unique')
      }
      const newAuthor = new author({ ...input })

      return newAuthor.save()
    },
  },
  Author: {
    fullName: (root: typeof authors[0]) => `${root.firstName} ${root.lastName}`,
  },
}

export const schema = makeExecutableSchema({ typeDefs, resolvers })
