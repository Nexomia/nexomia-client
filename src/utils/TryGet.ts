import UsersService from '../services/api/users/users.service';
import $UserCacheStore from '../store/UserCacheStore';

class TryGet {
  async user(id: string) {
    const Users = $UserCacheStore.getState();
    return Users[id] || await UsersService.getUser(id);
  }
}

export default new TryGet();
