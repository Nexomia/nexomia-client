import { Fragment } from 'react';

import ServerCreationModal from '../modals/ServerCreationModal';

import { useAppSelector } from '../../store/hooks';

function Modals() {
  const modals = useAppSelector((state) => state.modals.value);

  return (
    <Fragment>
      <ServerCreationModal active={ modals.serverCreation } />
    </Fragment>
  )
}

export default Modals;
