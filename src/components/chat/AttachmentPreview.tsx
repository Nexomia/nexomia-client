import classNames from 'classnames';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { RiFileChart2Fill, RiFileCodeFill, RiFileMusicFill, RiFileUnknowFill, RiMovieFill } from 'react-icons/ri';
import { FileContent } from 'use-file-picker/dist/interfaces';
import StyledIconCss from '../css/StyledIconCss';
import StyledText from '../ui/StyledText';

const Container = styled.div`
  height: 128px;
  max-width: 180px;
  min-width: 128px;
  flex-grow: 1;
  background: var(--background-secondary-alt);
  border-radius: 8px;
  overflow: hidden;
  margin: 8px;
  display: flex;
  flex-direction: column;
  animation: attachment-appear .4s;

  @keyframes attachment-appear {
    from {
      transform: scale(1.2);
      opacity: 0;
    }

    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`

const UploadingOverlay = styled.div`
  width: 100%;
  height: 100%;
  backdrop-filter: blur(15px);
  transition: .2s;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const ProgressBarContainer = styled.div`
  width: calc(100% - 32px);
  margin: 12px 16px;
  height: 12px;
  background: rgba(255, 255, 255, .4);
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, .2);
  overflow: hidden;
  border-radius: 6px;
  transition: .4s;
`

const Progress = styled.div`
  height: 12px;
  background: #fff;
  transition: .4s;
`

const AttachmentIconCss = css`
  width: 36px;
  height: 36px;
  margin-top: 24px;
`

interface AttachmentPreviewProps {
  file: FileContent,
  plainFile: File,
  ready: boolean,
  progress: number
}

function AttachmentPreview({ file, plainFile, ready, progress }: AttachmentPreviewProps) {
  return (
    <Container
      style={ plainFile.type.startsWith('image') ? {
        background: `url(${file.content})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : {} }
    >
      <UploadingOverlay style={ ready ? { backdropFilter: 'blur(0px)' } : {}}>
        {
          plainFile.type.startsWith('audio') ? (
            <RiFileMusicFill className={ classNames(StyledIconCss, AttachmentIconCss) } />
          ) : plainFile.type.startsWith('video') ? (
            <RiMovieFill className={ classNames(StyledIconCss, AttachmentIconCss) } />
          ) : plainFile.type.startsWith('text') || plainFile.type.startsWith('font') ? (
            <RiFileCodeFill className={ classNames(StyledIconCss, AttachmentIconCss) } />
          ) : plainFile.type.startsWith('model') ? (
            <RiFileChart2Fill className={ classNames(StyledIconCss, AttachmentIconCss) } />
          ) : !plainFile.type.startsWith('image') && (
            <RiFileUnknowFill className={ classNames(StyledIconCss, AttachmentIconCss) } />
          )
        }
        { !plainFile.type.startsWith('image') && (
          <StyledText
            className={ css`margin: 0; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; width: calc(100% - 32px); text-align: center;` }
          >{ plainFile.name }</StyledText>
        ) }
        <ProgressBarContainer style={{ height: ready ? '0' : '12px' }}>
          <Progress style={{ width: `${progress}%` }} />
        </ProgressBarContainer>
      </UploadingOverlay>
    </Container>
  )
}

export default AttachmentPreview;
