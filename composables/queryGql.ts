import { type RequestParams, createClient, type ExecutionResult, Sink } from 'graphql-sse'
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

export const useAsyncGqlQuery = <R>(key: string, params: RequestParams) => useAsyncData<R>(key, async () => (await useGqlQuery(params)).data.value as R)

export const useGqlQuery = async <R = Record<string, unknown>>(params: RequestParams) => {
  // TODO: validate query operation: NOT Subscription
  let res: AsyncIterableIterator<ExecutionResult<R, unknown>> | null = null
  try {
    res = client.iterate<R>(params)
    const next = await res.next()

    await res.return!()
    return { data: ref<R>(next.value.data) }
  } catch (err) {
    console.error(err)
    if (res) {
      await res.throw!(err)
    }
    throw err
  }
}

export const useGqlSub = <R, E = unknown>(params: RequestParams, sink?: Sink<ExecutionResult<R, E>>) => {
  // TODO: validate query operation: ONLY Subscriptions

  if (sink) {
    const dispose = client.subscribe<R>(params, sink)
    return { dispose }
  }
  const data = ref<R | null>(null)
  const dispose = client.subscribe<R>(params, {
    next: (d) => {
      if (d.data) {
        data.value = d.data as UnwrapRef<R>
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

export const graphiFetcher = async <R>(params: RequestParams) => {
  return client.iterate<R>(params)
}