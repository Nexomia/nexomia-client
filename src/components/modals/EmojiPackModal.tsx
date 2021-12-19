import classNames from 'classnames';
import { useStore } from 'effector-react';
import { css } from 'linaria';
import { Fragment, useEffect, useRef, useState } from 'react';
import { styled } from 'linaria/react';
import $EmojiPackCacheStore, { cacheEmojiPacks } from '../../store/EmojiPackStore';
import $ModalStore, { setModalState } from '../../store/ModalStore';
import InactiveLayerCss from '../css/InactiveLayerCss';
import LayerBackgroundShadeCss from '../css/LayerBackgroundShadeCss';
import FilledButton from '../ui/FilledButton';
import Layer from '../ui/Layer';
import Modal from '../ui/Modal';
import ModalHeader from '../ui/ModalHeader';
import StyledText from '../ui/StyledText';
import EmojisService from '../../services/api/emojis/emojis.service';
import { useHistory } from 'react-router';
import $UserStore from '../../store/UserStore';

interface ModalProps {
  active: boolean
}

const negativeColorCss = css`
  color: var(--text-negative);
`

const HeadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--background-secondary-alt);
  border-radius: 8px;
  padding: 16px;
`

const PreviewContainer = styled.div`
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
`

const Preview = styled.img`
  max-height: 80%;
  max-width: 80%;
  user-select: none;
  user-drag: none;
`

function EmojiPackModal({ active }: ModalProps) {
  const layerRef = useRef(null);

  const Modals = useStore($ModalStore);
  const EmojiPacks = useStore($EmojiPackCacheStore);
  const User = useStore($UserStore);

  const history = useHistory();

  // const { t } = useTranslation(['settings']);

  useEffect(() => {

    if (Modals.emojiPack[0]) {
      setSelectedPack(Modals.emojiPack[1]);
      if (!EmojiPacks[Modals.emojiPack[1]]) {
        loadPack();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Modals]);

  const [error, setError] = useState(false);
  const [selectedPack, setSelectedPack] = useState('');

  return (
    <Layer className={ classNames({ [LayerBackgroundShadeCss]: true, [InactiveLayerCss]: !active }) } onClick={ (event) => { closeModal(event) } } ref={ layerRef }>
      <Modal className={ css`width: 440px` }>
        { EmojiPacks[selectedPack] ? (
          <Fragment>
            <ModalHeader className={ css`margin: 0 0 20px 0` }><StyledText>{ 'This emote is from...' }</StyledText></ModalHeader>
            <HeadingContainer>
              <PreviewContainer
                className={ css`background: var(--background-secondary-alt)` }
              >
                <Preview src={ EmojiPacks[selectedPack]?.icon || '' } />
              </PreviewContainer>
              <ModalHeader className={ css`margin: 0 0 8px 0` }>{ EmojiPacks[selectedPack].name }</ModalHeader>
            </HeadingContainer>
            { (error && <StyledText className={ negativeColorCss }>{ 'Something went wrong' }</StyledText>) }
            { (EmojiPacks[selectedPack].available || User.emojiPacks.includes(selectedPack)) && <FilledButton onClick={ explore }>{ 'Explore this pack' }</FilledButton> }
            { (!EmojiPacks[selectedPack].available && !User.emojiPacks.includes(selectedPack)) && (
              <ModalHeader className={ css`margin: 16px 0 8px 0` }><StyledText>{ 'This pack is not available to you.' }</StyledText></ModalHeader>
            ) }
          </Fragment>
        ) : (
          <ModalHeader>{ 'Loading' }</ModalHeader>
        ) }
      </Modal>
    </Layer>
  )

  function closeModal(event: any) {
    if (event.target !== layerRef.current) return;
    setModalState({ emojiPack: [false, Modals.emojiPack[1]] });
    setError(false);
  }

  async function loadPack() {
    const response = await EmojisService.getPack(Modals.emojiPack[1]);

    if (response) {
      cacheEmojiPacks([response]);
    }
  }

  function explore() {
    setModalState({ emojiPack: [false, Modals.emojiPack[1]] });
    history.push('/settings/emotes');
  }
}

export default EmojiPackModal;
