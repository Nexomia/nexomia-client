import { createStore, createEvent } from 'effector-root';

const setModalState = createEvent<object>();

interface Modals {
  serverCreation: boolean,
  channelCreation: boolean
}

const $ModalStore = createStore<Modals>({
  serverCreation: false,
  channelCreation: false
});

$ModalStore.on(setModalState, (state, modifiedState: object) => ({ ...state, ...modifiedState }));

export default $ModalStore;
export { setModalState };
