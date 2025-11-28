export function getServerActionsError(
  error: unknown,
  message?: string
): string {
  if (error instanceof Error) {
    const base = message ? `${message}: ${error.message}` : error.message;
    return base;
  }
  if (typeof error === "string") {
    const base = message ? `${message}: ${error}` : error;
    return base;
  }
  return message ?? "Ocorreu um erro inesperado no servidor.";
}
