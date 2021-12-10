import { createStore, createEvent } from 'effector-root';
import { cacheEmojis } from './EmojiStore';
import Emoji from './models/Emoji';
import EmojiPack from './models/EmojiPack';

const cacheEmojiPacks = createEvent<EmojiPack[]>();
const addEmoji = createEvent<AddEmojiInfo>();
const removeEmoji = createEvent<AddEmojiInfo>();

interface AddEmojiInfo {
  pack: string,
  emoji: string
}

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
  .on(addEmoji, (state: EmojiPackCache, info: AddEmojiInfo) => {
    let modifiedState = { ...state };
    modifiedState[info.pack].emojis.push(info.emoji);
    return modifiedState;
  })
  .on(removeEmoji, (state: EmojiPackCache, info: AddEmojiInfo) => {
    let modifiedState = { ...state };
    modifiedState[info.pack].emojis.splice(
      modifiedState[info.pack].emojis.indexOf(info.emoji),
      1
    );
    return modifiedState;
  });


export default $EmojiPackCacheStore;
export { cacheEmojiPacks, addEmoji, removeEmoji };
