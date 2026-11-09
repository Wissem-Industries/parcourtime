const SECOND_MS = 1000
const MINUTE_MS = 60 * SECOND_MS
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS

/**
 * Shared clock. The page is prerendered: the first client render reuses the build
 * time carried by the payload so hydration matches, then the clock switches to the
 * real time once mounted.
 */
export const useNow = () => {
  const timestamp = useState('wsm_now', () => Date.now())
  const live = useState('wsm_now_live', () => false)
  let interval: ReturnType<typeof setInterval> | undefined

  onMounted(() => {
    timestamp.value = Date.now()
    live.value = true
    interval = setInterval(() => {
      timestamp.value = Date.now()
    }, SECOND_MS)
  })

  onBeforeUnmount(() => clearInterval(interval))

  return {
    now: computed(() => new Date(timestamp.value)),
    live: readonly(live),
  }
}

export const splitDuration = (ms: number) => {
  let rest = Math.max(0, ms)
  const days = Math.floor(rest / DAY_MS)
  rest -= days * DAY_MS
  const hours = Math.floor(rest / HOUR_MS)
  rest -= hours * HOUR_MS
  const minutes = Math.floor(rest / MINUTE_MS)
  rest -= minutes * MINUTE_MS
  return { days, hours, minutes, seconds: Math.floor(rest / SECOND_MS) }
}
