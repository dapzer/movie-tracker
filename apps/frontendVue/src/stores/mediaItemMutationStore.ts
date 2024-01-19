import { reactive, readonly } from "vue";

const state = reactive({
  lastMutatedItemId: "",
});

const handleLastEditedItemId = (id: string) => {
  state.lastMutatedItemId = id;
}

export const mediaItemMutationStore = {
  state: readonly(state),
  handleLastEditedItemId
};

