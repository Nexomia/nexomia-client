import PermissionOverwrites from './PermissionOverwrites';

export default interface Channel {
  id: string,
  created?: number,
  type?: number,
  guild_id?: string,
  position?: number,
  permission_overwrites?: PermissionOverwrites,
  name?: string,
  topic?: string,
  nsfw?: boolean,
  bitrate?: number,
  user_limit?: number,
  rate_limit_per_user?: number,
  recipients?: string[],
  icon?: string,
  owner_id?: string,
  application_id?: string,
  parent_id?: string,
  pinned_messages_ids?: string[],
  last_pin_timestamp?: number,
}
