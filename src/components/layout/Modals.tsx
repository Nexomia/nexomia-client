import { Fragment } from 'react';

import ServerCreationModal from '../modals/ServerCreationModal';

import { useStore } from 'effector-react';
import $ModalStore from '../../store/ModalStore';
import ChannelCreationModal from '../modals/ChannelCreationModal';
import InviteCreationModal from '../modals/InviteCreationModal';
import ImagePreviewModal from '../modals/ImagePreviewModal';
import EmojiEditModal from '../modals/EmojiEditModal';
import PackDeleteModal from '../modals/PackDeleteModal';
import PackCreationModal from '../modals/PackCreationModal';
import EmojiPackModal from '../modals/EmojiPackModal';
import GuildBanUserModal from '../modals/GuildBanUserModal';
import PasswordConfirmationModal from '../modals/PasswordConfirmationModal';
import PickOverwriteModal from '../modals/PickOverwriteModal';

function Modals() {
  const modals = useStore($ModalStore);

  return (
    <Fragment>
      <ServerCreationModal active={ modals.serverCreation } />
      <ChannelCreationModal active={ modals.channelCreation } />
      <InviteCreationModal active={ modals.inviteCreation } />
      <GuildBanUserModal active={ modals.guildBanUser } />
      <ImagePreviewModal active={ modals.imagePreview[0] } />
      <EmojiEditModal active={ modals.emojiEdit[0] } />
      <PackDeleteModal active={ modals.packDelete[0] } />
      <PackCreationModal active={ modals.packCreation } />
      <EmojiPackModal active={ modals.emojiPack[0] } />
      <PasswordConfirmationModal active={modals.passwordConfirmation} />
      <PickOverwriteModal active={ modals.pickOverwrite } />
    </Fragment>
  )
}

export default Modals;
