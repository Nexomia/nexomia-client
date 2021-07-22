import axios from 'axios';

import CommonRequestManager from '../common';

class AuthService {
  async login(login: string, password: string) {
    const response = await CommonRequestManager.apiRequest('post', '/auth/login', { login, password });

    if (axios.isAxiosError(response)) {
      return false;
    }

    return response.data;
  }

  async register(email: string, username: string, password: string) {
    const response = await CommonRequestManager.apiRequest('post', '/auth/register', { email, username, password });

    if (axios.isAxiosError(response)) {
      return false;
    }

    console.log(response);

    return true;
  }
}

export default new AuthService();
