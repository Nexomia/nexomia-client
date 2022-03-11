import { styled } from 'linaria/react';
import Attachment from '../../../store/models/Attachment';

const Container = styled.div`
  display: inline-block;
  border-radius: 4px;
  background: var(--background-secondary-alt);
  overflow: hidden;
  cursor: pointer;
`

interface VideoRendererProps {
  file: Attachment,
}

function VideoRenderer({ file }: VideoRendererProps) {

  return (
    <Container style={ calculateSizes() }>
      <video controls={ true } poster={ file.data.preview_url } style={calculateSizes()}>
        <source src={ file.url } type={ file.mime_type } />
      </video>
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
}

export default VideoRenderer;
