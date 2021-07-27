export default interface User {
  /**
   * The user's id
   */
  id: string;

  /**
   * The user's username, not unique across the platform
   */
  username?: string;

  /**
   * The user's 4-digit nexo-tag
   */
  discriminator?: string;

  /**
   * Whether the user belongs to an OAuth2 application
   */
  bot?: boolean;

  /**
   * 	Whether the user is an Official ******Discord****** System user (part of the urgent message system)
   */
  system?: boolean;

  /**
   * Whether the email on this account has been verified
   */
  verified?: boolean;

  /**
   * The flags on a user's account
   */
  flags?: number;

  /**
   * The public flags on a user's account
   */
  public_flags?: number;

  /**
   * The type of Nitro subscription on a user's account
   */
  premium_type?: boolean;

  /**
   * whether the user is banned
   */
  banned?: boolean;

  /**
   * The user's guilds
   */
  guilds?: string[];

  /**
   * The user's friends
   */
  friends?: string[];

  /**
   * The user's avatar
   */
  avatar?: string;

  /**
   * The user's banner
   */
  banner?: string;

  /**
   * The user's status
   */
  status?: string;

  /**
   * The user's profile description
   */
  description?: string;

  /**
   * The user's activity status
   * 1 - online
   * 2 - idle
   * 3 - DnD
   * 4 - offline
   */
  presence?: 1 | 2 | 3 | 4;
}
