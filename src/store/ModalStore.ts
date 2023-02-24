import { createStore, createEvent } from 'effector-root';

const setModalState = createEvent<Modals>();

interface Modals {
  [key: string]: any
}

const $ModalStore = createStore<Modals>({
  serverCreation: false,
  channelCreation: false,
  inviteCreation: false,
  imagePreview: [false, ''],
  emojiEdit: [false, '', '', ''],
  packDelete: [false, ''],
  packCreation: false,
  emojiPack: [false, ''],
  statusChange: false,
  warning: false
});

$ModalStore.on(setModalState, (state, modifiedState: Modals) => ({ ...state, ...modifiedState }));

export default $ModalStore;
export { setModalState };
