export const fetchWihCredentials = (requestInfo: RequestInfo, requestInit?: RequestInit) => fetch(requestInfo, {
  credentials: 'include',
  ...requestInit,
})
