export default interface Invite {
  code: string;

  guild_id?: string;

  channel_id?: string;

  inviter_id?: string;

  expires_at?: number;

  max_uses?: number;

  uses?: number;

  temporary?: boolean;
}
