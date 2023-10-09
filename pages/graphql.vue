<script setup>
useHead({
  title: 'GraphiQL | Tux Users',
  script: [
    { crossorigin: '', src: 'https://unpkg.com/react@18/umd/react.development.js' },
    {
      crossorigin: '',
      src: 'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
    },
    { type: 'application/javascript', src: 'https://unpkg.com/graphiql/graphiql.min.js' },
    // { type: 'application/javascript', src: '/graphiql.js' },
  ],
  link: [{ rel: 'stylesheet', href: 'https://unpkg.com/graphiql/graphiql.min.css' }],
})

onMounted(() => {
  if (window) {
    const root = window.ReactDOM.createRoot(document.getElementById('graphiql'))
    // const fetcher = window.GraphiQL.createFetcher({
    //   url: 'http://localhost:3000/api/gql',
    //   enableIncrementalDelivery: true,
    //   // headers: { 'X-Example-Header': 'foo' },
    // })
    const fetcher = graphiFetcher
    // const explorerPlugin = window.GraphiQLPluginExplorer.explorerPlugin()
    root.render(
      window.React.createElement(window.GraphiQL, {
        fetcher,
        defaultEditorToolsVisibility: true,
        // plugins: [explorerPlugin],
      })
    )
  }
})
</script>

<template>
  <div
    id="graphiql"
    class="h-full"
  >
    Loading...
  </div>
</template>
