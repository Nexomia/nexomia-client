export default interface Emoji {
  id: string; // emoji id

  name: string; // emoji name

  roles?: string[]; // roles allowed to use this emoji

  user_id?: string; // user object	user that created this emoji

  require_colons?: boolean; // whether this emoji must be wrapped in colons

  managed?: boolean; // whether this emoji is managed

  animated?: boolean; // whether this emoji is animated

  available?: boolean; // whether this emoji can be used, may be false due to loss of Server Boosts
}