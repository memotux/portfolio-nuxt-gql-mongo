<script setup>
useSeoMeta({
  title: 'Tux Users',
})
const userWithFriendsFragment = /* GraphQL */ `
  fragment UserWithFriends on User {
    _id
    userName
    friends {
      userName
    }
  }
`
const { data } = await useQueryGql({
  query: /* GraphQL */ `
    {
      allUsers {
        _id
        userName
        friends {
          userName
        }
      }
    }
  `,
})

const { data: subs, dispose } = useSubscriptionGql(/* GraphQL */ `
  subscription {
    onCreateUser {
      ...UserWithFriends
    }
  }
  ${userWithFriendsFragment}
`)

onUpdated(() => console.log({ subs }))

const openAddUserModal = ref(false)
const addUserState = reactive({
  userName: '',
})
const submitUser = async () => {
  const { data: newUser } = await useQueryGql({
    query: /* GraphQL */ `
      mutation CreateUser($userName: String!) {
        createUser(userName: $userName) {
          ...UserWithFriends
        }
      }
      ${userWithFriendsFragment}
    `,
    variables: {
      ...addUserState,
    },
  })

  console.log(newUser)
}
onBeforeUnmount(dispose)
</script>

<template>
  <nav class="w-full h-24 flex justify-between align-center p-8">
    <h1 class="text-4xl m-0">Tux Users</h1>
    <UButton
      label="Add User"
      icon="i-heroicons-plus"
      @click="openAddUserModal = true"
    />
  </nav>
  <UContainer>
    <UModal v-model="openAddUserModal">
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
    </UModal>
    <UCard>
      <template #header>
        <h2 class="text-3xl">Result</h2>
      </template>
      <UTable
        :rows="data.allUsers"
        :columns="[
          { key: '_id', label: 'ID' },
          { key: 'userName', label: 'User' },
          { key: 'friends', label: 'Friends' },
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
      </UTable>
    </UCard>
  </UContainer>
</template>
