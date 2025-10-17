export default function LoadingSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="mb-2 h-5 w-1/2 rounded bg-neutral-200 dark:bg-neutral-800" />
      <div className="h-4 w-1/3 rounded bg-neutral-200 dark:bg-neutral-800" />
      <div className="mt-3 h-4 w-5/6 rounded bg-neutral-200 dark:bg-neutral-800" />
    </div>
  )
}
