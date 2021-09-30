import { styled } from 'linaria/react';
import Attachment from '../../../store/models/Attachment';


const Container = styled.img`
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
    <div>
      <Container src={ file.url } />
    </div>
  )
}

export default ImageRenderer;
