import { BrowserEnum } from "~/shared/types/browserEnum"

export function getCurrentBrowserName() {
  const userAgent = navigator.userAgent.toLowerCase()
  if (/chrome/.test(userAgent)) {
    return BrowserEnum.CHROME
  }
  else if (/firefox/.test(userAgent)) {
    return BrowserEnum.FIREFOX
  }
  else if (/safari/.test(userAgent)) {
    return BrowserEnum.SAFARI
  }
  else if (/opera/.test(userAgent)) {
    return BrowserEnum.OPERA
  }
  else if (/msie/.test(userAgent) || (/mozilla/.test(userAgent) && !/firefox/.test(userAgent) && !/chrome/.test(userAgent) && !/safari/.test(userAgent) && !/opera/.test(userAgent))) {
    return BrowserEnum.EDGE
  }
  else {
    return null
  }
}
