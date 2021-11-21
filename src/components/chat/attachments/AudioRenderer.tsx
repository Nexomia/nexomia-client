import classNames from 'classnames';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { useRef, useState } from 'react';
import { RiFileDownloadFill, RiFileMusicFill, RiPauseFill, RiPlayFill } from 'react-icons/ri';
import { setModalState } from '../../../store/ModalStore';
import Attachment from '../../../store/models/Attachment';
import StyledIconCss from '../../css/StyledIconCss';
import StyledText from '../../ui/StyledText';
import InputButton from '../InputButton';


const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 400px;
  border-radius: 4px;
  background: var(--background-secondary-alt);
  margin: 2px 0;
`

const Preview = styled.img`
  width: 96px;
  height: 96px;
  border-radius: 4px;
  margin: 16px;
  cursor: pointer;
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

  return (
    <Container>
      <audio src={ file.url } preload="metadata" ref={ audioRef } />
      { file.data?.preview_url ? (
        <Preview src={ file.data.preview_url } onClick={ openModal } />
      ) : (
        <NoPreviewContainer>
          <RiFileMusicFill className={ classNames(StyledIconCss, AttachmentIconCss) } />
        </NoPreviewContainer>
      ) }
      <div>
        <StyledText
          className={ css`font-weight: 900; font-size: 22px; margin-top: 22px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; width: 250px` }
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
          <InputButton
            className={ css`height: 34px; width: 34px; padding: 8px; margin-top: 8px;` }
            onClick={ downloadAudio }
          >
            <RiFileDownloadFill className={ classNames({ [StyledIconCss]: true, [SmallInputIconCss]: true }) } />
          </InputButton>
        </Player>
      </div>
    </Container>
  )

  function downloadAudio() {
    // cringe
    const anchor = document.createElement('a');
    anchor.href = file.url;
    anchor.download = file.name;
    anchor.target = '_blank';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  function openModal() {
    setModalState({ imagePreview: [true, file.data.preview_url] });
  }
}

export default AudioRenderer;
