import axios from 'axios';

import CommonRequestManager from '../common';

class RolesService {
  async getGuildRoles(guild: string) {
    const response = await CommonRequestManager.apiRequest('GET', `/guilds/${guild}/roles`, {});

    if (axios.isAxiosError(response)) {
      return false;
    }

    return response.data;
  }
}

export default new RolesService();
