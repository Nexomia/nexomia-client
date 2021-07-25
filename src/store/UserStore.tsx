import { createStore, createEvent } from 'effector';

const setUser = createEvent<UserInfo>();

interface UserInfo {
  id: string,
  username: string,
  discriminator: string,
  avatar: string,
  verified: boolean,
  flags: number,
  premiumType: boolean,
  publicFlags: number,
  email: string
}

const $UserStore = createStore<UserInfo>({
  id: '',
  username: '',
  discriminator: '',
  avatar: '',
  verified: false,
  flags: 0,
  premiumType: false,
  publicFlags: 0,
  email: ''
});

$UserStore.on(setUser, (state, user: UserInfo) => ({ ...state, user }));

export default $UserStore;
export { setUser };
