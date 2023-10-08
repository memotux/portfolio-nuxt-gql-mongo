<script setup lang="ts">
import { User } from '@/server/gql/types'
import { GetMe } from '~/server/gql/query'

const token = useCookie('tux-user-token')

const currentUser = ref<User | null>(null)

onMounted(async () => {
  if (token.value) {
    const { data } = await useQueryGql<{ me: User }>({
      query: GetMe,
    })
    currentUser.value = data.value.me
  }
})

const items = computed(() => [
  [
    {
      label: currentUser.value?.userName || 'Dummy User',
      slot: 'account',
      disabled: true,
    },
  ],
  [
    {
      label: 'Logout',
      icon: 'i-heroicons-arrow-left-on-rectangle',
      click: onLogout,
    },
  ],
])

function onLogout() {
  if (token.value) {
    token.value = null
  }
}
</script>

<template>
  <UDropdown
    :items="items"
    :ui="{ item: { disabled: 'cursor-text select-text' } }"
  >
    <UButton
      color="primary"
      variant="solid"
      icon="i-heroicons-user-circle"
    />
    <template #account="{ item }">
      <div class="text-left">
        <p>Signed in as</p>
        <p class="truncate font-medium text-gray-900 dark:text-white">
          {{ item.label }}
        </p>
      </div>
    </template>
  </UDropdown>
</template>
