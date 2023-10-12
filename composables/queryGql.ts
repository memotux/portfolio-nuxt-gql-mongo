import { type RequestParams, createClient, type ExecutionResult } from 'graphql-sse'
import type { UnwrapRef } from 'vue'

const client = createClient({
  url: 'http://localhost:3000/api/gql',
  headers() {
    const token = useCookie('tux-user-token')
    if (token.value) {
      return {
        Authorization: `Bearer ${token.value as string}`
      }
    }
    return {} as Record<string, string>
  },
})

export const useAsyncGqlQuery = <T>(key: string, params: RequestParams) => useAsyncData<T>(key, async () => (await useGqlQuery(params)).data.value as T)

export const useGqlQuery = async <T = Record<string, unknown>>(params: RequestParams) => {
  // TODO: validate query operation: NOT Subscription
  let res: AsyncIterableIterator<ExecutionResult<T, unknown>> | null = null
  try {
    res = client.iterate<T>(params)
    const next = await res.next()

    await res.return!()
    return { data: ref<T>(next.value.data) }
  } catch (err) {
    console.error(err)
    if (res) {
      await res.throw!(err)
    }
    throw err
  }
}

export const useGqlSub = <T>(query: RequestParams['query']) => {
  // TODO: validate query operation: ONLY Subscriptions
  const data = ref<T | null>(null)

  const dispose = client.subscribe<T>({ query }, {
    next: (d) => {
      if (d.data) {
        data.value = d.data as UnwrapRef<T>
      }

      if (d.errors) {
        throw d.errors
      }

    },
    error: (e) => console.error(e),
    complete: () => console.log('subscription completed')

  })

  return { data, dispose }
}

export const graphiFetcher = async <T = Record<string, unknown>>(params: RequestParams) => {
  return client.iterate<T>(params)
}