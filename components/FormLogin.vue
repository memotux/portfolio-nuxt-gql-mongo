<script lang="ts" setup>
import { Login } from '~/server/gql/mutation'

const loginState = reactive({
  userName: '',
  password: '',
})

const emits = defineEmits<{
  (e: 'logged'): void
}>()

const onLogin = async () => {
  try {
    const { data } = await useQueryGql<{ login: { value: string } }>({
      query: Login,
      variables: {
        ...loginState,
      },
    })

    useCookie('tux-user-token').value = data.value.login.value
    emits('logged')
  } catch (error) {
    console.error(error)
    throw createError({
      statusMessage: 'Error on creating user.',
      statusCode: 400,
      data: error,
    })
  } finally {
    loginState.userName = ''
    loginState.password = ''
  }
}
</script>

<template>
  <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
    <template #header>
      <h3>Login:</h3>
    </template>
    <UForm
      :state="loginState"
      @submit="onLogin"
      class="flex flex-col gap-4"
    >
      <UFormGroup
        label="User"
        name="userName"
      >
        <UInput v-model="loginState.userName" />
      </UFormGroup>
      <UFormGroup
        label="Password"
        name="password"
      >
        <UInput
          type="password"
          v-model="loginState.password"
        />
      </UFormGroup>
      <UButton type="submit"> Login </UButton>
    </UForm>
  </UCard>
</template>
