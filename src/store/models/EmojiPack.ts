import EmojiPackAccess from './EmojiPackAccess';
import EmojiPackOwner from './EmojiPackOwner';
import EmojiPackStats from './EmojiPackStats';
import EmojiPackType from './EmojiPackType';

export default interface EmojiPack {
  id: string,
  available: boolean,
  type: EmojiPackType
  name: string,
  icon?: string,
  description?: string,
  access: EmojiPackAccess,
  owner_id: string,
  owner: EmojiPackOwner,
  stats?: EmojiPackStats,
  emojis: string[]
}
