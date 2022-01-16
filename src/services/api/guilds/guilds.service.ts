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

  async getFullGuild(guild: string) {
    const response = await CommonRequestManager.apiRequest('GET', `/guilds/${guild}`, {});

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

  async createGuildChannel(guild: string, info: object) {
    const response = await CommonRequestManager.apiRequest('POST', `/guilds/${guild}/channels`, info);

    if (axios.isAxiosError(response)) {
      return false;
    }

    return response.data;
  }

  async deleteGuildChannel(guild: string, channel: string) {
    const response = await CommonRequestManager.apiRequest('DELETE', `/guilds/${guild}/channels/${channel}`, {});

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

  async leaveGuild(guild: string) {
    return await CommonRequestManager.apiRequest('DELETE', `/users/@me/guilds/${guild}`, {});
  }

  async patchGuild(guild: string, patch: object) {
    const response = await CommonRequestManager.apiRequest('PATCH', `/guilds/${guild}`, patch);

    if (axios.isAxiosError(response)) {
      return false;
    }

    return response.data;
  }

  async getGuildMembers(guild: string) {
    const response = await CommonRequestManager.apiRequest('GET', `/guilds/${guild}/members`, {});

    if (axios.isAxiosError(response)) {
      return false;
    }

    return response.data;
  }

  async getGuildInvites(guild: string) {
    const response = await CommonRequestManager.apiRequest('GET', `/guilds/${guild}/invites`, {});

    if (axios.isAxiosError(response)) {
      return false;
    }

    return response.data;
  }

  async getGuildBans(guild: string) {
    const response = await CommonRequestManager.apiRequest('GET', `/guilds/${guild}/bans`, {});

    if (axios.isAxiosError(response)) {
      return false;
    }

    return response.data;
  }

  async addGuildBan(guild: string, user: string, ban: object) {
    const response = await CommonRequestManager.apiRequest('PUT', `/guilds/${guild}/bans/${user}`, ban);

    if (axios.isAxiosError(response)) {
      return false;
    }

    return response.data;
  }

  async removeGuildBan(guild: string, user: string) {
    const response = await CommonRequestManager.apiRequest('DELETE', `/guilds/${guild}/bans/${user}`, {});

    if (axios.isAxiosError(response)) {
      return false;
    }

    return response.data;
  }
}

export default new GuildsService();
