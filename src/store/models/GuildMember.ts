import User from './User';
import PermissionOverwrites from './PermissionOverwrites';

export default interface GuildMember {
  id: string,
  joined_at: number,
  mute: false,
  deaf: false,
  guild: string,
  permissions: PermissionOverwrites
}
