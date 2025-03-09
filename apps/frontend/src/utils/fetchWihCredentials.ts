export function fetchWihCredentials(requestInfo: RequestInfo, requestInit?: RequestInit) {
  return fetch(requestInfo, {
    credentials: "include",
    ...requestInit,
  })
}
