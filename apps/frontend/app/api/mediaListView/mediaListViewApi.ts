import { api } from "~/api/instance"

export function sendMediaListView(mediaListId: string): Promise<void> {
  return api.post(`media-list-view/send/${mediaListId}`)
}
