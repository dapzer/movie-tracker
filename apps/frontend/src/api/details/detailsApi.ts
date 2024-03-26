import { api } from "~/api/instance";

export const initializeDetailsGenerationApi = async () => {
  return api.get("mediaDetails");
};
