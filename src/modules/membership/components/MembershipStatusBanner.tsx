import type { MembershipStatus } from "../types";

/**
 * Aviso del estado de membresía para el residente en su dashboard. No renderiza nada si ya
 * es miembro o no ha solicitado nada (en ese caso la pantalla muestra su contenido normal).
 * Es presentacional: recibe el estado ya resuelto.
 */
export function MembershipStatusBanner({
  status,
}: {
  status: MembershipStatus;
}) {
  if (status.kind === "pending") {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
        <p className="text-sm font-medium text-foreground">
          Tu solicitud está en revisión
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Un administrador revisará tu asociación al lote. Mientras tanto, puedes
          consultar los comunicados publicados.
        </p>
      </div>
    );
  }

  if (status.kind === "rejected") {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4">
        <p className="text-sm font-medium text-foreground">
          Tu solicitud fue rechazada
        </p>
        {status.comment && (
          <p className="mt-1 text-sm text-muted-foreground">
            Motivo: {status.comment}
          </p>
        )}
        <p className="mt-1 text-sm text-muted-foreground">
          Contacta al administrador del fraccionamiento para más información.
        </p>
      </div>
    );
  }

  return null;
}
