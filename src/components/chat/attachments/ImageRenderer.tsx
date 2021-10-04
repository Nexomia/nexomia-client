import { styled } from 'linaria/react';
import { useEffect, useRef } from 'react';
import ReactFreezeframe from 'react-freezeframe';
import { Freeze } from 'freezeframe/types'
import Attachment from '../../../store/models/Attachment';

const Container = styled.div`
  display: inline-block;
  max-width: 400px;
  max-height: 400px;
  border-radius: 4px;
  background: var(--background-secondary-alt);
  overflow: hidden;
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
    <Container style={ calculateSizes() }>
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
      const width = file.data.width > 400
      ? 400
      : file.data.height > 400
      ? file.data.width * (400 / file.data.height)
      : file.data.width

      const height = file.data.height > 400
      ? 400
      : file.data.width > 400
      ? file.data.height * (400 / file.data.width)
      : file.data.height

      return { width, height };
    } else return {};
  }
}

export default ImageRenderer;
