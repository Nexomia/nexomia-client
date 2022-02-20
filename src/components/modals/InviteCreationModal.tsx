import classNames from 'classnames';
import { useStore } from 'effector-react';
import { css } from 'linaria';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ChannelsService from '../../services/api/channels/channels.service';
import $ChannelCacheStore from '../../store/ChannelCacheStore';
import $ChannelStore from '../../store/ChannelStore';
import $ContextMenuStore from '../../store/ContextMenuStore';
import $GuildCacheStore, { addGuildInvites } from '../../store/GuildCacheStore';
import { setModalState } from '../../store/ModalStore';
import InactiveLayerCss from '../css/InactiveLayerCss';
import LayerBackgroundShadeCss from '../css/LayerBackgroundShadeCss';
import DropdownKey from '../interfaces/DropdownKey';
import DropdownInput from '../ui/DropdownInput';
import FilledButton from '../ui/FilledButton';
import Layer from '../ui/Layer';
import LoadingPlaceholder from '../ui/LoadingPlaceholder';
import Modal from '../ui/Modal';
import ModalHeader from '../ui/ModalHeader';
import StyledText from '../ui/StyledText';

interface ModalProps {
  active: boolean
}

function InviteCreationModal({ active }: ModalProps) {
  const layerRef = useRef(null);

  const { t } = useTranslation(['settings']);

  const { id, data } = useStore($ContextMenuStore);
  const Channels = useStore($ChannelStore);
  const ChannelsCache = useStore($ChannelCacheStore);
  const GuildsCache = useStore($GuildCacheStore);

  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [selected, setSelected]: [DropdownKey | null, any] = useState(null);

  useEffect(() => {
    if (active) {
      setCode('');
      setSelected(null);
    }
  }, [active]);

  return (
    <Layer className={ classNames({ [LayerBackgroundShadeCss]: true, [InactiveLayerCss]: !active }) } onClick={ (event) => { closeModal(event) } } ref={ layerRef }>
      <Modal className={ css`width: 440px` }>
        <LoadingPlaceholder title={ t('modals.invite_creating') } active={ loading } />
        { !code ? (
          <Fragment>
            <ModalHeader>{ t('modals.invite_header') }<br /><StyledText>{ t('modals.invite_description') }</StyledText></ModalHeader>
            <DropdownInput
              keys={
                !data?.channel ? Channels[id || '']?.map((channel) => ({
                  id: channel,
                  text: ChannelsCache[channel].name || ''
                })) ||
                [] : [
                  { id: ChannelsCache[id || ''].id, text: ChannelsCache[id || ''].name || '' }
                ]
              }
              defaultKey={ !data?.channel && id ? Number(id) : 0 }
              onChange={ setSelected }
            />
            { (selected || data?.channel) && <FilledButton onClick={ createInvite }>Continue</FilledButton> }
          </Fragment>
        ) : (
          <Fragment>
            <ModalHeader>{ t('modals.invite_created') }<br /><StyledText>{ t('modals.invite_created_description') }</StyledText></ModalHeader>
            <ModalHeader className={ css`cursor: pointer; &:hover{ color: var(--accent) }` } onClick={ copyCode }>{ code }</ModalHeader>
          </Fragment>
        ) }
      </Modal>
    </Layer>
  )

  function closeModal(event: any) {
    if (event.target !== layerRef.current) return;
    setModalState({ inviteCreation: false });
  }

  async function createInvite() {
    setLoading(true);

    const response = await ChannelsService.createInvite(selected?.id || id || '');
    setLoading(false);

    if (!response) return;

    setCode(response.code);

    if (GuildsCache[ChannelsCache[selected?.id || id || ''].guild_id || '']?.invites?.length)
      addGuildInvites({ guild: ChannelsCache[selected?.id || id || '']?.guild_id || '', invites: [response] });
  }

  function copyCode() {
    navigator.clipboard.writeText(code);
  }
}

export default InviteCreationModal;
