import { css } from 'linaria';
import classNames from 'classnames';
import { useState, useRef, Fragment, useEffect } from 'react';

import { setModalState } from '../../store/ModalStore';

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
import EmojisService from '../../services/api/emojis/emojis.service';
import { cacheEmojiPacks } from '../../store/EmojiPackStore';
import { addEmojiPack } from '../../store/UserStore';

interface ModalProps {
  active: boolean
}

const negativeColorCss = css`
  color: var(--text-negative);
`

function PackCreationModal({ active }: ModalProps) {
  const layerRef = useRef(null);

  const { t } = useTranslation(['settings']);

  const [modalPage, setModalPage] = useState(0);
  const [packType, setPackType] = useState(0);
  const [nameValue, setNameValue] = useState('');
  const [error, setError] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (active) {
      setModalPage(0);
      setNameValue('');
    }
  }, [active]);

  return (
    <Layer className={ classNames({ [LayerBackgroundShadeCss]: true, [InactiveLayerCss]: !active }) } onClick={ (event) => { closeModal(event) } } ref={ layerRef }>
      <Modal className={ css`width: 440px` }>
        <LoadingPlaceholder title={ (modalPage === 1 && t('modals.server_creating')) || t('modals.server_joining') } active={ loading } />
        { modalPage === 0 && (
          <Fragment>
            <ModalHeader>{ 'New Emote Pack' }<br /><StyledText>{ 'Select the type of this pack.' }</StyledText></ModalHeader>
            <BigPageButton onClick={ () => { setModalPage(1); setPackType(0) } }>{ 'Emoji Pack' }</BigPageButton>
            <BigPageButton onClick={ () => { setModalPage(1); setPackType(1) } }>{ 'Sticker Pack' }</BigPageButton>
          </Fragment>
        ) }

        { modalPage === 1 && (
          <Fragment>
            <ModalHeader>{ 'Name your pack' }</ModalHeader>
            <InputField placeholder={ 'Pack name' } onChange={ (event) => { setNameValue(event.target.value) } } />
            { (error && <StyledText className={ negativeColorCss }>{ 'Something went wrong' }</StyledText>) }
            <FilledButton onClick={ createPack }>{ t('modals.create') }</FilledButton>
          </Fragment>
        ) }
      </Modal>
    </Layer>
  );

  function closeModal(event: any) {
    if (event.target !== layerRef.current) return;
    setModalState({ packCreation: false });
    setError(false);
  }

  async function createPack() {
    setLoading(true);
    
    const response = await EmojisService.createPack(nameValue, packType);
    setLoading(false);
    if (!response) {
      setError(true);
      return;
    }
    cacheEmojiPacks([response]);
    addEmojiPack(response.id);
    setNameValue('');
    setModalState({ packCreation: false });
  }
}

export default PackCreationModal;
