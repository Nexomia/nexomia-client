import { styled } from 'linaria/react';
import ReactFreezeframe from 'react-freezeframe';
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
  file: Attachment
}

function ImageRenderer({ file }: ImageRendererProps) {
  return (
    <Container style={ calculateSizes() }>
      <ReactFreezeframe src={ file.url } />
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
