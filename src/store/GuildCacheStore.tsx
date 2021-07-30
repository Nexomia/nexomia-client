import { createStore, createEvent } from 'effector-root';

import Guild from './models/Guild';
import Role from './models/Role';

const cacheGuilds = createEvent<Guild[]>();
const setGuildRoles = createEvent<GuildRolesInfo>();

interface GuildCache {
  [key: string]: Guild
}

interface GuildRolesInfo {
  guild: string,
  roles: string[]
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
  .on(setGuildRoles, (state: GuildCache, info: GuildRolesInfo) => {
    const modifiedState = { ...state };
    modifiedState[info.guild].roles = info.roles.reverse();
    return modifiedState;
  })

export default $GuildCacheStore;
export { cacheGuilds, setGuildRoles };
