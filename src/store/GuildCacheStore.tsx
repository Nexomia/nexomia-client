import { createStore, createEvent } from 'effector-root';

import Guild from './models/Guild';

const cacheGuilds = createEvent<Guild[]>();
const setGuildRoles = createEvent<GuildRolesInfo>();
const setGuildMembers = createEvent<GuildMembersInfo>();

interface GuildCache {
  [key: string]: Guild
}

interface GuildRolesInfo {
  guild: string,
  roles: string[]
}

interface GuildMembersInfo {
  guild: string,
  members: string[]
}

const $GuildCacheStore = createStore<GuildCache>({});

$GuildCacheStore
  .on(cacheGuilds, (state: GuildCache, guilds: Guild[]) => {
    let modifiedState = { ...state };
    guilds.map((guild) => {
      modifiedState = { ...modifiedState, [guild.id]: guild };
      return null;
    });
    return modifiedState;
  })
  .on(setGuildRoles, (state: GuildCache, info: GuildRolesInfo) => {
    const modifiedState = { ...state };
    modifiedState[info.guild].roles = info.roles;
    return modifiedState;
  })
  .on(setGuildMembers, (state: GuildCache, info: GuildMembersInfo) => {
    const modifiedState = { ...state };
    modifiedState[info.guild].members = info.members
    return modifiedState;
  })

export default $GuildCacheStore;
export { cacheGuilds, setGuildRoles, setGuildMembers };
