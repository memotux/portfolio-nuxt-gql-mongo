<script setup>
definePageMeta({
  layout: 'graphiql',
})
onMounted(() => {
  if (document.getElementById('graphiql')) {
    const root = window.ReactDOM.createRoot(document.getElementById('graphiql'))
    root.render(
      window.React.createElement(window.GraphiQL, {
        fetcher: graphiFetcher,
        defaultEditorToolsVisibility: true,
      })
    )
  }
})
</script>

<template>
  <div
    id="graphiql"
    class="h-full w-full"
  >
    Loading...
  </div>
</template>
