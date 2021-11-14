import axios from 'axios';

import CommonRequestManager from '../common';

class MessagesService {
  async sendMessage(channel: string, content: string, forwards: string[], attachments: string[], sticker?: string) {
    const response = await CommonRequestManager.apiRequest('POST', `/channels/${channel}/messages`, { content, forwarded_messages: forwards, attachments, sticker_id: sticker });

    if (axios.isAxiosError(response)) {
      return false;
    }

    return response.data;
  }

  async getMessage(channel: string, message: string) {
    const response = await CommonRequestManager.apiRequest('GET', `/channels/${channel}/messages/${message}`, {});

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

  async pinMessage(channel: string, message: string) {
    const response = await CommonRequestManager.apiRequest('PUT', `/channels/${channel}/pins/${message}`, {});

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

  async getChannelPins(channel: string) {
    const response = await CommonRequestManager.apiRequest('GET', `/channels/${channel}/pins`, {});

    if (axios.isAxiosError(response)) {
      return false;
    }

    return response.data;
  }
}

export default new MessagesService();
