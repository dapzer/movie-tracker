import { useBreakpoints } from "@vueuse/core"

export const useIsMobile = () => {
  const breakpoints = useBreakpoints({
    mobile: 568
  })
  const isMobile = breakpoints.smaller("mobile");

  return { isMobile };
}
