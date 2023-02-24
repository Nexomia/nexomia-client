import classNames from 'classnames';
import { useStore } from 'effector-react';
import { css } from 'linaria';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import EmojisService from '../../services/api/emojis/emojis.service';
import { cacheEmojis } from '../../store/EmojiStore';
import $ModalStore, { setModalState } from '../../store/ModalStore';
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

const negativeColorCss = css`
  color: var(--text-negative);
`

function EmojiEditModal({ active }: ModalProps) {
  const layerRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const Modals = useStore($ModalStore);

  const { t } = useTranslation(['settings']);

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    setName(Modals.emojiEdit[3]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <Layer className={ classNames({ [LayerBackgroundShadeCss]: true, [InactiveLayerCss]: !active }) } onClick={ (event) => { closeModal(event) } } ref={ layerRef }>
      <Modal className={ css`width: 440px` }>
        <LoadingPlaceholder title={ t('saving_changes')! } active={ loading } />
        <ModalHeader>{ 'Enter a new emote name' }</ModalHeader>
        <InputField
          placeholder={ t('modals.name')! }
          onChange={ (event) => { setName(event.target.value) } }
          ref={ inputRef }
          value={ name }
        />
        { (error && <StyledText className={ negativeColorCss }>{ 'Something went wrong' }</StyledText>) }
        <FilledButton onClick={ apply }>{ 'Save' }</FilledButton>
      </Modal>
    </Layer>
  )

  function closeModal(event: any) {
    if (event.target !== layerRef.current) return;
    setModalState({ emojiEdit: [false, '', '', ''] });
    setError(false);
  }

  async function apply() {
    setLoading(true);

    const response = await EmojisService.editEmoji(name, Modals.emojiEdit[1], Modals.emojiEdit[2]);
    setLoading(false);

    if (!response) {
      return setError(true);
    }

    cacheEmojis([response]);
    setModalState({ emojiEdit: [false, '', '', ''] });
  }
}

export default EmojiEditModal;
