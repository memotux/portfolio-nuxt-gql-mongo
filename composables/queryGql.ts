import { type RequestParams, createClient, type ExecutionResult } from 'graphql-sse'

const client = createClient({
  url: 'http://localhost:3000/api/gql'
})

export const useQueryGql = async <T = Record<string, unknown>>(params: RequestParams) => {
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

export const useSubscriptionGql = (query: RequestParams['query']) => {
  // TODO: validate query operation: ONLY Subscriptions
  const data = ref<ExecutionResult<Record<string, unknown>, unknown> | null>(null)

  const dispose = client.subscribe({ query }, {
    next: (d: any) => data.value = d,
    error: (e: any) => console.error(e),
    complete: () => console.log('subscription completed')

  })

  return { data, dispose }
}
