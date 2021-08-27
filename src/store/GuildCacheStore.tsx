import { createStore, createEvent } from 'effector-root';

import Guild from './models/Guild';

const cacheGuilds = createEvent<Guild[]>();
const setGuildRoles = createEvent<GuildRolesInfo>();
const setGuildMembers = createEvent<GuildMembersInfo>();
const addGuildMembers = createEvent<GuildMembersInfo>();
const removeGuildMember = createEvent<GuildMemberInfo>();

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

interface GuildMemberInfo {
  guild: string,
  member: string
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
  .on(addGuildMembers, (state: GuildCache, info: GuildMembersInfo) => {
    const modifiedState = { ...state };
    modifiedState[info.guild].members = [...(state[info.guild].members || []), ...info.members];
    return modifiedState;
  })
  .on(removeGuildMember, (state: GuildCache, info: GuildMemberInfo) => {
    const modifiedState = { ...state };
    modifiedState[info.guild]?.members?.splice(modifiedState[info.guild]?.members?.indexOf(info.member || '') || -1, 1);
    return modifiedState;
  });

export default $GuildCacheStore;
export { cacheGuilds, setGuildRoles, setGuildMembers, addGuildMembers, removeGuildMember };
