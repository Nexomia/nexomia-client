import { EmojiEntity, parse } from 'twemoji-parser';

interface WorkerMessage {
  data: Cache
}

interface Cache {
  [key: string]: EmojiEntity[]
}

class EmojiCacheManager {
  public cache: Cache = {};

  generateCache() {
    console.log('[EmojiCacheManager] Building emoji cache...');

    const worker = new Worker(new URL('./EmojiCacheWorker.ts', import.meta.url));
    worker.postMessage({});

    worker.onmessage = ({ data }: WorkerMessage) => {
      this.cache = data;

      console.log('[EmojiCacheManager] Emoji processing has been finished.');
      console.log(this.cache);
    }
  }

  get(emoji: string) {
    return this.cache[emoji] || (this.cache[emoji] = parse(emoji));
  }
}

export default new EmojiCacheManager();
