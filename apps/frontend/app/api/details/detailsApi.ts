import { api } from "~/api/instance"

export async function initializeDetailsGenerationApi() {
  return api.get("media-details")
}
