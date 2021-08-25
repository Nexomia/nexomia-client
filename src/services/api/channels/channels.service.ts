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

  async sendTyping(channel: string) {
    await CommonRequestManager.apiRequest('POST', `/channels/${channel}/typing`, {});
  }
}

export default new ChannelsService();
