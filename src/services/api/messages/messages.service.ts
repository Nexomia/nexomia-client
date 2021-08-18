import axios from 'axios';

import CommonRequestManager from '../common';

class MessagesService {
  async sendMessage(channel: string, content: string) {
    const response = await CommonRequestManager.apiRequest('POST', `/channels/${channel}/messages`, { content });

    if (axios.isAxiosError(response)) {
      return false;
    }

    return response.data;
  }

  async deleteMessage(channel: string, message: string) {
    const response = await CommonRequestManager.apiRequest('DELETE', `/channels/${channel}/messages/${message}`, {});

    if (axios.isAxiosError(response)) {
      return false;
    }

    return response.data;
  }

  async getChannelMessages(channel: string, offset: number = 0) {
    const response = await CommonRequestManager.apiRequest('GET', `/channels/${channel}/messages`, { offset });

    if (axios.isAxiosError(response)) {
      return false;
    }

    return response.data;
  }
}

export default new MessagesService();
