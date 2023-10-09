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
  <AppForm
    title="Add User:"
    :state="addUserState"
    @submit="submitUser"
    submit-label="Add User"
  >
    <UFormGroup
      label="User"
      name="userName"
    >
      <UInput v-model="addUserState.userName" />
    </UFormGroup>
  </AppForm>
</template>
