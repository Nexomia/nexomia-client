import classNames from 'classnames';
import { css } from 'linaria';
import { useRef, useState } from 'react';
import { useParams } from 'react-router';
import GuildsService from '../../services/api/guilds/guilds.service';
import { cacheChannels } from '../../store/ChannelCacheStore';
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

interface ChannelCreationModalProps {
  active: boolean
}

interface RouteParams {
  guildId: string
}

const negativeColorCss = css`
  color: var(--text-negative);
`

function ChannelCreationModal({ active }: ChannelCreationModalProps) {
  const { guildId } = useParams<RouteParams>();

  const layerRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState(false);

  return (
    <Layer className={ classNames({ [LayerBackgroundShadeCss]: true, [InactiveLayerCss]: !active }) } onClick={ (event) => { closeModal(event) } } ref={ layerRef }>
      <Modal className={ css`width: 440px` }>
        <LoadingPlaceholder title={ 'Creating Channel...' } active={ loading } />
        <ModalHeader>Create a Channel</ModalHeader>
        <InputField
          placeholder='Name'
          onChange={ (event) => { setName(event.target.value) } }
        />
        { (error && <StyledText className={ negativeColorCss }>Failed to create channel.</StyledText>) }
        <FilledButton onClick={ createChannel }>Create</FilledButton>
      </Modal>
    </Layer>
  )

  function closeModal(event: any) {
    if (event?.target !== layerRef?.current) return;
    setModalState({ channelCreation: false });
  }

  async function createChannel() {
    setLoading(true);

    const response = await GuildsService.createGuildChannel(guildId, { name });

    if (!response) {
      setError(true);
    }

    setLoading(false);
    closeModal({});
  }
}

export default ChannelCreationModal;
