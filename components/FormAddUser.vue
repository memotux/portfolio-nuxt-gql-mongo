<script lang="ts" setup>
import { User } from '@/server/gql/types'
import { CreateUser } from '~/server/gql/mutation'

const addUserState = reactive({
  userName: '',
})

const emits = defineEmits<{
  (e: 'close', value: User): void
}>()

const submitUser = async () => {
  try {
    const { data: newUser } = await useQueryGql<{ createUser: User }>({
      query: CreateUser,
      variables: {
        ...addUserState,
      },
    })
    emits('close', newUser.value.createUser)
  } catch (error) {
    console.error(error)
    throw showError({
      statusMessage: 'Error on creating user.',
      statusCode: 400,
      data: error,
    })
  } finally {
    addUserState.userName = ''
  }
}
</script>

<template>
  <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
    <template #header>
      <h3>Add User:</h3>
    </template>
    <UForm
      :state="addUserState"
      @submit="submitUser"
    >
      <UFormGroup
        label="User"
        name="userName"
      >
        <UInput v-model="addUserState.userName" />
      </UFormGroup>
      <UButton
        type="submit"
        class="mt-8"
      >
        Add User
      </UButton>
    </UForm>
  </UCard>
</template>
