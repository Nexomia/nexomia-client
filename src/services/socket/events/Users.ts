import CustomMessageEvent from '../models/CustomMessageEvent';

import { modifyUser } from '../../../store/UserCacheStore';
import $UserStore, { setUser } from '../../../store/UserStore';

class UserEventHandler {
  userConnected(event: CustomMessageEvent) {
    modifyUser({ user: event.info.data.id, patch: { connected: true } });
  }

  userDisconnected(event: CustomMessageEvent) {
    modifyUser({ user: event.info.data.id, patch: { connected: false } });
  }

  userPatched(event: CustomMessageEvent) {
    modifyUser({ user: event.info.data.id, patch: event.info.data });
    if (event.info.data.id === $UserStore.getState().id) {
      setUser(event.info.data);
    }
  }
}

export default new UserEventHandler();
