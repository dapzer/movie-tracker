export async function mapTasksWithConcurrency<T, R>(args: {
  items: T[]
  concurrency: number
  fn: (item: T) => Promise<R>
}): Promise<R[]> {
  const results: R[] = Array.from({ length: args.items.length })
  let nextIndex = 0

  const workers = Array.from({ length: Math.min(args.concurrency, args.items.length) }, async () => {
    while (nextIndex < args.items.length) {
      const currentIndex = nextIndex
      nextIndex += 1
      results[currentIndex] = await args.fn(args.items[currentIndex])
    }
  })

  await Promise.all(workers)

  return results
}
