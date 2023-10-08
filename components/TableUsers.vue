<script setup lang="ts">
import { DeleteUser } from '~/server/gql/mutation'
import { User } from '~/server/gql/types'

defineProps<{
  data: User[]
}>()

const emits = defineEmits<{
  (e: 'deleted', value: User): void
}>()

async function deleteUser(id: string) {
  try {
    const { data: user } = await useQueryGql<{ deleteUser: User }>({
      query: DeleteUser,
      variables: {
        id,
      },
    })
    emits('deleted', user.value.deleteUser)
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
          @click="deleteUser(row._id)"
        />
      </template>
    </UTable>
  </UCard>
</template>
