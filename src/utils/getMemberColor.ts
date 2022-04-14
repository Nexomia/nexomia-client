import $GuildCacheStore from '../store/GuildCacheStore';
import $MemberCacheStore from '../store/MemberCacheStore';
import $RoleCacheStore from '../store/RolesCacheStore';

export default function getMemberColor(guildId: string, userId: string) {
  const GuildCache = $GuildCacheStore.getState();
  const RoleCache = $RoleCacheStore.getState();
  const MemberCache = $MemberCacheStore.getState();

  for (const role of (GuildCache[guildId]?.roles || [])) {
    if (
      MemberCache[userId + guildId] &&
      MemberCache[userId + guildId].roles.includes(role) &&
      RoleCache[role]?.color
    ) {
      return RoleCache[role].color;
    }
  }
}
