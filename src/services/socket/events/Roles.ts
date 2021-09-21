import { setGuildRoles } from '../../../store/GuildCacheStore';
import Role from '../../../store/models/Role';
import { cacheRoles } from '../../../store/RolesCacheStore';
import RolesService from '../../api/roles/roles.service';
import CustomMessageEvent from '../models/CustomMessageEvent';

class RoleEventHandler {
  async roleCreated(event: CustomMessageEvent) {
    cacheRoles([event.info.data]);
  }

  async rolePatched(event: CustomMessageEvent) {
    const rolesResponse = await RolesService.getGuildRoles(event.info.data.guild_id || '');
    setGuildRoles({ guild: event.info.data.guild_id, roles: rolesResponse.sort((a: Role, b: Role) => (a.position || 0) - (b.position || 0)).map((role: Role) => role.id) });
  }
}

export default new RoleEventHandler();
