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

function WarningModal({ active }: ModalProps) {
  const layerRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { t } = useTranslation(['settings']);

  const User = useStore($UserStore);

  return (
    <Layer className={ classNames({ [LayerBackgroundShadeCss]: true, [InactiveLayerCss]: !active }) } onClick={ (event) => { closeModal(event) } } ref={ layerRef }>
      <Modal className={ css`width: 440px` }>
        <ModalHeader>{ 'Warning!' }</ModalHeader>
        <StyledText className={ css`text-align: center` }>This app is unfinished.<br />Everything is shown in informational purpose.</StyledText>
        <FilledButton onClick={ () => setModalState({ warning: false }) }>{ 'Понятно' }</FilledButton>
      </Modal>
    </Layer>
  )

  function closeModal(event: any) {
    if (event.target !== layerRef.current) return;
    setModalState({ warning: false });
  }
}

export default WarningModal;
