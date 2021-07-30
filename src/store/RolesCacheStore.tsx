import { createStore, createEvent } from 'effector-root';

import Role from './models/Role';

const cacheRoles = createEvent<Role[]>();

interface RoleCache {
  [key: string]: Role
}

const $RoleCacheStore = createStore<RoleCache>({});

$RoleCacheStore
  .on(cacheRoles, (state: RoleCache, roles: Role[]) => {
    let modifiedState = { ...state };
    roles.map((role) => {
      modifiedState = { ...modifiedState, [role.id]: role };
    });
    return modifiedState;
  })

export default $RoleCacheStore;
export { cacheRoles };
