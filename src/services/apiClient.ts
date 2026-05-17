import { getAuthSession, getAuthToken, hydrateAuthSession, setAuthSession } from '@/services/tokenStorage';
import { normalizeAuthRole } from '@/utils/auth';
import { store } from '@/store/store';
import { setSession } from '@/store/slices/authSlice';
import { setRole } from '@/store/slices/uiSlice';

export const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://10.51.139.173:4000/api';

export class ApiRequestError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.body = body;
  }
}

type JsonRequestInit = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

const isFormData = (value: unknown): value is FormData =>
  Boolean(
    value &&
    typeof value === 'object' &&
    typeof (value as any).append === 'function' &&
    (typeof FormData === 'undefined' || value instanceof FormData || Object.prototype.toString.call(value) === '[object FormData]')
  );

const buildUrl = (path: string) => {
  if (/^https?:\/\//i.test(path)) return path;
  return `${apiBaseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

export const requestJson = async <T>(path: string, options: JsonRequestInit = {}): Promise<T> => {
  const headers = new Headers(options.headers ?? {});
  headers.set('accept', 'application/json');

  let token = getAuthToken() ?? getAuthSession()?.token ?? null;
  if (!token) {
    const hydrated = await hydrateAuthSession();
    token = hydrated?.token ?? null;
  }
  if (token) {
    headers.set('authorization', `Bearer ${token}`);
  }

  const hasBody = options.body !== undefined && options.body !== null;
  const body = hasBody && !isFormData(options.body)
    ? JSON.stringify(options.body)
    : options.body;

  if (hasBody && !isFormData(options.body) && !headers.has('content-type')) {
    headers.set('content-type', 'application/json');
  }

  const url = buildUrl(path);
  const response = await fetch(url, {
    ...options,
    headers,
    body: body as BodyInit | null | undefined
  });

  const text = await response.text();
  let data: any = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    if (response.status === 401 && !/\/auth\/refresh$/i.test(path)) {
      const session = getAuthSession();
      if (session?.refreshToken) {
        const refreshResponse = await fetch(buildUrl('/auth/refresh'), {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json'
          },
          body: JSON.stringify({ refreshToken: session.refreshToken })
        });
        const refreshText = await refreshResponse.text();
        let refreshData: any = null;
        if (refreshText) {
          try {
            refreshData = JSON.parse(refreshText);
          } catch {
            refreshData = refreshText;
          }
        }

        if (refreshResponse.ok && refreshData?.data?.token) {
          const nextSession = {
            token: refreshData.data.token,
            refreshToken: refreshData.data.refreshToken ?? session.refreshToken,
            phone: refreshData.data.user?.phone ?? session.phone ?? null,
            role: normalizeAuthRole(refreshData.data.user?.role ?? session.role ?? 'shopper')
          };
          await setAuthSession(nextSession);
          store.dispatch(setSession(nextSession));
          store.dispatch(setRole(nextSession.role ?? 'shopper'));
          return requestJson<T>(path, options);
        }
      }
    }

    throw new ApiRequestError(
      data?.message ?? `Request failed with status ${response.status}`,
      response.status,
      data
    );
  }

  return data as T;
};

export const resolveUploadUrl = (path: string) => {
  if (/^https?:\/\//i.test(path)) return path;
  return `${apiBaseUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
};
