export default function ErrorState({ message }: { message: string }) {
  return (
    <div className="card border-red-300 bg-red-50 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
      {message}
    </div>
  )
}
