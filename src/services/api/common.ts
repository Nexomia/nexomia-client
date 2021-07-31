import axios, { Method, AxiosResponse, AxiosError } from 'axios';

import config from '../../config';
import $AuthStore, { setToken, setRefreshToken } from '../../store/AuthStore';

class CommonRequestManager {
  private token = '';

  apiRequest(method: Method, path: string, data: object): Promise<AxiosResponse> | any {
    return axios.request({
      method,
      url: config.api.endpoint + path,
      data,
      headers: {
        authorization: this.token
      }
    }).catch(async (error: AxiosError) => {
      if (error.response?.status === 401) {
        try {
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

          return this.apiRequest(method, path, data);
        } catch {
          return error;
        }
      } else return error;
    });
  }

  setToken(token: string) {
    this.token = token;
  }
}

export default new CommonRequestManager();
