<script setup>
useHead({
  title: 'GraphiQL | Tux Users',
  script: [
    {
      crossorigin: '',
      async: 'true',
      blocking: 'render',
      src: 'https://unpkg.com/react@18.2.0/umd/react.development.js',
    },
    {
      crossorigin: '',
      async: 'true',
      blocking: 'render',
      src: 'https://unpkg.com/react-dom@18.2.0/umd/react-dom.development.js',
    },
    {
      type: 'application/javascript',
      async: 'true',
      blocking: 'render',
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
  <AppHeader />
  <UContainer
    as="main"
    :ui="{
      constrained: 'max-w-[100dvw] h-[90%]',
    }"
  >
    <slot />
  </UContainer>
  <UNotifications />
</template>
