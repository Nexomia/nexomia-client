import { createStore, createEvent } from 'effector';

const setToken = createEvent<string>();
const setRefreshToken = createEvent<string>();

interface AuthStore {
  token: string,
  refreshToken: string
}

const $AuthStore = createStore<AuthStore>({
  token: localStorage.getItem('authid') || '',
  refreshToken: localStorage.getItem('rauthid') || ''
});

$AuthStore
  .on(setToken, (state, token: string) => {
    localStorage.setItem('authid', token);
    return { ...state, token };
  })
  .on(setRefreshToken, (state, refreshToken: string) => {
    localStorage.setItem('rauthid', refreshToken);
    return { ...state, refreshToken };
  });

export default $AuthStore;
export { setToken, setRefreshToken };
