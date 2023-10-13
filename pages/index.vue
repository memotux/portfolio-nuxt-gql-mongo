<script setup lang="ts">
import type { AllUsersResult, OnCreateUserResult } from '@/server/gql/types'
import { AllUsers } from '@/server/gql/query'
import { OnCreateUser } from '~/server/gql/subscription'

const { data: query, pending } = await useAsyncGqlQuery<AllUsersResult>('allUsers', {
  query: AllUsers,
})

const { dispose } = useGqlSub<OnCreateUserResult>(
  { query: OnCreateUser, variables: { all: true } },
  {
    next(value) {
      if (query.value && value.data?.onCreateUser) {
        if (value.data.onCreateUser.length > 1) {
          query.value.allUsers = value.data.onCreateUser
        } else if (value.data.onCreateUser.length === 1) {
          query.value.allUsers.push(...value.data.onCreateUser)
        }
      }
    },
    error(error) {
      throw createError({
        statusMessage: 'Error on subscribe.',
        statusCode: 400,
        data: error as Error,
      })
    },
    complete() {
      console.log('subscribe closed')
    },
  }
)

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
    :data="query?.allUsers"
  />
</template>

<style scoped></style>
