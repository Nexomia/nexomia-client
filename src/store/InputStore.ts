import { createStore, createEvent } from 'effector-root';

const updateInputInfo = createEvent<InputInfo>();
const addForwards = createEvent<ForwardInputInfo>();
const addAttachments = createEvent<AttachmentInputInfo>();

interface InputInfo {
  channel: string,
  forwards: string[],
  attachments: string[]
}

interface ForwardInputInfo {
  channel: string,
  forwards: string[]
}

interface AttachmentInputInfo {
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
  .on(addForwards, (state: InputCache, input: ForwardInputInfo) => {
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
  .on(addAttachments, (state: InputCache, input: AttachmentInputInfo) => {
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
