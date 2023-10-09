<script lang="ts" setup>
useSeoMeta({
  title: 'Tux Users',
})
</script>

<template>
  <AppHeader />
  <UContainer>
    <slot />
  </UContainer>
  <UNotifications />
</template>
