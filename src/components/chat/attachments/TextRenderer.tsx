import axios from 'axios';
import classNames from 'classnames';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { useEffect, useState } from 'react';
import { RiFileDownloadFill } from 'react-icons/ri';
import Attachment from '../../../store/models/Attachment';
import StyledIconCss from '../../css/StyledIconCss';
import StyledText from '../../ui/StyledText';
import InputButton from '../InputButton';


const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 700px;
  border-radius: 4px;
  background: var(--background-secondary-alt);
  overflow: hidden;
  margin: 2px 0;
`

const BottomContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const SmallInputIconCss = css`
  width: 18px;
  height: 18px;
`

const ContentContainer = styled.div`
  height: 500px;
  background: var(--background-secondary);
  overflow-y: auto;
  padding: 16px;
  color: var(--text-primary);
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
`

interface TextRendererProps {
  file: Attachment
}

function TextRenderer({ file }: TextRendererProps) {
  const [content, setContent] = useState('');

  useEffect(() => {
    loadContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <ContentContainer>
        { content }
      </ContentContainer>
      <BottomContainer>
        <StyledText
          className={ css`font-weight: 900; font-size: 16px; margin: 0 0 0 16px; text-overflow: ellipsis; white-space: nowrap;` }
        >{ file.name }</StyledText>
        <div className={ css`flex-grow: 1` } />
        <InputButton
          className={ css`height: 34px; width: 34px; padding: 8px; margin-right: 8px` }
          onClick={ downloadFile }
        >
          <RiFileDownloadFill className={ classNames({ [StyledIconCss]: true, [SmallInputIconCss]: true }) } />
        </InputButton>
      </BottomContainer>
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

  async function loadContent() {
    const response = await axios.get(file.url, { transformResponse: [] });

    setContent(response.data.split('\r\n').join('\n'));
  }
}

export default TextRenderer;
