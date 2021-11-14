import classNames from 'classnames';
import { useStore } from 'effector-react';
import { styled } from 'linaria/react';
import { useRef } from 'react';
import $ModalStore, { setModalState } from '../../store/ModalStore';
import InactiveLayerCss from '../css/InactiveLayerCss';
import LayerBackgroundShadeCss from '../css/LayerBackgroundShadeCss';
import Layer from '../ui/Layer';

const Image = styled.img`
  border-radius: 4px;
  max-width: 80%;
  max-height: 80%;
  box-shadow: 0px 14px 30px 0px rgb(0, 0, 0, 20%);
  transform: scale(1);
  transition: .3s cubic-bezier(.22,.54,.41,1.46);
  user-select: none;
  background: var(--background-primary);
`

interface ModalProps {
  active: boolean
}

function ImagePreviewModal({ active }: ModalProps) {
  const layerRef = useRef(null);

  const Modals = useStore($ModalStore);

  return (
    <Layer className={ classNames({ [LayerBackgroundShadeCss]: true, [InactiveLayerCss]: !active }) } onClick={ (event) => { closeModal(event) } } ref={ layerRef }>
      <Image src={ Modals.imagePreview[1] } />
    </Layer>
  )

  function closeModal(event: any) {
    if (event.target !== layerRef.current) return;
    setModalState({ imagePreview: [false, Modals.imagePreview[1]] });
  }
}

export default ImagePreviewModal;
