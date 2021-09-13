import { createStore, createEvent } from 'effector-root';

const updateInputInfo = createEvent<InputInfo>();
const addForwards = createEvent<InputInfo>();

interface InputInfo {
  channel: string,
  forwards: string[]
}

interface InputCache {
  [key: string]: InputInfo
}

const $InputStore = createStore<InputCache>({});

$InputStore
  .on(updateInputInfo, (state: InputCache, input: InputInfo) => {
    let modifiedState = { ...state };
    const { channel, ...cleanInput } = input;
    modifiedState = { ...modifiedState, [input.channel]: { ...modifiedState[input.channel], ...cleanInput } };
    return modifiedState;
  })
  .on(addForwards, (state: InputCache, input: InputInfo) => {
    let modifiedState = { ...state };
    modifiedState = {
      ...modifiedState,
      [input.channel]: {
        ...modifiedState[input.channel],
        forwards: [...(modifiedState[input.channel]?.forwards || []), ...input.forwards]
      }
    };
    return modifiedState;
  })

export default $InputStore;
export { updateInputInfo, addForwards };
