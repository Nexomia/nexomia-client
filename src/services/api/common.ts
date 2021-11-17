import axios, { Method, AxiosResponse, AxiosError } from 'axios';

import config from '../../config';
import $AuthStore, { setToken, setRefreshToken } from '../../store/AuthStore';

import getUrlEncodedString from '../../utils/getUrlEncodedString';

class CommonRequestManager {
  private token = '';

  apiRequest(method: Method, path: string, data: object): Promise<AxiosResponse> | any {
    return axios.request({
      method,
      url: config.api.endpoint + path + (method === 'GET' ? `?${getUrlEncodedString(data)}` : ''),
      data,
      headers: {
        authorization: this.token
      }
    }).catch(async (error: AxiosError) => {
      if (error.response?.status === 401) {
        try {
          await this.refreshToken();
          return this.apiRequest(method, path, data);
        } catch {
          return error;
        }
      } else return error;
    });
  }

  async refreshToken() {
    const response = await axios.request({
      method: 'GET',
      url: config.api.endpoint + '/auth/token',
      headers: {
        refreshToken: $AuthStore.getState().refreshToken
      }
    });
    
    setToken(response.data.access_token);
    this.setToken(response.data.access_token);
    setRefreshToken(response.data.refresh_token);

    return response.data.refresh_token;
  }

  setToken(token: string) {
    this.token = token;
  }

  getToken() {
    return this.token;
  }
}

export default new CommonRequestManager();
