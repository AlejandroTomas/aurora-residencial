import { AppError, type ErrorCode } from "./app-error";

/**
 * El plan de suscripción del tenant no permite crear más registros de este tipo.
 * El mensaje indica el límite para que la UI pueda guiar al usuario a subir de plan.
 */
export class PlanLimitExceededError extends AppError {
  readonly code: ErrorCode = "PLAN_LIMIT_EXCEEDED";
  readonly httpStatus = 409;
}
