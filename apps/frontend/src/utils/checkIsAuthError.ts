export const checkIsAuthError = (error: string | Error) => {
  return error.toString().includes("Code: 401")
}
