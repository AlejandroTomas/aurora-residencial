export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

interface LogContext {
  [key: string]: unknown;
}

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4,
};

const MIN_LEVEL: LogLevel =
  process.env.NODE_ENV === "production" ? "info" : "debug";

function write(level: LogLevel, message: string, context?: LogContext) {
  if (LEVEL_ORDER[level] < LEVEL_ORDER[MIN_LEVEL]) return;

  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(context ? { context } : {}),
  };

  const output = level === "error" || level === "fatal" ? console.error : console.log;
  output(JSON.stringify(entry));
}

export const logger = {
  debug: (message: string, context?: LogContext) => write("debug", message, context),
  info: (message: string, context?: LogContext) => write("info", message, context),
  warn: (message: string, context?: LogContext) => write("warn", message, context),
  error: (message: string, context?: LogContext) => write("error", message, context),
  fatal: (message: string, context?: LogContext) => write("fatal", message, context),
};
