import { cacheChannels } from '../../../store/ChannelCacheStore';
import { setGuildChannels } from '../../../store/ChannelStore';
import Channel from '../../../store/models/Channel';
import ChannelsService from '../../api/channels/channels.service';
import CustomMessageEvent from '../models/CustomMessageEvent';

class ChannelEventHandler {
  async channelCreated(event: CustomMessageEvent) {
    cacheChannels([event.info.data]);

    const response = await ChannelsService.getGuildChannels(event.info.data.guild_id);
    setGuildChannels({ guild: event.info.data.guild_id, channels: response.map((channel: Channel) => channel.id) });
  }

  async channelDeleted(event: CustomMessageEvent) {
    const response = await ChannelsService.getGuildChannels(event.info.data.guild_id);
    setGuildChannels({ guild: event.info.data.guild_id, channels: response.map((channel: Channel) => channel.id) });
  }
}

export default new ChannelEventHandler();
