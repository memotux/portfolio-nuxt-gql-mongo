<script setup lang="ts">
import { DeleteUser } from '~/server/gql/mutation'
import { User } from '~/server/gql/types'

defineProps<{
  data?: User[]
  loading?: boolean
}>()

const emits = defineEmits<{
  (e: 'deleted'): void
}>()

const toast = useToast()
const token = useCookie('tux-user-token')

const isLoggedIn = computed(() => Boolean(token.value))

async function deleteUser(id: string) {
  try {
    const { data } = await useGqlQuery<{ deleteUser: User }>({
      query: DeleteUser,
      variables: {
        id,
      },
    })
    if (data.value.deleteUser) {
      refreshNuxtData('allUsers')
      toast.add({
        title: `User "${data.value.deleteUser.userName}" deleted!`,
        icon: 'i-heroicons-trash',
        color: 'red',
      })
    }
  } catch (error) {
    console.error(error)
    throw showError({
      statusMessage: 'Error on deleting user.',
      statusCode: 400,
      data: error,
    })
  }
}
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="text-3xl">Result</h2>
    </template>
    <UTable
      :loading="loading"
      :rows="data"
      :columns="[
        { key: '_id', label: 'ID' },
        { key: 'userName', label: 'User' },
        { key: 'friends', label: 'Friends' },
        { key: 'del', label: 'Delete' },
      ]"
    >
      <template #friends-data="{ getRowData }">
        <template v-if="getRowData().length > 0">
          <UBadge
            v-for="friend in getRowData()"
            :key="friend.userName"
            class="mx-2"
            >{{ friend.userName }}</UBadge
          >
        </template>
        <UBadge
          v-else
          color="rose"
          variant="outline"
          class="mx-2"
          >None jet!</UBadge
        >
      </template>
      <template #del-data="{ row }">
        <UButton
          icon="i-heroicons-trash"
          color="red"
          variant="ghost"
          :disabled="!isLoggedIn"
          @click="deleteUser(row._id)"
        />
      </template>
    </UTable>
  </UCard>
</template>
