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
        result &= ~permissions.deny;
        result |= permissions.allow;
        if (channel && ChannelStore[channel]?.permission_overwrites.length) {
          console.log(channel )
          const overwrite = ChannelStore[channel]?.permission_overwrites.filter(ow => ow.id === roleId)[0] || false
          if (overwrite) {
          result &= ~overwrite.deny;
          result |= overwrite.allow;
          }
        }
      }
      return null;
    });

    if (channel && ChannelStore[channel]?.permission_overwrites.length) {
      const overwrite = ChannelStore[channel]?.permission_overwrites.filter(ow => ow.id === user || UserStore.id)[0] || false
      if (overwrite) {
        console.log(overwrite)
          result &= ~overwrite.deny;
          result |= overwrite.allow;
          console.log(result)
      }
    }

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
