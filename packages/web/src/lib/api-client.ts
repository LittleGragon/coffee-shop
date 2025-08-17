// Lightweight API client that adds Authorization header (JWT from localStorage) and JSON handling.

function getToken(): string {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem('token') || '';
  } catch {
    return '';
  }
}

function buildHeaders(init?: HeadersInit): HeadersInit {
  const h = new Headers(init || {});
  if (!h.has('Content-Type')) h.set('Content-Type', 'application/json');
  const token = getToken();
  if (token && !h.has('Authorization')) h.set('Authorization', `Bearer ${token}`);
  return h;
}

async function handle<T>(res: Response): Promise<T> {
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  if (!res.ok) {
    const err = isJson ? await res.json().catch(() => ({})) : await res.text();
    throw new Error(
      typeof err === 'string'
        ? err
        : err?.error || err?.message || `Request failed with status ${res.status}`
    );
  }
  return (isJson ? res.json() : (res.text() as any)) as Promise<T>;
}

export async function apiGet<T = any>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, headers: buildHeaders(init?.headers) });
  return handle<T>(res);
}

export async function apiPost<T = any>(url: string, body?: any, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...init,
    headers: buildHeaders(init?.headers),
  });
  return handle<T>(res);
}

export const fetcher = <T = any>(url: string) => apiGet<T>(url);