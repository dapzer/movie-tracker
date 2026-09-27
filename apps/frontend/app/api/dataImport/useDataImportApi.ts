import type { UseQueryOptions } from "@tanstack/vue-query"
import type { Ref } from "vue"
import type { GetDataImportsArgs } from "~/api/dataImport/dataImportApiTypes"
import { useRequestHeaders } from "#app"
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import { getDataImportById, getDataImports, importData, processDataImport } from "~/api/dataImport/dataImportApi"
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

export function useGetDataImportByIdApi(id: string, options?: Omit<UseQueryOptions, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: [DataImportApiQueryKeys.GET_BY_ID, id],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])

      if (!headers.cookie?.includes("session") && import.meta.server) {
        throw new Error("No session cookie found")
      }

      return getDataImportById(id, { headers })
    },
    retry: false,
    retryOnMount: false,
    ...options,
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

export function useProcessDataImportApi() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [DataImportApiQueryKeys.PROCESS],
    mutationFn: processDataImport,
    onSuccess: async (_data, args) => {
      await Promise.all([
        queryClient.refetchQueries({
          queryKey: [DataImportApiQueryKeys.GET_ALL_BY_USER_ID],
        }),
        queryClient.invalidateQueries({
          queryKey: [DataImportApiQueryKeys.GET_BY_ID, args.id],
        }),
      ])
    },
  })
}
