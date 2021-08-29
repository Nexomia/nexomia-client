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
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

interface ModalProps {
  active: boolean
}

const negativeColorCss = css`
  color: var(--text-negative);
`

function ServerCreationModal({ active }: ModalProps) {
  const layerRef = useRef(null);

  const history = useHistory();

  const { t } = useTranslation(['settings']);

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
        <LoadingPlaceholder title={ (modalPage === 1 && t('modals.server_creating')) || t('modals.server_joining') } active={ loading } />
        { modalPage === 0 && (
          <Fragment>
            <ModalHeader>{ t('modals.server_create_header') }<br /><StyledText>{ t('modals.server_create_description') }</StyledText></ModalHeader>
            <BigPageButton onClick={ () => setModalPage(1) }>{ t('modals.server_action_create') }</BigPageButton>
            <BigPageButton onClick={ () => setModalPage(2) }>{ t('modals.server_action_join') }</BigPageButton>
          </Fragment>
        ) }

        { modalPage === 1 && (
          <Fragment>
            <ModalHeader>{ t('modals.server_create_name_header') }</ModalHeader>
            <InputField placeholder={ t('modals.server_create_name_placeholder') } onChange={ (event) => { setNameValue(event.target.value) } } />
            { (createError && <StyledText className={ negativeColorCss }>{ t('modals.server_create_error') }</StyledText>) }
            <FilledButton onClick={ createServer }>{ t('modals.create') }</FilledButton>
          </Fragment>
        ) }

        { modalPage === 2 && (
          <Fragment>
            <ModalHeader>{ t('modals.server_join_header') }</ModalHeader>
            <InputField placeholder={ t('modals.server_join_invite_placeholder') } onChange={ (event) => { setInviteValue(event.target.value) } } />
            { (joinError && <StyledText className={ negativeColorCss }>{ t('modals.server_join_error') }</StyledText>) }
            <FilledButton onClick={ joinServer }>{ t('modals.join') }</FilledButton>
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

    history.push(`/channels/${id}`);

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

    history.push(`/channels/${id}`);

    setLoading(false);
    setNameValue('');
    setInviteValue('');
    setModalState({ serverCreation: false });
  }
}

export default ServerCreationModal;
