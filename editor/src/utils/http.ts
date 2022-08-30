import axios, { AxiosError } from 'axios';
import { ErrorDto } from './api';

const isProduction = process.env.NODE_ENV == 'production';
const isStaging = process.env.NODE_ENV == 'staging';

class ClientFactory {
  static createAxiosClient(cookie: any) {
    let baseURL: string | undefined = '';

    if (cookie || isProduction || isStaging) baseURL = process.env.VUE_APP_BASE_URL_API;

    const config = {
      baseURL,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: !!baseURL
    };

    const client = axios.create(config);

    if (cookie) client.defaults.headers.Cookie = cookie;

    return client;
  }
}

export function getErrorData(errorResponse: AxiosError) {
  if (!errorResponse.response) return [];

  return <ErrorDto[]>errorResponse.response.data;
}

export function createEditorPageUrl(projectId: number, pageId: number) {
  const editorEndpoint = process.env.EDITOR_ENDPOINT ? process.env.EDITOR_ENDPOINT : '';
  return `${editorEndpoint}/editor/projects/${projectId}/pages/${pageId}`;
}

export function getCabinetUrl() {
  return process.env.VUE_APP_CABINET_URL ? process.env.VUE_APP_CABINET_URL : '';
}

export function redirectTo404() {
  location.href = `${getCabinetUrl()}/404`;
  return true;
}

export default {
  _createClient(cookie: any = null) {
    return ClientFactory.createAxiosClient(cookie);
  },
  get(url: string, data: any = null, cookie: any = null) {
    const client = this._createClient(cookie);
    return client.get(url, { params: data });
  },
  post(url: string, data: any = null) {
    const client = this._createClient();
    return client.post(url, data);
  },
  put(url: string, data: any = null) {
    const client = this._createClient();
    return client.put(url, data);
  },
  patch(url: string, data: any = null) {
    const client = this._createClient();
    return client.patch(url, data);
  },
  delete(url: string, data: any = null) {
    const client = this._createClient();
    return client.delete(url, { params: data });
  }
};
