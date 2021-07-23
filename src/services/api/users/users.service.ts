import axios from 'axios';

import CommonRequestManager from '../common';

class UsersService {
  async getUser(id: string) {
    const response = await CommonRequestManager.apiRequest('GET', '/users/' + id, {});

    if (axios.isAxiosError(response)) {
      return false;
    }

    return response.data;
  }
}

export default new UsersService();
