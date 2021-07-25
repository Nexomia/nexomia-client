import { Fragment } from 'react';

import ServerCreationModal from '../modals/ServerCreationModal';

import { useStore } from 'effector-react';
import $ModalStore from '../../store/ModalStore';

function Modals() {
  const modals = useStore($ModalStore);

  return (
    <Fragment>
      <ServerCreationModal active={ modals.serverCreation } />
    </Fragment>
  )
}

export default Modals;
