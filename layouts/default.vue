<script lang="ts" setup>
useSeoMeta({
  title: 'Tux Users',
})
</script>

<template>
  <AppHeader />
  <UContainer
    as="main"
    :ui="{
      constrained: $route.path === '/graphql' ? 'max-w-[100dvw] h-[90%]' : 'max-w-7xl',
    }"
  >
    <slot />
  </UContainer>
  <UNotifications />
</template>

<style>
#__nuxt {
  @apply h-[100dvh];
}
</style>
