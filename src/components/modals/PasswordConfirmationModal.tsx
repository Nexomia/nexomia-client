import classNames from 'classnames';
import { useStore } from 'effector-react';
import data from 'emojibase-data/en/data.json';
import { css } from 'linaria';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import EmojisService from '../../services/api/emojis/emojis.service';
import $ContextMenuStore from '../../store/ContextMenuStore';
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

function PasswordConfirmationModal({ active }: ModalProps) {
  const layerRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const Modals = useStore($ModalStore);
  const { data } = useStore($ContextMenuStore);

  const { t } = useTranslation(['settings']);

  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (data?.ok) closeModal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.ok]);

  return (
    <Layer className={ classNames({ [LayerBackgroundShadeCss]: true, [InactiveLayerCss]: !active }) } onClick={ (event) => { closeModal(event) } } ref={ layerRef }>
      <Modal className={ css`width: 440px` }>
        <LoadingPlaceholder title={ t('saving_changes') } active={ loading } />
        <StyledText className={ css`text-align: left; margin: 4px; margin-top: 4px; font-size: 14px; font-weight: 900` }>
          { t('modal.enter_password') }
        </StyledText>
        <InputField
          value={data?.ok ? '' : password}
          placeholder={ t('modals.password') }
          onChange={ (event) => { setPassword(event.target.value) } }
          ref={ inputRef }
          type='password'
        />
        { (data?.error && <StyledText className={ negativeColorCss }>{ 'Something went wrong' }</StyledText>) }
        <FilledButton onClick={ () => { data?.hook(password) } }>{ 'Save' }</FilledButton>
      </Modal>
    </Layer>
  )

  function closeModal(event?: any) {
    if (data?.ok) {
      setPassword('');
      data.ok = false
      return setModalState({ passwordConfirmation: false });
    }
    if (event && event.target !== layerRef.current) return;
    data?.hook('')
    setPassword('')
    setModalState({ passwordConfirmation: false });

  }

}

export default PasswordConfirmationModal;
