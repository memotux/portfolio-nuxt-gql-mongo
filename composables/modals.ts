
type Modals = 'FormAddUser' | 'FormLogin'

const isModalOpen = ref(false)
const currentModal = ref<Modals>('FormAddUser')

export function setModal(modal: Modals) {
  currentModal.value = modal
  isModalOpen.value = true
}

export const useModals = () => {
  return {
    isModalOpen,
    currentModal
  }
}
