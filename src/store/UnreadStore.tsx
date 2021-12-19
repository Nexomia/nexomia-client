import { createStore, createEvent } from 'effector-root';

const setUnreads = createEvent<string[]>();
const addUnread = createEvent<string>();
const removeUnread = createEvent<string>();

interface Unreads {
  [key: string]: number
}

const $UnreadStore = createStore<Unreads>({});

$UnreadStore
  .on(setUnreads, (state, ids: string[]) => {
    const modifiedState = { ...state };

    ids.forEach(id => (modifiedState[id] = 1));
  })
  .on(addUnread, (state, id: string) => ({ ...state, [id]: 1 }))
  .on(removeUnread, (state, id: string) => {
    const modifiedState = { ...state };
    delete modifiedState[id];

    return modifiedState;
  });

export default $UnreadStore;
export { setUnreads, addUnread, removeUnread };
