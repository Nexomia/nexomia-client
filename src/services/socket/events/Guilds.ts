import $GuildCacheStore, { addGuildMembers, removeGuildMember } from '../../../store/GuildCacheStore';
import $RoleCacheStore from '../../../store/RolesCacheStore';
import { cacheUsers } from '../../../store/UserCacheStore';
import $UserStore from '../../../store/UserStore';
import TryGet from '../../../utils/TryGet';
import CustomMessageEvent from '../models/CustomMessageEvent';

class GuildEventHandler {
  async memberJoined(event: CustomMessageEvent) {
    if ($UserStore.getState().id === event.info.data.id) return;

    const user = await TryGet.user(event.info.data.id);
    const Roles = $RoleCacheStore.getState();

    cacheUsers([user]);
    addGuildMembers({ guild: event.info.data.guild, members: [event.info.data.id] });
  }

  async memberLeft(event: CustomMessageEvent) {
    const Roles = $RoleCacheStore.getState();

    removeGuildMember({ guild: event.info.data.guild, member: event.info.data.id });
  }
}

export default new GuildEventHandler();
