import { createEvent, createStore } from 'effector';

interface ContextMenu {
  type?: string,
  top?: number,
  left?: number,
  visible?: boolean,
  lock?: boolean,
  id?: string,
  data?: {
    [key: string]: any
  }
}

const $ContextMenuStore = createStore<ContextMenu>({
  type: '',
  top: 0,
  left: 0,
  visible: false,
  lock: false,
  data: {}
});

const setContextMenu = createEvent<ContextMenu>();

$ContextMenuStore.on(setContextMenu, (state: ContextMenu, newState: ContextMenu) => ({ ...state, ...newState }));

export default $ContextMenuStore;
export { setContextMenu };
