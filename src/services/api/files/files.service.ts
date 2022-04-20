import axios from 'axios';

import CommonRequestManager from '../common';

class FilesService {
  async uploadFile(url: string, content: any, progressCallback?: any) {
    const formData = new FormData();
    formData.append('file', content);

    const response = await axios.post(`https:${ url }`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        authorization: CommonRequestManager.getToken()
      },
      onUploadProgress: progressCallback
    });

    if (axios.isAxiosError(response)) {
      return false;
    }

    return response.data;
  }

  async createFile(type: number) {
    const response = await CommonRequestManager.apiRequest('GET', `/files/upload_server`, { file_type: type });

    if (axios.isAxiosError(response)) {
      return false;
    }

    return response.data.upload_url;
  }
}

export default new FilesService();
