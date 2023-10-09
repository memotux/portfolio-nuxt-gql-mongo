<script setup lang="ts">
import { AllUsersResult, User } from '@/server/gql/types'
import { AllUsers } from '@/server/gql/query'

const { data } = await useQueryGql<AllUsersResult>({
  query: AllUsers,
})

const modals = {
  FormAddUser: resolveComponent('FormAddUser'),
  FormLogin: resolveComponent('FormLogin'),
}

const toast = useToast()
const { isModalOpen, currentModal } = useModals()

// const { data, dispose } = useSubscriptionGql(OnCreateUser)

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
  <UModal v-model="isModalOpen">
    <component
      :is="modals[currentModal]"
      @close="isModalOpen = false"
      @success="onSubmitted"
    />
  </UModal>
  <TableUsers
    :data="data.allUsers"
    @deleted="onDeletedUser"
  />
</template>

<style scoped></style>
