import axios from 'axios';

import CommonRequestManager from '../common';

class ChannelsService {
  async getGuildChannels(guild: string) {
    const response = await CommonRequestManager.apiRequest('GET', `/guilds/${guild}/channels`, {});

    if (axios.isAxiosError(response)) {
      return false;
    }

    return response.data;
  }

  async getDMChannels() {
    const response = await CommonRequestManager.apiRequest('GET', `/users/@me/channels`, {});

    if (axios.isAxiosError(response)) {
      return false;
    }

    return response.data;
  }

  async sendTyping(channel: string) {
    await CommonRequestManager.apiRequest('POST', `/channels/${channel}/typing`, {});
  }

  async createInvite(channel: string) {
    const response = await CommonRequestManager.apiRequest('POST', `/channels/${channel}/invites`, {});

    if (axios.isAxiosError(response)) {
      return false;
    }

    return response.data;
  }

  async getInvites(channel: string) {
    const response = await CommonRequestManager.apiRequest('GET', `/channels/${channel}/invites`, {});

    if (axios.isAxiosError(response)) {
      return false;
    }

    return response.data;
  }

  async readChannel(channel: string, message_id?: string) {
    const response = await CommonRequestManager.apiRequest('POST', `/channels/${channel}/read`, { message_id });

    if (axios.isAxiosError(response)) {
      return false;
    }

    return;
  }

  async patchChannel(channel: string, dto: object) {
    const response = await CommonRequestManager.apiRequest('PATCH', `/channels/${channel}`, dto);

    if (axios.isAxiosError(response)) {
      return false;
    }

    return response.data;
  }
}

export default new ChannelsService();
