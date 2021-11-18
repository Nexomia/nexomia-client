import $ChannelCacheStore, { cacheChannels } from '../../../store/ChannelCacheStore';
import { setGuildChannels } from '../../../store/ChannelStore';
import Channel from '../../../store/models/Channel';
import $TypersStore, { addTyper, removeTyper } from '../../../store/TypersStore';
import $UserStore from '../../../store/UserStore';
import ChannelsService from '../../api/channels/channels.service';
import CustomMessageEvent from '../models/CustomMessageEvent';

interface TimeoutInfo {
  channel: string,
  timeout: NodeJS.Timeout
}

interface Timeouts {
  [key: string]: TimeoutInfo
}
class ChannelEventHandler {
  private timeouts: Timeouts = {};

  async channelCreated(event: CustomMessageEvent) {
    cacheChannels([event.info.data]);

    const response = await ChannelsService.getGuildChannels(event.info.data.guild_id);
    setGuildChannels({ guild: event.info.data.guild_id, channels: response.map((channel: Channel) => channel.id) });
  }

  async channelDeleted(event: CustomMessageEvent) {
    const guildId = $ChannelCacheStore.getState()[event.info.data.id].guild_id
    const response = await ChannelsService.getGuildChannels(guildId || '');
    setGuildChannels({ guild: guildId || '', channels: response.map((channel: Channel) => channel.id) });
  }

  async channelTyping(event: CustomMessageEvent) {
    if ($UserStore.getState().id === event.info.data.user_id) return;

    const Typers = $TypersStore.getState();

    clearTimeout(this.timeouts[event.info.data.user_id]?.timeout);

    if (
      this.timeouts[event.info.data.user_id] &&
      this.timeouts[event.info.data.user_id].channel !== event.info.data.channel_id
    ) {
      removeTyper({ channel: this.timeouts[event.info.data.user_id].channel, user: event.info.data.user_id });
      delete this.timeouts[event.info.data.user_id];
    }

    if (!Typers[event.info.data.channel_id]?.includes(event.info.data.user_id)) {
      addTyper({ channel: event.info.data.channel_id, user: event.info.data.user_id });
    }

    this.timeouts[event.info.data.user_id] = {
      timeout: setTimeout(() => {
        removeTyper({ channel: this.timeouts[event.info.data.user_id].channel, user: event.info.data.user_id });
        delete this.timeouts[event.info.data.user_id];
      }, 4000),
      channel: event.info.data.channel_id
    };
  }
}

export default new ChannelEventHandler();
