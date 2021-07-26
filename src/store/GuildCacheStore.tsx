import { createStore, createEvent } from 'effector-root';

import Guild from './models/Guild';

const cacheGuilds = createEvent<Guild[]>();

interface GuildCache {
  [key: string]: Guild
}

const $GuildCacheStore = createStore<GuildCache>({});

$GuildCacheStore
  .on(cacheGuilds, (state: GuildCache, guilds: Guild[]) => {
    let modifiedState = { ...state };
    guilds.map((guild) => {
      modifiedState = { ...modifiedState, [guild.id]: guild };
    });
    return modifiedState;
  })

export default $GuildCacheStore;
export { cacheGuilds };
