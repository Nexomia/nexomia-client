import classNames from 'classnames';
import { useStore } from 'effector-react';
import { css } from 'linaria';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { setModalState } from '../../store/ModalStore';
import $UserStore from '../../store/UserStore';
import InactiveLayerCss from '../css/InactiveLayerCss';
import LayerBackgroundShadeCss from '../css/LayerBackgroundShadeCss';
import Role from '../settings/ui/Role';
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

function StatusChangeModal({ active }: ModalProps) {
  const layerRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { t } = useTranslation(['settings']);

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState(false);
  const [page, setPage] = useState(0);

  const User = useStore($UserStore);

  useEffect(() => {
    if (active) {
      setName(User.status);
      setPage(0);
    }
    
  }, [active]);

  return (
    <Layer className={ classNames({ [LayerBackgroundShadeCss]: true, [InactiveLayerCss]: !active }) } onClick={ (event) => { closeModal(event) } } ref={ layerRef }>
      <Modal className={ css`width: 440px` }>
        <LoadingPlaceholder title={ t('saving_changes') } active={ loading } />
        <ModalHeader>{ 'Change your status!' }</ModalHeader>
        {
          page === 0 && (
            <Fragment>
              <Role
                name={ 'Online' }
                color={ 'var(--accent-green)' }
                defaultRole={ false }
                noArrow={ true }
              />
              <Role
                name={ 'Away' }
                color={ 'var(--accent-yellow)' }
                defaultRole={ false }
                noArrow={ true }
              />
              <Role
                name={ 'Do not disturb' }
                color={ 'var(--text-negative)' }
                defaultRole={ false }
                noArrow={ true }
              />
              <Role
                name={ 'Invisible' }
                color={ 'var(--background-light)' }
                defaultRole={ false }
                noArrow={ true }
              />
              <Role
                name={ 'Set a custom status' }
                color={ 'transparent' }
                defaultRole={ false }
                noArrow={ false }
                onClick={ () => setPage(1) }
              />
            </Fragment>
          )
        }
        {
          page === 1 && (
            <Fragment>
              <InputField
                placeholder={ `I'm changing my status right now!` }
                onChange={ (event) => { setName(event.target.value) } }
                ref={ inputRef }
                value={ name }
              />
              { (error && <StyledText className={ negativeColorCss }>{ 'Something went wrong' }</StyledText>) }
              <FilledButton onClick={ apply }>{ 'Save' }</FilledButton>
            </Fragment>
          )
        }
      </Modal>
    </Layer>
  )

  function closeModal(event: any) {
    if (event.target !== layerRef.current) return;
    setModalState({ statusChange: false });
    setError(false);
  }

  async function apply() {
    setLoading(true);

    /* const response = await EmojisService.editEmoji(name, Modals.emojiEdit[1], Modals.emojiEdit[2]);
    setLoading(false);

    if (!response) {
      return setError(true);
    }

    cacheEmojis([response]);
    setModalState({ emojiEdit: [false, '', '', ''] }); */
  }
}

export default StatusChangeModal;
