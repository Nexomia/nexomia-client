import PermissionOverwrites from './PermissionOverwrites';

export default interface Role {
  id: string;

  guild_id: string;

  name: string;

  permissions: PermissionOverwrites;

  color?: string;

  hoist?: boolean;

  position?: number;

  mentionable?: boolean;

  default?: boolean;
}
