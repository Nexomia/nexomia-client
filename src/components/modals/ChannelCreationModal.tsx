import classNames from 'classnames';
import { css } from 'linaria';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import GuildsService from '../../services/api/guilds/guilds.service';
import { setModalState } from '../../store/ModalStore';
import InactiveLayerCss from '../css/InactiveLayerCss';
import LayerBackgroundShadeCss from '../css/LayerBackgroundShadeCss';
import FilledButton from '../ui/FilledButton';
import InputField from '../ui/InputField';
import Layer from '../ui/Layer';
import LoadingPlaceholder from '../ui/LoadingPlaceholder';
import Modal from '../ui/Modal';
import ModalHeader from '../ui/ModalHeader';
import StyledText from '../ui/StyledText';

interface ModalProps {
  active: boolean
}

interface RouteParams {
  guildId: string
}

const negativeColorCss = css`
  color: var(--text-negative);
`

function ChannelCreationModal({ active }: ModalProps) {
  const { guildId } = useParams<RouteParams>();

  const layerRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { t } = useTranslation(['settings']);

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState(false);

  return (
    <Layer className={ classNames({ [LayerBackgroundShadeCss]: true, [InactiveLayerCss]: !active }) } onClick={ (event) => { closeModal(event) } } ref={ layerRef }>
      <Modal className={ css`width: 440px` }>
        <LoadingPlaceholder title={ t('modals.channel_creating')! } active={ loading } />
        <ModalHeader>{ t('modals.channel_create_header')! }</ModalHeader>
        <InputField
          placeholder={ t('modals.name')! }
          onChange={ (event) => { setName(event.target.value) } }
          ref={ inputRef }
        />
        { (error && <StyledText className={ negativeColorCss }>{ t('modals.channel_create_error')! }</StyledText>) }
        <FilledButton onClick={ createChannel }>{ t('modals.create')! }</FilledButton>
      </Modal>
    </Layer>
  )

  function closeModal(event: any) {
    if (event.target !== layerRef.current) return;
    setModalState({ channelCreation: false });
  }

  async function createChannel() {
    setLoading(true);

    const response = await GuildsService.createGuildChannel(guildId, { name, type: 3 });
    setLoading(false);

    if (!response) {
      return setError(true);
    }

    setName('');
    if (inputRef.current)
      inputRef.current.value = '';
    setModalState({ channelCreation: false });
  }
}

export default ChannelCreationModal;
