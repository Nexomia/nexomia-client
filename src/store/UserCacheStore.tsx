import { createStore, createEvent } from 'effector-root';

import User from './models/User';

const cacheUsers = createEvent<User[]>();

interface UserCache {
  [key: string]: User
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

export default $UserCacheStore;
export { cacheUsers };
