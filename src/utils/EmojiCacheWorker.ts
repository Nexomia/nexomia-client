import { parse, EmojiEntity } from 'twemoji-parser';
import emojis from 'emojibase-data/en/data.json';

interface Cache {
  [key: string]: EmojiEntity[]
}

// eslint-disable-next-line
self.onmessage = () => {
  const cache: Cache = {};

  for (const emoji of emojis) {
    cache[emoji.emoji] = parse(emoji.emoji);
  }

  // eslint-disable-next-line
  self.postMessage(cache);
}

export {};
