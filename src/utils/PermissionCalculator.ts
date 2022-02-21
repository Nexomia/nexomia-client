import $ChannelCacheStore from '../store/ChannelCacheStore';
import $GuildCacheStore from '../store/GuildCacheStore';
import $MemberCacheStore from '../store/MemberCacheStore';
import $RoleCacheStore from '../store/RolesCacheStore';
import $UserStore from '../store/UserStore';

class PermissionCalculator {
  getUserPermissions(guild: string, channel: string, user: string): number {
    const GuildStore = $GuildCacheStore.getState();
    const ChannelStore = $ChannelCacheStore.getState();
    const MemberStore = $MemberCacheStore.getState();
    const RolesStore = $RoleCacheStore.getState();
    const UserStore = $UserStore.getState();

    let result = 0;

    if (GuildStore[guild]?.owner_id === (user || UserStore.id)) {
      return 2097151;
    }
    
    [ ...(GuildStore[guild]?.roles || []) ]?.reverse().map((roleId) => {
      if (MemberStore[user ? user + guild : UserStore.id + guild].roles.includes(roleId)) {
        const permissions = RolesStore[roleId]?.permissions;
        if (channel && ChannelStore[channel]?.permission_overwrites.length) {
          const overwrite = ChannelStore[channel]?.permission_overwrites.filter(ow => ow.id === roleId)[0] || false
          if (overwrite) {
            permissions.deny &= ~overwrite.deny;
            permissions.allow |= overwrite.allow;
          }
        }
        result &= ~permissions.deny;
        result |= permissions.allow;
      }
      return null;
    });

    result &= ~(MemberStore[(user || UserStore.id) + guild]?.permissions?.deny || 0);
    result |= (MemberStore[(user || UserStore.id) + guild]?.permissions?.allow || 0);

    if (result & 1) {
      return 2097151;
    }

    if (result & 2) {
      return 2097150;
    }
    
    return result;
  }
}

export default new PermissionCalculator();
