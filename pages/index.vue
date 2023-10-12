<script setup lang="ts">
import type { AllUsersResult } from '@/server/gql/types'
import { AllUsers } from '@/server/gql/query'

const { data, pending } = await useAsyncGqlQuery<AllUsersResult>('allUsers', {
  query: AllUsers,
})

const modals = {
  FormAddUser: resolveComponent('FormAddUser'),
  FormLogin: resolveComponent('FormLogin'),
}

const { isModalOpen, currentModal } = useModals()

// const { data, dispose } = useGqlSub(OnCreateUser)

function onModalClose() {
  isModalOpen.value = false
}
</script>

<template>
  <UModal v-model="isModalOpen">
    <component
      :is="modals[currentModal]"
      @close="onModalClose"
    />
  </UModal>
  <TableUsers
    :loading="pending"
    :data="data?.allUsers"
  />
</template>

<style scoped></style>
