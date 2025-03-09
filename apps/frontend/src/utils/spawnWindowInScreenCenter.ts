export function spawnWindowInScreenCenter(url: string, windowName: string, win: Window, w: number, h: number) {
  if (!win.top) {
    return
  }
  const y = win.top.outerHeight / 2 + win.top.screenY - (h / 2)
  const x = win.top.outerWidth / 2 + win.top.screenX - (w / 2)

  const popup = win.open(url, windowName, `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`)

  return popup
}
