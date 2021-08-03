import Emoji from './Emoji';

export default interface Guild {
  /**
   * Guild id
   */  
  id: string;

  /**
   * Guild name (2-100 characters, excluding trailing and leading whitespace)
   */
  name: string;

  /**
   * When this message was sent
   */
  created?: number;

  /**
   * Icon hash
   */
  icon?: string;

  /**
   * Id of owner
   */
  owner_id?: string;

  /**
   * Voice region id for the guild
   */
  region?: string;

  /**
   * Id of afk channel
   */
  afk_channel_id?: string;

  /**
   * Afk timeout in seconds
   */
  afk_timeout?: number;

  /**
   * True if the server widget is enabled
   */
  widget_enabled?: boolean;

  /**
   * The channel id that the widget will generate an invite to, or @type { null } if set to no invite
   */
  widget_channel_id?: string | null;

  /**
   * Verification level required for the guild
   */
  verification_level?: number;

  /**
   * default message notifications level
   */
  default_message_notifications?: number;

  /**
   * Roles in the guild
   */
  roles?: string[];

  /**
   * Custom guild emojis
   */
  emojis?: Emoji[];

  /**
   * Enabled guild features
   */
  features?: string[];

  /**
   * Required MFA level for the guild
   */
  mfa_level?: number;

  /**
   * Application id of the guild creator if it is bot-created
   */
  application_id?: string;

  /**
   * The id of the channel where guild notices such as welcome messages and boost events are posted
   */
  system_channel_id?: string;

  /**
   * System channel flags
   */
  system_channel_flags?: number;

  /**
   * The id of the channel where Community guilds can display rules and/or guidelines
   */
  rules_channel_id?: string;

  /**
   * Users in the guild
   */
  // members?: GuildMember[];
  members?: string[];

  /**
   * Channels in the guild
   */
  channels: string[];

  /**
   * All active threads in the guild that current user has permission to view
   */
  threads?: string[];

  /**
   * The vanity url code for the guild
   */
  vanity_url_code?: string;

  /**
   * The description for the guild, if the guild is discoverable
   */
  description?: string;

  /**
   * Banner
   */
  banner?: string;

  /**
   * The preferred locale of a Community guild; used in server discovery and notices from Nexomia
   */
  preferred_locale?: string;

  /**
   * The id of the channel where admins and moderators of Community guilds receive notices from Nexomia
   */
  public_updates_channel_id?: string;

  /**
   * The maximum amount of users in a video channel
   */
  max_video_channel_users?: number;

  /**
   * True if this guild is designated as NSFW
   */
  nsfw?: boolean;
}
