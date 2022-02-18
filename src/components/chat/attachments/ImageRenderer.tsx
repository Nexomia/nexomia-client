import { styled } from 'linaria/react';
import { useEffect, useRef } from 'react';
import ReactFreezeframe from 'react-freezeframe';
import Attachment from '../../../store/models/Attachment';
import { setModalState } from '../../../store/ModalStore';

const Container = styled.div`
  display: inline-block;
  border-radius: 4px;
  background: var(--background-secondary-alt);
  overflow: hidden;
  cursor: pointer;
`

interface ImageRendererProps {
  file: Attachment,
  hovered: boolean
}

function ImageRenderer({ file, hovered }: ImageRendererProps) {
  const freezeRef = useRef<any>(null);

  useEffect(() => {
    if (hovered) {
      freezeRef.current.start();
    } else {
      freezeRef.current.stop();
    }
  }, [hovered]);

  return (
    <Container style={ calculateSizes() } onClick={ openModal }>
      <ReactFreezeframe
        ref={ freezeRef }
        src={ file.url }
        options={{
          trigger: false,
          overlay: false
        }}
      />
    </Container>
  )

  function calculateSizes() {
    if (file?.data?.width && file?.data?.height) {
      const height = file.data.width > 400
      ? file.data.height / file.data.width * 400
      : file.data.height

      const width = file.data.width > 400
      ? 400
      : file.data.width

      return { width, height };
    } else return {};
  }

  function openModal() {
    setModalState({ imagePreview: [true, file.url] });
  }
}

export default ImageRenderer;
