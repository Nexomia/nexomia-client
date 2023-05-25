import { createStore, createEvent } from 'effector';

const addTyper = createEvent<TyperInfo>();
const removeTyper = createEvent<TyperInfo>();

interface TyperInfo {
  channel: string,
  user: string
}

interface Typers {
  [key: string]: string[]
}

const $TypersStore = createStore<Typers>({});

$TypersStore
  .on(addTyper, (state: Typers, info: TyperInfo) => (
    {
      ...state,
      [info.channel]: state[info.channel] ? state[info.channel].concat(info.user) : [info.user]
    }
  ))
  .on(removeTyper, (state: Typers, info: TyperInfo) => {
    const modifiedChannel = { ...state }[info.channel];
    modifiedChannel.splice(modifiedChannel.indexOf(info.user), 1);

    return {
      ...state,
      [info.channel]: modifiedChannel
    };
  });

export default $TypersStore;
export { addTyper, removeTyper };
