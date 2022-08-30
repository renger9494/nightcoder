import apiClient from '@/utils/apiClient';

export default {
  isTokenValid: async (cookie: any = null) => {
    try {
      const { status } = await apiClient.auth.authIsValidToken();

      return status == 200 || status == 204;
    } catch (error) {
      return false;
    }
  }
};
