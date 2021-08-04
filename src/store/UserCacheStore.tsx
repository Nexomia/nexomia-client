import { createStore, createEvent } from 'effector-root';

import User from './models/User';

const cacheUsers = createEvent<User[]>();
const modifyUser = createEvent<UserModificationInfo>();

interface UserCache {
  [key: string]: User
}

interface UserModificationInfo {
  user: string,
  patch: any
}

const $UserCacheStore = createStore<UserCache>({});

$UserCacheStore
  .on(cacheUsers, (state: UserCache, users: User[]) => {
    let modifiedState = { ...state };
    users.map((user) => {
      modifiedState = { ...modifiedState, [user.id]: user };
      return null;
    });
    return modifiedState;
  })
  .on(modifyUser, (state: UserCache, info: UserModificationInfo) => {
    let modifiedState = { ...state };
    modifiedState[info.user] = {
      ...modifiedState[info.user],
      ...info.patch
    }
    return modifiedState;
  })

export default $UserCacheStore;
export { cacheUsers, modifyUser };
