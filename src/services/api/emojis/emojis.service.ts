import axios from 'axios';

import CommonRequestManager from '../common';

class EmojisService {
  async putEmoji(name: string, fileId: string, packId: string) {
    const response = await CommonRequestManager.apiRequest('POST', `/emojis/${packId}/emoji`, { name, file_id: fileId });

    if (axios.isAxiosError(response)) {
      return false;
    }

    return response.data;
  }

  async editEmoji(name: string, id: string, packId: string) {
    const response = await CommonRequestManager.apiRequest('PATCH', `/emojis/${packId}/emoji/${id}`, { name, file_id: '' });

    if (axios.isAxiosError(response)) {
      return false;
    }

    return response.data;
  }

  async editPackIcon(icon: string, packId: string) {
    const response = await CommonRequestManager.apiRequest('PATCH', `/emojis/${packId}`, { icon });

    if (axios.isAxiosError(response)) {
      return false;
    }

    return response.data;
  }

  async editPackName(name: string, packId: string) {
    const response = await CommonRequestManager.apiRequest('PATCH', `/emojis/${packId}`, { name });

    if (axios.isAxiosError(response)) {
      return false;
    }

    return response.data;
  }

  async createPack(name: string, type: number) {
    const response = await CommonRequestManager.apiRequest('POST', `/emojis`, { name, type });

    if (axios.isAxiosError(response)) {
      return false;
    }

    return response.data;
  }

  async editPackDescription(description: string, packId: string) {
    const response = await CommonRequestManager.apiRequest('PATCH', `/emojis/${packId}`, { description });

    if (axios.isAxiosError(response)) {
      return false;
    }

    return response.data;
  }

  async deleteEmoji(id: string, packId: string) {
    const response = await CommonRequestManager.apiRequest('DELETE', `/emojis/${packId}/emoji/${id}`, {});

    if (axios.isAxiosError(response)) {
      return false;
    }

    return response.data;
  }

  async deletePack(packId: string) {
    const response = await CommonRequestManager.apiRequest('DELETE', `/emojis/${packId}`, {});

    if (axios.isAxiosError(response)) {
      return false;
    }

    return response.data;
  }
}

export default new EmojisService();
