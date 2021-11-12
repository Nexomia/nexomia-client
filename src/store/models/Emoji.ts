import EmojiPack from './EmojiPack';

export default interface Emoji {
  id: string, // emoji id
  file_id: string, // emoji file id
  pack_id: string, //where emoji from
  name: string, // emoji name
  words: string[],
  user_id: string,
  animated?: boolean, // whether this emoji is animated
  deleted: boolean,
  url: string,
  emoji_pack?: EmojiPack
}
