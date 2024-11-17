import { type ModelRef, type Ref, watch } from "vue"
import { nextTick } from "#imports"

type RefType = Ref<boolean> | ModelRef<boolean | undefined, string, boolean | undefined, boolean | undefined>

export const useSwitchModals = (mainModalOpenState: RefType, secondModalOpenState: RefType) => {
  watch(() => secondModalOpenState.value, (value) => {
    if (!value) {
      nextTick(() => {
        mainModalOpenState.value = true;
      });
    }
  });

  const onOpenSecondModal = () => {
    mainModalOpenState.value = false;
    nextTick(() => {
      secondModalOpenState.value = true;
    });
  }

  return {
    onOpenSecondModal
  }
}
