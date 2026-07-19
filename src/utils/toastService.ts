// utils/toastService.ts
import { sileo, type SileoOptions, type SileoPosition } from "sileo";
import { toast as sonnerToast } from "sonner";

export type ToastLibrary = "sileo" | "sonner";

export interface ToastOptions {
  id?: string | number;
  title?: string;
  description: string;
  status?: "info" | "success" | "warning" | "error";
  duration?: number;
  position?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "top-center"
    | "bottom-center";
  action?: {
    label: string;
    onClick: () => void;
  };
  library?: ToastLibrary;
}

let activeToastLibrary: ToastLibrary = "sileo";

export const setToastLibrary = (library: ToastLibrary) => {
  activeToastLibrary = library;
};

export const getToastLibrary = () => activeToastLibrary;

const toSileoType = (
  status: ToastOptions["status"],
): NonNullable<SileoOptions["type"]> => {
  switch (status) {
    case "success":
      return "success";
    case "error":
      return "error";
    case "warning":
      return "warning";
    case "info":
    default:
      return "info";
  }
};

const toSileoPosition = (position: ToastOptions["position"]): SileoPosition =>
  position as SileoPosition;

const showWithSileo = ({
  id,
  title,
  description,
  status = "info",
  duration = 3000,
  position = "top-right",
  action,
}: ToastOptions) => {
  const toastOptions: SileoOptions = {
    title,
    description,
    type: toSileoType(status),
    duration,
    position: toSileoPosition(position),
    ...(action
      ? {
          button: {
            title: action.label,
            onClick: action.onClick,
          },
        }
      : {}),
  };

  if (id) {
    sileo.dismiss(id.toString());
  }

  switch (status) {
    case "success":
      return sileo.success(toastOptions);

    case "error":
      return sileo.error(toastOptions);

    case "warning":
      return sileo.warning(toastOptions);

    case "info":
    default:
      return sileo.info(toastOptions);
  }
};

const showWithSonner = ({
  id,
  title,
  description,
  status = "info",
  duration = 3000,
  position = "top-right",
  action,
}: ToastOptions) => {
  if (id) {
    sonnerToast.dismiss(id.toString());
  }

  const message = title ?? description;
  const details = title ? description : undefined;

  const toastOptions = {
    description: details,
    duration,
    position,
    action: action
      ? {
          label: action.label,
          onClick: action.onClick,
        }
      : undefined,
  };

  switch (status) {
    case "success":
      return sonnerToast.success(message, toastOptions);

    case "error":
      return sonnerToast.error(message, toastOptions);

    case "warning":
      return sonnerToast.warning(message, toastOptions);

    case "info":
    default:
      return sonnerToast.info(message, toastOptions);
  }
};

export const showToast = (options: ToastOptions) => {
  const library = options.library ?? activeToastLibrary;

  if (library === "sonner") {
    return showWithSonner(options);
  }

  return showWithSileo(options);
};

// Funciones auxiliares para casos específicos
export const toast = {
  success: (description: string, options?: Partial<ToastOptions>) =>
    showToast({ description, status: "success", ...options }),

  error: (description: string, options?: Partial<ToastOptions>) =>
    showToast({ description, status: "error", ...options }),

  warning: (description: string, options?: Partial<ToastOptions>) =>
    showToast({ description, status: "warning", ...options }),

  info: (description: string, options?: Partial<ToastOptions>) =>
    showToast({ description, status: "info", ...options }),

  promise: <T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
      library,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
      library?: ToastLibrary;
    },
  ) => {
    const selectedLibrary = library ?? activeToastLibrary;

    if (selectedLibrary === "sonner") {
      return sonnerToast.promise(promise, {
        loading,
        success,
        error,
        position: "top-right",
      });
    }

    return sileo.promise(promise, {
      loading: {
        title: loading,
        description: loading,
        type: "loading",
        duration: 2000,
        position: "top-right",
      },
      success:
        typeof success === "string"
          ? {
              title: success,
              description: success,
              type: "success",
              position: "top-right",
            }
          : {
              title: "Éxito",
              description: "Operación completada",
              type: "success",
              position: "top-right",
            },
      error:
        typeof error === "string"
          ? {
              title: error,
              description: error,
              type: "error",
              position: "top-right",
            }
          : {
              title: "Error",
              description: "No se pudo completar",
              type: "error",
              position: "top-right",
            },
      position: "top-right",
    });
  },

  dismiss: (id?: string | number, library?: ToastLibrary) => {
    const selectedLibrary = library ?? activeToastLibrary;

    if (selectedLibrary === "sonner") {
      return sonnerToast.dismiss(id?.toString());
    }

    return sileo.dismiss(id?.toString() ?? "");
  },

  dismissAll: (library?: ToastLibrary) => {
    const selectedLibrary = library ?? activeToastLibrary;

    if (selectedLibrary === "sonner") {
      return sonnerToast.dismiss();
    }

    return sileo.clear();
  },
};
