import { createStore, createEvent } from 'effector-root';

import Role from './models/Role';

const cacheRoles = createEvent<Role[]>();
const updateRole = createEvent<RoleUpdateInfo>();

interface RoleUpdateInfo {
  role: string,
  patch: any
}

interface RoleCache {
  [key: string]: Role
}

const $RoleCacheStore = createStore<RoleCache>({});

$RoleCacheStore
  .on(cacheRoles, (state: RoleCache, roles: Role[]) => {
    let modifiedState = { ...state };
    roles.map((role) => {
      modifiedState = { ...modifiedState, [role.id]: role };
      return null;
    });
    return modifiedState;
  })
  .on(updateRole, (state: RoleCache, info: RoleUpdateInfo) => {
    let modifiedState = { ...state };
    modifiedState = { ...modifiedState, [info.role]: { ...modifiedState[info.role], ...info.patch } };
    return modifiedState;
  })

export default $RoleCacheStore;
export { cacheRoles, updateRole };
