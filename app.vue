<script setup lang="ts">
useHead({
  script: [
    {
      crossorigin: '',
      async: 'true',
      src: 'https://unpkg.com/react@18.2.0/umd/react.development.js',
    },
    {
      crossorigin: '',
      async: 'true',
      src: 'https://unpkg.com/react-dom@18.2.0/umd/react-dom.development.js',
    },
    {
      type: 'application/javascript',
      async: 'true',
      src: 'https://unpkg.com/graphiql@3.0.6/graphiql.min.js',
    },
  ],
  link: [
    {
      rel: 'stylesheet',
      href: 'https://unpkg.com/graphiql@3.0.6/graphiql.min.css',
    },
  ],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
