import $GuildCacheStore from '../store/GuildCacheStore';
import $RoleCacheStore from '../store/RolesCacheStore';

export default function getMemberColor(guildId: string, userId: string) {
  const GuildCache = $GuildCacheStore.getState();
  const RoleCache = $RoleCacheStore.getState();

  for (const role of (GuildCache[guildId]?.roles || [])) {
    if (RoleCache[role]?.members.includes(userId) && RoleCache[role]?.color) {
      return RoleCache[role].color;
    }
  }
}
