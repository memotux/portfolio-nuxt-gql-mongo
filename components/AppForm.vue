<script lang="ts" setup>
defineProps<{
  title?: string
  state: Record<string, string>
  submitLabel?: string
  formClass?: string
}>()
defineEmits<{
  (e: 'submit'): void
}>()
</script>

<template>
  <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
    <template #header>
      <h3>{{ title || 'Form' }}</h3>
    </template>
    <UForm
      :state="state"
      @submit="$emit('submit')"
      :class="formClass"
    >
      <slot />
      <UButton
        type="submit"
        class="mt-8"
      >
        {{ submitLabel || 'Submit' }}
      </UButton>
    </UForm>
  </UCard>
</template>
