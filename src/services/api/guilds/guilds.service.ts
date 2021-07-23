import axios from 'axios';

import CommonRequestManager from '../common';

class GuildsService {
  async getUserGuilds() {
    const response = await CommonRequestManager.apiRequest('GET', '/users/@me/guilds', {});

    if (axios.isAxiosError(response)) {
      return false;
    }

    return response.data;
  }

  async createGuild(name: string) {
    const response = await CommonRequestManager.apiRequest('POST', '/guilds', { name });

    if (axios.isAxiosError(response)) {
      return false;
    }

    return response.data;
  }

  async joinGuild(inviteCode: string) {
    const response = await CommonRequestManager.apiRequest('GET', `/invites/${inviteCode}/accept`, {});

    if (axios.isAxiosError(response)) {
      return false;
    }

    return response.data;
  }
}

export default new GuildsService();
