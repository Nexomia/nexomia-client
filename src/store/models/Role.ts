export default interface Role {
  id: string;

  guild_id: string;

  name: string;

  members: string[];

  // permissions: Permissions;

  color?: string;

  hoist?: boolean;

  position?: number;

  mentionable?: boolean;
}
