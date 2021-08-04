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
    
    [ ...(GuildStore[guild]?.roles || []) ]?.reverse().map((roleId) => {
      if (RolesStore[roleId]?.members?.includes(user || UserStore.id)) {
        const permissions = RolesStore[roleId]?.permissions;
        result &= ~permissions.deny;
        result |= permissions.allow;
      }
      return null;
    });

    if (channel) {
      result &= ~(ChannelStore[channel]?.permission_overwrites?.deny || 0);
      result |= ChannelStore[channel]?.permission_overwrites?.allow || 0;
    }

    result &= ~(MemberStore[(user || UserStore.id) + guild]?.permissions?.deny || 0);
    result |= (MemberStore[(user || UserStore.id) + guild]?.permissions?.allow || 0);
    
    return result;
  }
}

export default new PermissionCalculator();
