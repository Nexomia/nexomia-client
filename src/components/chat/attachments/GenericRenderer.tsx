import classNames from 'classnames';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { useEffect, useRef, useState } from 'react';
import { RiFileDownloadFill, RiFileUnknowFill } from 'react-icons/ri';
import Attachment from '../../../store/models/Attachment';
import StyledIconCss from '../../css/StyledIconCss';
import StyledText from '../../ui/StyledText';
import InputButton from '../InputButton';


const Container = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 400px;
  border-radius: 4px;
  background: var(--background-secondary-alt);
  overflow: hidden;
  margin: 2px 0;
  align-items: center;
`

const NoPreviewContainer = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 4px;
  margin: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const AttachmentIconCss = css`
  width: 36px;
  height: 36px;
`

const SmallInputIconCss = css`
  width: 18px;
  height: 18px;
`

const Player = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 16px;
`

interface GenericRendererProps {
  file: Attachment
}

function GenericRenderer({ file }: GenericRendererProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onloadedmetadata = () => {

      }
    }
  });

  return (
    <Container>
      <audio src={ file.url } preload="metadata" ref={ audioRef } />
      <NoPreviewContainer>
        <RiFileUnknowFill className={ classNames(StyledIconCss, AttachmentIconCss) } />
      </NoPreviewContainer>
      <StyledText
        className={ css`font-weight: 900; font-size: 22px; margin: 0; text-overflow: ellipsis; white-space: nowrap;` }
      >{ file.name }</StyledText>
      <div className={ css`flex-grow: 1` } />
      <InputButton
        className={ css`height: 34px; width: 34px; padding: 8px; margin-top: 8px; margin-right: 16px` }
        onClick={ downloadFile }
      >
        <RiFileDownloadFill className={ classNames({ [StyledIconCss]: true, [SmallInputIconCss]: true }) } />
      </InputButton>
    </Container>
  )

  function downloadFile() {
    // cringe
    const anchor = document.createElement('a');
    anchor.href = file.url;
    anchor.download = file.name;
    anchor.target = '_blank';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }
}

export default GenericRenderer;
