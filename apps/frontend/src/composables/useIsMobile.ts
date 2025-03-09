import { useBreakpoints } from "@vueuse/core"

export function useIsMobile() {
  const breakpoints = useBreakpoints({
    mobile: 568,
  })
  const isMobile = breakpoints.smaller("mobile")

  return { isMobile }
}
