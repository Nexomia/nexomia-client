import { Fragment } from 'react';

import ServerCreationModal from '../modals/ServerCreationModal';

import { useStore } from 'effector-react';
import $ModalStore from '../../store/ModalStore';
import ChannelCreationModal from '../modals/ChannelCreationModal';
import InviteCreationModal from '../modals/InviteCreationModal';

function Modals() {
  const modals = useStore($ModalStore);

  return (
    <Fragment>
      <ServerCreationModal active={ modals.serverCreation } />
      <ChannelCreationModal active={ modals.channelCreation } />
      <InviteCreationModal active={ modals.inviteCreation } />
    </Fragment>
  )
}

export default Modals;
