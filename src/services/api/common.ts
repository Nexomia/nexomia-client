import axios, { Method, AxiosResponse, AxiosError } from 'axios';

import config from '../../config';

class CommonRequestManager {
  private token = '';

  private getConvertedData(data: object): string {
    let convertedString = '';

    const entries = Object.entries(data);

    for (const entry of entries) {
      convertedString += `${entry[0]}=${entry[1]}`;
      if (entries.indexOf(entry) < entries.length - 1) {
        convertedString += '&';
      }
    }

    console.log(convertedString);

    return convertedString;
  }

  apiRequest(method: Method, path: string, data: object): Promise<AxiosResponse> | any {
    return axios.request({
      method,
      url: config.api.endpoint + path,
      data: this.getConvertedData(data),
      headers: {
        authorization: this.token
      }
    }).catch((error: AxiosError) => {
      return error;
    });
  }

  setToken(token: string) {
    this.token = token;
  }
}

export default new CommonRequestManager();
