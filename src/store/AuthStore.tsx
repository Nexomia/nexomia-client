import { createStore, createEvent } from 'effector';

const setToken = createEvent<string>();
const setRefreshToken = createEvent<string>();

interface AuthStore {
  token: string,
  refreshToken: string
}

const $AuthStore = createStore<AuthStore>({
  token: '',
  refreshToken: ''
});

$AuthStore
  .on(setToken, (state, token: string) => ({ ...state, token }))
  .on(setRefreshToken, (state, refreshToken: string) => ({ ...state, refreshToken }));

export default $AuthStore;
export { setToken, setRefreshToken };
