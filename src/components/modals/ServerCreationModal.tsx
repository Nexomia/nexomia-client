import { css } from 'linaria';
import classNames from 'classnames';
import { useState, useRef, Fragment, useEffect } from 'react';

import { setModalState } from '../../store/ModalStore';
import { addGuild } from '../../store/GuildStore';
import { cacheGuilds } from '../../store/GuildCacheStore';

import GuildsService from '../../services/api/guilds/guilds.service';

import Layer from '../ui/Layer';
import LayerBackgroundShadeCss from '../css/LayerBackgroundShadeCss';
import InactiveLayerCss from '../css/InactiveLayerCss';
import Modal from '../ui/Modal';
import ModalHeader from '../ui/ModalHeader';
import StyledText from '../ui/StyledText';
import BigPageButton from '../ui/BigPageButton';
import InputField from '../ui/InputField';
import FilledButton from '../ui/FilledButton';
import LoadingPlaceholder from '../ui/LoadingPlaceholder';

interface ServerCreationModalProps {
  active: boolean
}

const negativeColorCss = css`
  color: var(--text-negative);
`

function ServerCreationModal({ active }: ServerCreationModalProps) {
  const layerRef = useRef(null);

  const [modalPage, setModalPage] = useState(0);
  const [nameValue, setNameValue] = useState('');
  const [inviteValue, setInviteValue] = useState('');

  const [joinError, setJoinError] = useState(false);
  const [createError, setCreateError] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (active) {
      setModalPage(0);
      setJoinError(false);
      setCreateError(false);
      setNameValue('');
      setInviteValue('');
    }
  }, [active]);

  return (
    <Layer className={ classNames({ [LayerBackgroundShadeCss]: true, [InactiveLayerCss]: !active }) } onClick={ (event) => { closeModal(event) } } ref={ layerRef }>
      <Modal className={ css`width: 440px` }>
        <LoadingPlaceholder title={ (modalPage === 1 && 'Creating your server...') || 'Joining server...' } active={ loading } />
        { modalPage === 0 && (
          <Fragment>
            <ModalHeader>Join or create a server<br /><StyledText>Talk with friends in your private space or create a public community!</StyledText></ModalHeader>
            <BigPageButton onClick={ () => setModalPage(1) }>Create a server</BigPageButton>
            <BigPageButton onClick={ () => setModalPage(2) }>Join a server</BigPageButton>
          </Fragment>
        ) }

        { modalPage === 1 && (
          <Fragment>
            <ModalHeader>Name your server</ModalHeader>
            <InputField placeholder="Server Name" onChange={ (event) => { setNameValue(event.target.value) } } />
            { (createError && <StyledText className={ negativeColorCss }>Failed to create server.</StyledText>) }
            <FilledButton onClick={ createServer }>Create</FilledButton>
          </Fragment>
        ) }

        { modalPage === 2 && (
          <Fragment>
            <ModalHeader>Enter your invite</ModalHeader>
            <InputField placeholder="Invite Code" onChange={ (event) => { setInviteValue(event.target.value) } } />
            { (joinError && <StyledText className={ negativeColorCss }>Failed to join this server. Invite code is invalid or you have been banned from that server.</StyledText>) }
            <FilledButton onClick={ joinServer }>Join</FilledButton>
          </Fragment>
        ) }
      </Modal>
    </Layer>
  );

  // TODO: что-то сделать с этим пиздецом в типах
  function closeModal(event: any) {
    if (event.target !== layerRef.current) return;
    setModalState({ serverCreation: false });
  }

  async function createServer() {
    setLoading(true);
    const response = await GuildsService.createGuild(nameValue);
    if (!response) {
      setCreateError(true);
      setLoading(false);
      return;
    }

    const { id, name } = response;

    cacheGuilds([{
      id,
      name,
      icon: response.icon || '',
      channels: []
    }]);
    addGuild(id);

    setLoading(false);
    setNameValue('');
    setInviteValue('');
    setModalState({ serverCreation: false });
  }

  async function joinServer() {
    setLoading(true);
    const response = await GuildsService.joinGuild(inviteValue);
    if (!response) {
      setJoinError(true);
      setLoading(false);
      return;
    }

    const { id, name } = response;

    cacheGuilds([{
      id,
      name,
      icon: response.icon || '',
      channels: []
    }]);
    addGuild(id);

    setLoading(false);
    setNameValue('');
    setInviteValue('');
    setModalState({ serverCreation: false });
  }
}

export default ServerCreationModal;
