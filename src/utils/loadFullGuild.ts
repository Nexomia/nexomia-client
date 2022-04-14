import GuildsService from '../services/api/guilds/guilds.service';
import { cacheChannels } from '../store/ChannelCacheStore';
import { setGuildChannels } from '../store/ChannelStore';
import { cacheGuilds, setGuildMembers, setGuildRoles } from '../store/GuildCacheStore';
import { cacheMembers } from '../store/MemberCacheStore';
import Channel from '../store/models/Channel';
import Role from '../store/models/Role';
import { cacheRoles } from '../store/RolesCacheStore';
import { cacheUsers } from '../store/UserCacheStore';

export default async function loadFullGuild(guildId: string) {
  const response = await GuildsService.getFullGuild(guildId || '');
  const membersResponse = await GuildsService.getGuildMembers(guildId || '');
  if (!response) return null;

  const { channels, members, roles, ...guild } = response;
  cacheGuilds([guild]);
  cacheUsers([...membersResponse].map((member: any) => member.user));
  setGuildMembers({ guild: guildId, members: [...membersResponse].map((member: any) => member.id) });
  cacheMembers([...membersResponse].map((member: any) => {
    delete member.user;
    return { ...member, guild: guildId };
  }));
  cacheRoles(roles);
  setGuildRoles({ guild: guildId, roles: roles.sort((a: Role, b: Role) => (a.position || 0) - (b.position || 0)).map((role: Role) => role.id) });
  cacheChannels(channels);
  setGuildChannels({ guild: guildId, channels: channels.map((channel: Channel) => channel.id) });
  
  return response;
}
