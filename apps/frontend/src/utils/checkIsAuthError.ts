export function checkIsAuthError(error: string | Error) {
  return error.toString().includes("Code: 401") || error.toString().includes("Error: Unauthorized.")
}
