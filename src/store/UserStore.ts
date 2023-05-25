import { createStore, createEvent } from 'effector';

const setUser = createEvent<UserInfo>();
const addEmojiPack = createEvent<string>();
const removeEmojiPack = createEvent<string>();

interface UserInfo {
  id: string,
  username: string,
  description: string
  discriminator: string,
  avatar: string,
  status: string,
  banner: string,
  verified: boolean,
  flags: number,
  premium_type: boolean,
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
  status: '',
  banner: '',
  verified: false,
  flags: 0,
  premium_type: false,
  publicFlags: 0,
  email: '',
  emojiPacks: []
});

$UserStore
  .on(setUser, (state, user: UserInfo) => ({ ...state, ...user }))
  .on(addEmojiPack, (state: UserInfo, pack: string) => {
    let modifiedState = { ...state };
    modifiedState.emojiPacks.push(pack);
    return modifiedState;
  })
  .on(removeEmojiPack, (state: UserInfo, pack: string) => {
    let modifiedState = { ...state };
    modifiedState.emojiPacks.splice(modifiedState.emojiPacks.indexOf(pack), 1);
    return modifiedState;
  });

export default $UserStore;
export { setUser, removeEmojiPack, addEmojiPack };
