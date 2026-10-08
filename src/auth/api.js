const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

export async function apiRequest(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      credentials: 'include',
      signal: options.signal || AbortSignal.timeout(10000),
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Comprobá que el backend esté iniciado.');
  }
  const data = await response.json().catch(() => null);
  if (!response.ok || !data) {
    const error = new Error(data?.error || data?.message || 'No se pudo completar la operación.');
    error.status = response.status;
    throw error;
  }
  return data;
}
