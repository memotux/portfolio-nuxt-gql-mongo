<script setup lang="ts">
import type { AllUsersResult, OnCreateUserResult } from '@/server/gql/types'
import { AllUsers } from '@/server/gql/query'
import { OnCreateUser } from '~/server/gql/subscription'

const { data: query, pending } = await useAsyncGqlQuery<AllUsersResult>('allUsers', {
  query: AllUsers,
})

const { data: sub, dispose } = useGqlSub<OnCreateUserResult>(OnCreateUser)

const modals = {
  FormAddUser: resolveComponent('FormAddUser'),
  FormLogin: resolveComponent('FormLogin'),
}

const { isModalOpen, currentModal } = useModals()

function onModalClose() {
  isModalOpen.value = false
}

onUnmounted(() => {
  dispose()
})
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
    :data="sub?.onCreateUser || query?.allUsers"
  />
</template>

<style scoped></style>
