/**
 * Skeleton mostrado durante la navegación entre páginas del dashboard (nextjs.md:
 * "Toda página importante debe tener loading.tsx ... Nunca mostrar pantallas vacías").
 * Se renderiza dentro del layout autenticado, así el sidebar permanece.
 */
export default function DashboardLoading() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="h-8 w-56 animate-pulse rounded-md bg-muted" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="h-24 animate-pulse rounded-xl bg-muted"
          />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-xl bg-muted" />
    </div>
  );
}
