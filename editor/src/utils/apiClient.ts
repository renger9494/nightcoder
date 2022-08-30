import { Api } from '@/utils/api';

class ApiClientFactory {
  static createApiClient() {
    const config = {
      baseURL: process.env.VUE_APP_BASE_URL_API,
      withCredentials: !!process.env.VUE_APP_BASE_URL_API
    };

    return new Api(config);
  }
}

export interface FeedbackDto {
  Email?: string | null;
  Subject?: string | null;
  Description?: string | null;
  Attachment?: File | null;
}

export default ApiClientFactory.createApiClient();
