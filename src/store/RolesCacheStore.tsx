import { createStore, createEvent } from 'effector-root';

import Role from './models/Role';

const cacheRoles = createEvent<Role[]>();
const updateRole = createEvent<RoleUpdateInfo>();
const addRoleMember = createEvent<RoleMemberInfo>();
const removeRoleMember = createEvent<RoleMemberInfo>();

interface RoleUpdateInfo {
  role: string,
  patch: any
}

interface RoleCache {
  [key: string]: Role
}

interface RoleMemberInfo {
  role: string,
  member: string
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
  .on(addRoleMember, (state: RoleCache, info: RoleMemberInfo) => {
    const modifiedState = { ...state };
    modifiedState[info.role].members = [...(state[info.role].members || []), info.member];
    return modifiedState;
  })
  .on(removeRoleMember, (state: RoleCache, info: RoleMemberInfo) => {
    const modifiedState = { ...state };
    modifiedState[info.role].members.splice(modifiedState[info.role].members.indexOf(info.member), 1);
    return modifiedState;
  });

export default $RoleCacheStore;
export { cacheRoles, updateRole, addRoleMember, removeRoleMember };
