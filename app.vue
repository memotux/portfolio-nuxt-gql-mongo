<script setup lang="ts">
import { AllUsersResult, User } from '@/server/gql/types'
import { AllUsers } from './server/gql/query'

useSeoMeta({
  title: 'Tux Users',
})

const toast = useToast()

const { data } = await useQueryGql<AllUsersResult>({
  query: AllUsers,
})

// const { data, dispose } = useSubscriptionGql(OnCreateUser)

const openAddUserModal = ref(false)
const openLoginModal = ref(false)

const token = useCookie('tux-user-token')

const isLoggedIn = computed(() => Boolean(token.value))

function onSubmitted(newUser: User) {
  data.value.allUsers.push(newUser)
  toast.add({
    title: 'New user created.',
    icon: 'i-heroicons-check-circle',
    color: 'primary',
  })
}
function onDeletedUser(user: User) {
  const idx = data.value.allUsers.findIndex((u) => u._id === user._id)
  if (idx >= 0) {
    data.value.allUsers.splice(idx, 1)
    toast.add({
      title: `User "${user.userName}" deleted!`,
      icon: 'i-heroicons-trash',
      color: 'red',
    })
  } else {
    throw showError({
      statusMessage: 'User not exist.',
      statusCode: 404,
    })
  }
}
</script>

<template>
  <nav class="w-full h-24 flex justify-between align-center p-8">
    <h1 class="text-4xl m-0">Tux Users</h1>
    <div class="flex justify-center align-center gap-4 min-w-1/6">
      <UButton
        label="Add User"
        icon="i-heroicons-user-plus"
        @click="openAddUserModal = true"
      />
      <UButton
        v-if="!isLoggedIn"
        icon="i-heroicons-user-circle"
        @click="openLoginModal = true"
        >Login</UButton
      >
      <MenuUser v-else />
    </div>
  </nav>
  <UContainer>
    <UModal v-model="openAddUserModal">
      <FormAddUser
        @close="openAddUserModal = false"
        @submitted="onSubmitted"
      />
    </UModal>
    <UModal v-model="openLoginModal">
      <FormLogin @logged="openLoginModal = false" />
    </UModal>
    <TableUsers
      :data="data.allUsers"
      @deleted="onDeletedUser"
    />
  </UContainer>
  <UNotifications />
</template>
