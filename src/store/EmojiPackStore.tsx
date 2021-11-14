import { createStore, createEvent } from 'effector-root';
import { cacheEmojis } from './EmojiStore';
import Emoji from './models/Emoji';
import EmojiPack from './models/EmojiPack';

const cacheEmojiPacks = createEvent<EmojiPack[]>();

interface EmojiPackCache {
  [key: string]: EmojiPack
}

const $EmojiPackCacheStore = createStore<EmojiPackCache>({});

$EmojiPackCacheStore
  .on(cacheEmojiPacks, (state: EmojiPackCache, packs: EmojiPack[]) => {
    let modifiedState = { ...state };
    packs.map((pack) => {
      const { emojis, ...cleanPack }: any = pack;
      cleanPack.emojis = emojis.map((e: Emoji) => e.id);
      modifiedState = { ...modifiedState, [pack.id]: cleanPack };
      cacheEmojis(emojis);
      return null;
    });
    return modifiedState;
  })
  

export default $EmojiPackCacheStore;
export { cacheEmojiPacks };
