import { createStore, createEvent } from 'effector';

const setModalState = createEvent<object>();

interface Modals {
  serverCreation: boolean
}

const $ModalStore = createStore<Modals>({
  serverCreation: false
});

$ModalStore.on(setModalState, (state, modifiedState: object) => ({ ...state, modifiedState }));

export default $ModalStore;
export { setModalState };
