import classNames from 'classnames';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { useEffect, useRef, useState } from 'react';
import { RiFileMusicFill, RiPauseFill, RiPlayFill } from 'react-icons/ri';
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
`

const Preview = styled.img`
  width: 96px;
  height: 96px;
  border-radius: 4px;
  margin: 16px;
`

const NoPreviewContainer = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 4px;
  margin: 16px;
  background: var(--background-primary-alt);
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

interface AudioRendererProps {
  file: Attachment
}

function AudioRenderer({ file }: AudioRendererProps) {
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
      { file.data?.preview_url ? (
        <Preview src={ file.data.preview_url } />
      ) : (
        <NoPreviewContainer>
          <RiFileMusicFill className={ classNames(StyledIconCss, AttachmentIconCss) } />
        </NoPreviewContainer>
      ) }
      <div>
        <StyledText
          className={ css`font-weight: 900; font-size: 22px; margin-top: 22px; text-overflow: ellipsis; white-space: nowrap;` }
        >{ file.name }</StyledText>
        <Player>
          <InputButton
            className={ css`height: 34px; width: 34px; padding: 8px; margin-top: 8px;` }
          >
            { !playing ? (
              <RiPlayFill
                className={ classNames({ [StyledIconCss]: true, [SmallInputIconCss]: true }) }
                onClick={ () => { audioRef.current?.play(); setPlaying(true) } }
              />
            ) : (
              <RiPauseFill
                className={ classNames({ [StyledIconCss]: true, [SmallInputIconCss]: true }) }
                onClick={ () => { audioRef.current?.pause(); setPlaying(false) } }
              />
            ) }
          </InputButton>
        </Player>
      </div>
    </Container>
  )
}

export default AudioRenderer;
