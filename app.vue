<script setup lang="ts">
useSeoMeta({
  title: 'Tux Users',
})

interface User {
  _id: string
  userName: string
  friends: Array<User>
}

interface AllUsersResult {
  allUsers: Array<User>
}

const userWithFriendsFragment = /* GraphQL */ `
  fragment UserWithFriends on User {
    _id
    userName
    friends {
      userName
    }
  }
`
const { data } = await useQueryGql<AllUsersResult>({
  query: /* GraphQL */ `
    {
      allUsers {
        ...UserWithFriends
      }
    }
    ${userWithFriendsFragment}
  `,
})

// const { data: subs, dispose } = useSubscriptionGql(/* GraphQL */ `
//   subscription {
//     onCreateUser {
//       ...UserWithFriends
//     }
//   }
//   ${userWithFriendsFragment}
// `)

// onUpdated(() => console.log({ subs }))

const openAddUserModal = ref(false)
const addUserState = reactive({
  userName: '',
})
const submitUser = async () => {
  try {
    const { data: newUser } = await useQueryGql<{ createUser: User }>({
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
    data.value.allUsers.push(newUser.value.createUser)
  } catch (error) {
    console.error(error)
    throw createError({
      statusMessage: 'Error on creating user.',
      statusCode: 400,
      data: error,
    })
  } finally {
    addUserState.userName = ''
    openAddUserModal.value = false
  }
}

async function deleteUser(id: string) {
  console.log({ id })

  // try {
  //   const { data: user } = await useQueryGql<{ deleteUser: User }>({
  //     query: /* GraphQL */ `
  //       mutation DeleteUser($id: ID!) {
  //         deleteUser(id: $id) {
  //           ...UserWithFriends
  //         }
  //       }
  //       ${userWithFriendsFragment}
  //     `,
  //     variables: {
  //       id,
  //     },
  //   })
  //   const idx = data.value.allUsers.findIndex((u) => u._id === user.value.deleteUser._id)
  //   if (idx >= 0) {
  //     data.value.allUsers.splice(idx, 1)
  //   }
  // } catch (error) {
  //   console.error(error)
  //   throw createError({
  //     statusMessage: 'Error on deleting user.',
  //     statusCode: 400,
  //     data: error,
  //   })
  // }
}
// onBeforeUnmount(dispose)
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
  </UContainer>
</template>
