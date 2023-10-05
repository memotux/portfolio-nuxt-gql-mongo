import { authors } from "@/server/gql/data"

export default defineNitroPlugin(() => {
  const config = useRuntimeConfig()
  if (config.seedDb) {
    author.insertMany(authors)
  }
})
