import $GuildCacheStore, { addGuildMembers, removeGuildMember } from '../../../store/GuildCacheStore';
import $RoleCacheStore from '../../../store/RolesCacheStore';
import { cacheUsers } from '../../../store/UserCacheStore';
import $UserStore from '../../../store/UserStore';
import TryGet from '../../../utils/TryGet';
import CustomMessageEvent from '../models/CustomMessageEvent';
import $ChannelCacheStore, { cacheChannels } from '../../../store/ChannelCacheStore';

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

  async channelPermissionOverwrite(event: CustomMessageEvent) {
    const ChannelsCache = $ChannelCacheStore.getState();
    if (!ChannelsCache[event.info.data.channel_id]) return;
    console.log(event.info.data)
    const index = ChannelsCache[event.info.data.channel_id].permission_overwrites.findIndex(ow => ow.id === event.info.data.data.id)
    if (index + 1)
      ChannelsCache[event.info.data.channel_id].permission_overwrites[index] = event.info.data.data
    else {
      ChannelsCache[event.info.data.channel_id].permission_overwrites.push(event.info.data.data)
    }
    cacheChannels([ChannelsCache[event.info.data.channel_id]])
    console.log(ChannelsCache[event.info.data.channel_id])
  }

}

export default new GuildEventHandler();
