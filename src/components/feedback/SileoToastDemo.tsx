"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CircleAlert,
  Info,
  LoaderCircle,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getToastLibrary,
  setToastLibrary,
  showToast,
  toast,
  type ToastLibrary,
} from "@/utils/toastService";

const demoStates = [
  {
    type: "success" as const,
    title: "Éxito",
    description: "Tu acción se completó correctamente.",
    icon: CheckCircle2,
  },
  {
    type: "error" as const,
    title: "Error",
    description: "Algo falló al procesar la solicitud.",
    icon: CircleAlert,
  },
  {
    type: "warning" as const,
    title: "Advertencia",
    description: "Revisa el contenido antes de continuar.",
    icon: AlertTriangle,
  },
  {
    type: "info" as const,
    title: "Información",
    description: "Aquí tienes un mensaje de referencia.",
    icon: Info,
  },
  {
    type: "action" as const,
    title: "Acción",
    description: "Este ejemplo incluye botón de acción.",
    icon: Sparkles,
  },
];

const quickStart = `import { showToast, setToastLibrary } from "@/utils/toastService";

setToastLibrary("sonner");

showToast({
  title: "Hola",
  description: "Toast listo para usar",
  status: "success",
});`;

export function SileoToastDemo() {
  const [library, setLibrary] = useState<ToastLibrary>(getToastLibrary());

  useEffect(() => {
    setToastLibrary(library);
  }, [library]);

  const triggerToast = (type: (typeof demoStates)[number]["type"]) => {
    const base = {
      title: `Demo ${library}`,
      description: "Toast de ejemplo para el template.",
      position: "top-right" as const,
      duration: 3200,
      library,
    };

    if (type === "action") {
      showToast({
        ...base,
        status: "info",
        title: "Acción disponible",
        description: "Puedes usar un botón para acciones rápidas.",
        action: {
          label: "Ver detalle",
          onClick: () =>
            showToast({
              ...base,
              title: "Detalle",
              description: "Se disparó desde el botón del toast.",
              status: "info",
              duration: 2200,
            }),
        },
      });
      return;
    }

    const toastMap = {
      success: () =>
        showToast({
          ...base,
          status: "success",
          title: `${base.title} · success`,
          description: "Mensaje tipo success para probar el template.",
        }),
      error: () =>
        showToast({
          ...base,
          status: "error",
          title: `${base.title} · error`,
          description: "Mensaje tipo error para probar el template.",
        }),
      warning: () =>
        showToast({
          ...base,
          status: "warning",
          title: `${base.title} · warning`,
          description: "Mensaje tipo warning para probar el template.",
        }),
      info: () =>
        showToast({
          ...base,
          status: "info",
          title: `${base.title} · info`,
          description: "Mensaje tipo info para probar el template.",
        }),
    };

    toastMap[type]();
  };

  const triggerPromiseToast = async () => {
    await toast.promise(new Promise((resolve) => setTimeout(resolve, 1600)), {
      loading: "Procesando",
      success: "Listo",
      error: "Fallo",
      library,
    });
  };

  return (
    <Card className="border-border/70 bg-card/95 shadow-sm">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-emerald-500 to-teal-600 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-lg">
              Demo de toasts con Sileo y Sonner
            </CardTitle>
            <CardDescription>
              Elige el proveedor y prueba los tipos principales para usarlo como
              base en el template.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {(["sileo", "sonner"] as ToastLibrary[]).map((provider) => {
            const active = library === provider;
            return (
              <Button
                key={provider}
                variant={active ? "default" : "outline"}
                size="sm"
                onClick={() => setLibrary(provider)}
              >
                {provider === "sileo" ? "Sileo" : "Sonner"}
              </Button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2">
          {demoStates.map(({ type, title, icon: Icon }) => (
            <Button
              key={type}
              variant="outline"
              className="gap-2"
              onClick={() => triggerToast(type)}
            >
              <Icon className="h-4 w-4" />
              {title}
            </Button>
          ))}
        </div>

        <div className="rounded-lg border border-dashed border-border bg-muted/40 p-3 text-sm text-muted-foreground dark:bg-muted/20">
          <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
            <LoaderCircle className="h-4 w-4" />
            Ejemplo async
          </div>
          <p className="mb-3">
            Muestra un loading, luego un success o error según el resultado de
            una promesa.
          </p>
          <Button onClick={triggerPromiseToast}>Probar promise</Button>
        </div>

        <div className="rounded-lg border border-border/70 bg-background/80 p-3">
          <p className="mb-2 text-sm font-medium text-foreground">
            Quick start
          </p>
          <pre className="overflow-x-auto whitespace-pre-wrap text-xs text-muted-foreground">
            {quickStart}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
