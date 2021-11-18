import { createStore, createEvent } from 'effector-root';

const setUser = createEvent<UserInfo>();

interface UserInfo {
  id: string,
  username: string,
  description: string
  discriminator: string,
  avatar: string,
  banner: string,
  verified: boolean,
  flags: number,
  premiumType: boolean,
  publicFlags: number,
  email: string,
  emojiPacks: string[]
}

const $UserStore = createStore<UserInfo>({
  id: '',
  username: '',
  description: '',
  discriminator: '',
  avatar: '',
  banner: '',
  verified: false,
  flags: 0,
  premiumType: false,
  publicFlags: 0,
  email: '',
  emojiPacks: []
});

$UserStore.on(setUser, (state, user: UserInfo) => ({ ...state, ...user }));

export default $UserStore;
export { setUser };
