import axios from 'axios';

import CommonRequestManager from '../common';

class UsersService {
  private rateLimit: boolean = false;

  async getUser(id: string) {
    if (this.rateLimit) return;

    this.rateLimit = true;

    const response = await CommonRequestManager.apiRequest('GET', '/users/' + id, {});

    if (axios.isAxiosError(response)) {
      return false;
    }

    this.rateLimit = false;

    return response.data;
  }

  async patchMe(patch: object) {
    const response = await CommonRequestManager.apiRequest('PATCH', `/users/@me`, patch);

    if (axios.isAxiosError(response)) {
      return false;
    }

    return response.data;
  }

  async putEmojiPack(packId: string) {
    const response = await CommonRequestManager.apiRequest('PUT', `/users/@me/emojiPacks/${packId}`, {});

    if (axios.isAxiosError(response)) {
      return false;
    }

    return response.data;
  }
}

export default new UsersService();
