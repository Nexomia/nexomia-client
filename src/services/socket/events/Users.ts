import CustomMessageEvent from '../models/CustomMessageEvent';

import { modifyUser } from '../../../store/UserCacheStore';

class UserEventHandler {
  userConnected(event: CustomMessageEvent) {
    modifyUser({ user: event.info.data.id, patch: { connected: true } });
  }

  userDisconnected(event: CustomMessageEvent) {
    modifyUser({ user: event.info.data.id, patch: { connected: false } });
  }
}

export default new UserEventHandler();
