import { ref, type VNodeRef } from "vue"
import { onMounted, onUnmounted } from "#imports"

export const useModalContent = (handleCloseModal: () => void) => {
  const bodyRef = ref<VNodeRef | null>(null);

  const closeModalOnKeypress = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleCloseModal()
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', closeModalOnKeypress);
    document.body.style.overflow = 'hidden';
    if (bodyRef.value) {
      bodyRef.value.focus();
    }
  });

  onUnmounted(() => {
    document.removeEventListener('keydown', closeModalOnKeypress);
    document.body.style.overflow = '';
  });

  return {
    bodyRef,
    handleCloseModal,
  }
}
