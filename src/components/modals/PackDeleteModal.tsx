import classNames from 'classnames';
import { useStore } from 'effector-react';
import { css } from 'linaria';
import { useRef, useState } from 'react';
// import { useTranslation } from 'react-i18next';
import EmojisService from '../../services/api/emojis/emojis.service';
import $ModalStore, { setModalState } from '../../store/ModalStore';
import { removeEmojiPack } from '../../store/UserStore';
import InactiveLayerCss from '../css/InactiveLayerCss';
import LayerBackgroundShadeCss from '../css/LayerBackgroundShadeCss';
import FilledButton from '../ui/FilledButton';
import Layer from '../ui/Layer';
import LoadingPlaceholder from '../ui/LoadingPlaceholder';
import Modal from '../ui/Modal';
import ModalHeader from '../ui/ModalHeader';
import StyledText from '../ui/StyledText';

interface ModalProps {
  active: boolean
}

function PackDeleteModal({ active }: ModalProps) {
  const layerRef = useRef(null);

  const Modals = useStore($ModalStore);

  // const { t } = useTranslation(['settings']);

  const [loading, setLoading] = useState(false);

  return (
    <Layer className={ classNames({ [LayerBackgroundShadeCss]: true, [InactiveLayerCss]: !active }) } onClick={ (event) => { closeModal(event) } } ref={ layerRef }>
      <Modal className={ css`width: 440px` }>
        <LoadingPlaceholder title={ 'Working' } active={ loading } />
        <ModalHeader>{ 'Are you sure?' }<br /><StyledText>{ 'This pack will be removed from your list until you add it here again.' }</StyledText></ModalHeader>
        <FilledButton onClick={ apply }>{ 'Delete' }</FilledButton>
      </Modal>
    </Layer>
  )

  function closeModal(event: any) {
    if (event.target !== layerRef.current) return;
    setModalState({ packDelete: [false, ''] });
  }

  async function apply() {
    setLoading(true);
    await EmojisService.deletePack(Modals.packDelete[1]);
    setLoading(false);
    removeEmojiPack(Modals.packDelete[1]);
    setModalState({ packDelete: [false, ''] });
  }
}

export default PackDeleteModal;
