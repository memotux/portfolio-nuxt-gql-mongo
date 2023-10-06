# Nuxt 3 GraphQL and MongoDB

Simple Nuxt 3 as backend form GraphQL and persisting data on MongoDB Docker container.

## Features

- Nuxt 3 as backend for GraphQL queries
- GraphQL Schema with `@graphql-tools/schema`
- GraphQL context with JWT for authorization
- GraphQL Resolvers without authorization rejected
- MongoDB Replica Docker container
- Mongoose with `nuxt-mongoose` module

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
