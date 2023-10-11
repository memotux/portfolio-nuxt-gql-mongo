<script lang="ts" setup>
useSeoMeta({
  title: 'Tux Users',
})
</script>

<template>
  <AppHeader />
  <UContainer as="main">
    <slot />
  </UContainer>
  <UNotifications />
</template>

<style>
#__nuxt {
  @apply h-[100dvh];
}
</style>
