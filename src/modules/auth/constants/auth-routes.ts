/**
 * Rutas del flujo de autenticación. Centralizadas para no repetir strings
 * (nextjs.md: "Nunca repetir textos") y tener un único lugar donde cambiarlas.
 */
export const AUTH_ROUTES = {
  login: "/login",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  callback: "/auth/callback",
  afterLogin: "/dashboard",
} as const;
