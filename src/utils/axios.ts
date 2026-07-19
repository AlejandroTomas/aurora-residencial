// src/utils/axios.ts
import { authService } from "@/core/services";
import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";
import { setCookie } from "@/utils/cookies";

/**
 * Configuración de la instancia global de Axios.
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.ejemplo.com",
  timeout: 10000, // Tiempo de espera de 10 segundos
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Interceptor de solicitud para agregar el token de autorización.
 */
apiClient.interceptors.request.use(
  async (config) => {
    // Recuperar el token del local
    const token = (await authService.getSession())?.token;

    if (token) {
      // Agregar el token al encabezado Authorization
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Manejo de errores en la solicitud
    return Promise.reject(error);
  },
);

/**
 * Interceptor de respuestas para manejo de errores global.
 */
apiClient.interceptors.response.use(
  async (response: AxiosResponse) => {
    const nextToken = response.headers?.["x-auth-token"];

    if (nextToken) {
      const currentSession = await authService.getSession();

      if (currentSession) {
        const updatedSession = {
          ...currentSession,
          token: String(nextToken),
        };

        await authService.setSession(updatedSession);
        setCookie("token", JSON.stringify(updatedSession));
      }
    }

    return response;
  },
  (error: AxiosError) => {
    const customMessage =
      (error.response?.data as any)?.message ||
      error.message ||
      "Ocurrió un error inesperado";

    console.error("Error en solicitud:", customMessage);
    return Promise.reject(error); // ⭐ Rechazar con el error original, no crear uno nuevo aquí
  },
);

// ⭐ Interface para errores estructurados
export interface ApiErrorResponse {
  message: string;
  status?: number;
  data?: any;
  response?: any;
}

/**
 * ⭐ Helper para crear error estructurado sin usar new Error()
 */
function createApiError(error: any): ApiErrorResponse {
  return {
    message: error?.response?.data?.message || error.message || "Request error",
    status: error?.response?.status,
    data: error?.response?.data,
    response: error.response,
  };
}

/**
 * Funciones utilitarias con manejo de errores personalizado.
 */
export const get = async <T>(url: string, params?: object): Promise<T> => {
  try {
    const response = await apiClient.get<T>(url, { params });
    return response.data;
  } catch (error: any) {
    // ⭐ Lanzar objeto simple en lugar de new Error()
    throw createApiError(error);
  }
};

export const post = async <T>(url: string, data?: object): Promise<T> => {
  try {
    const response = await apiClient.post<T>(url, data);
    return response.data;
  } catch (error: any) {
    // ⭐ Lanzar objeto simple en lugar de new Error()
    throw createApiError(error);
  }
};

export const put = async <T>(url: string, data?: object): Promise<T> => {
  try {
    const response = await apiClient.put<T>(url, data);
    return response.data;
  } catch (error: any) {
    // ⭐ Lanzar objeto simple en lugar de new Error()
    throw createApiError(error);
  }
};

export const del = async <T>(url: string): Promise<T> => {
  try {
    const response = await apiClient.delete<T>(url);
    return response.data;
  } catch (error: any) {
    // ⭐ Lanzar objeto simple en lugar de new Error()
    throw createApiError(error);
  }
};

export const patch = async <T>(url: string, data?: object): Promise<T> => {
  try {
    const response = await apiClient.patch<T>(url, data);
    return response.data;
  } catch (error: any) {
    // ⭐ Lanzar objeto simple en lugar de new Error()
    throw createApiError(error);
  }
};

export default apiClient;
