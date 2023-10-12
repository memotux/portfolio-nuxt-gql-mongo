<script setup>
useSeoMeta({
  title: 'GraphiQL | Tux Users',
})
onMounted(() => {
  if (window.ReactDOM) {
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
