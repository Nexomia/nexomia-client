import { createStore, createEvent } from 'effector';

import GuildMember from './models/GuildMember';

const cacheMembers = createEvent<GuildMember[]>();

interface MemberCache {
  [key: string]: GuildMember
}

const $MemberCacheStore = createStore<MemberCache>({});

$MemberCacheStore
  .on(cacheMembers, (state: MemberCache, members: GuildMember[]) => {
    let modifiedState = { ...state };
    members.map((member) => {
      modifiedState = { ...modifiedState, [member.id + member.guild]: member };
      return null;
    });
    return modifiedState;
  })
  

export default $MemberCacheStore;
export { cacheMembers };
