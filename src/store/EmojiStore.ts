import { createStore, createEvent } from 'effector';
import Emoji from './models/Emoji';

const cacheEmojis = createEvent<Emoji[]>();

interface EmojiCache {
  [key: string]: Emoji
}

const $EmojiCacheStore = createStore<EmojiCache>({});

$EmojiCacheStore
  .on(cacheEmojis, (state: EmojiCache, emojis: Emoji[]) => {
    let modifiedState = { ...state };
    emojis.map((emoji) => {
      modifiedState = { ...modifiedState, [emoji.id]: emoji };
      return null;
    });
    return modifiedState;
  })
  

export default $EmojiCacheStore;
export { cacheEmojis };
