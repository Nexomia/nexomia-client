import $UserCacheStore from './UserCacheStore'

export default function getGroupDMName(recipients: string[]) {
  const userCache = $UserCacheStore.getState();
  return recipients.splice(0, 3).map((id: string) => userCache[id].username).join(', ');
}