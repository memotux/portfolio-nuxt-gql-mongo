<script lang="ts" setup>
useSeoMeta({
  title: 'Tux Users',
})
const route = useRoute()
const gqlLayout = computed(() =>
  route.name === 'graphql' ? 'max-w-[100dvw] h-[90%]' : 'max-w-7xl'
)
</script>

<template>
  <AppHeader />
  <UContainer
    as="main"
    :ui="{
      constrained: gqlLayout,
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
