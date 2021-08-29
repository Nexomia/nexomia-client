import { createStore, createEvent } from 'effector-root';

const setModalState = createEvent<Modals>();

interface Modals {
  [key: string]: boolean
}

const $ModalStore = createStore<Modals>({
  serverCreation: false,
  channelCreation: false,
  inviteCreation: false
});

$ModalStore.on(setModalState, (state, modifiedState: Modals) => ({ ...state, ...modifiedState }));

export default $ModalStore;
export { setModalState };
