<script setup lang="ts">
const token = useCookie('tux-user-token')

const isLoggedIn = computed(() => Boolean(token.value))
</script>

<template>
  <nav class="w-full h-24 flex justify-between align-center p-8">
    <div class="flex justify-center align-center gap-4 min-w-1/6">
      <ULink to="/"><h1 class="text-4xl m-0">Tux Users</h1></ULink>
      <ULink
        to="/graphql"
        style="line-height: 2.5rem"
        >GraphiQL</ULink
      >
    </div>
    <div class="flex justify-center align-center gap-4 min-w-1/6">
      <UButton
        label="Add User"
        icon="i-heroicons-user-plus"
        @click="setModal('FormAddUser')"
      />
      <UButton
        v-if="!isLoggedIn"
        icon="i-heroicons-user-circle"
        @click="setModal('FormLogin')"
        >Login</UButton
      >
      <MenuUser v-else />
    </div>
  </nav>
</template>
