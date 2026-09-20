import type { Ref } from "vue"
import type { GetDataImportsArgs } from "~/api/dataImport/dataImportApiTypes"
import { useRequestHeaders } from "#app"
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import { getDataImports, importData } from "~/api/dataImport/dataImportApi"
import { DataImportApiQueryKeys } from "~/api/dataImport/dataImportApiQueryKeys"

export function useGetDataImportsApi(args: Ref<GetDataImportsArgs>) {
  return useQuery({
    queryKey: [DataImportApiQueryKeys.GET_ALL_BY_USER_ID, args],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])

      if (!headers.cookie?.includes("session") && import.meta.server) {
        throw new Error("No session cookie found")
      }

      return getDataImports(args.value, { headers })
    },
    retry: false,
    retryOnMount: false,
  })
}

export function useImportDataApi() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [DataImportApiQueryKeys.IMPORT],
    mutationFn: importData,
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [DataImportApiQueryKeys.GET_ALL_BY_USER_ID],
      })
    },
  })
}
