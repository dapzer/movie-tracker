import { onMounted, onUnmounted } from "#imports"
import { ref } from "vue"

export function useIsTrimmed() {
  const elementRef = ref<HTMLElement | null>(null)
  const isTrimmed = ref<boolean>(false)

  function handleCheckIsTrimmed() {
    if (elementRef.value) {
      isTrimmed.value = elementRef.value.offsetWidth < elementRef.value.scrollWidth
    }
  }

  onMounted(() => {
    handleCheckIsTrimmed()
    window.addEventListener("resize", handleCheckIsTrimmed)
  })

  onUnmounted(() => {
    window.removeEventListener("resize", handleCheckIsTrimmed)
  })

  return { elementRef, isTrimmed, handleCheckIsTrimmed }
}
