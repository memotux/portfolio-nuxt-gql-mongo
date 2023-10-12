<script lang="ts" setup>
import { Login } from '~/server/gql/mutation'

const loginState = reactive({
  userName: '',
  password: '',
})

const emits = defineEmits<{
  (e: 'close'): void
}>()

const onLogin = async () => {
  try {
    const { data } = await useGqlQuery<{ login: { value: string } }>({
      query: Login,
      variables: {
        ...loginState,
      },
    })

    if (data.value.login.value) {
      useCookie('tux-user-token').value = data.value.login.value
    }
    emits('close')
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
  <AppForm
    title="Login:"
    submit-label="Login"
    :state="loginState"
    @submit="onLogin"
    form-class="flex flex-col gap-4"
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
  </AppForm>
</template>
