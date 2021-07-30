import { createEvent, createStore } from 'effector-root';

interface ContextMenu {
  type?: string,
  top?: number,
  left?: number,
  visible?: boolean,
  id?: string
}

const $ContextMenuStore = createStore<ContextMenu>({
  type: '',
  top: 0,
  left: 0,
  visible: false
});

const setContextMenu = createEvent<ContextMenu>();

$ContextMenuStore.on(setContextMenu, (state: ContextMenu, newState: ContextMenu) => ({ ...state, ...newState }));

export default $ContextMenuStore;
export { setContextMenu };
