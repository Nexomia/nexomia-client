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

  async patchRole(guild: string, roleId: string, rolePatch: object) {
    const response = await CommonRequestManager.apiRequest('PATCH', `/guilds/${guild}/roles/${roleId}`, rolePatch);

    if (axios.isAxiosError(response)) {
      return false;
    }

    return response.data;
  }

  async createRole(guild: string) {
    await CommonRequestManager.apiRequest('POST', `/guilds/${guild}/roles`, {});
  }
}

export default new RolesService();
