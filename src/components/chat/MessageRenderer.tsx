import { useStore } from 'effector-react';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import $MessageCacheStore from '../../store/MessageCacheStore';
import $UserCacheStore from '../../store/UserCacheStore';
import StyledText from '../ui/StyledText';

const Container = styled.div`
  margin: 4px 0;
  padding: 4px 0;
  display: flex;
  flex-direction: row;

  &:hover {
    background: var(--background-secondary-alt);
  }
`

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0 16px;
  user-select: none;
`

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`

interface MessageProps {
  id: string
}

function MessageRenderer({ id }: MessageProps) {
  const UserCache = useStore($UserCacheStore);
  const MessageCache = useStore($MessageCacheStore);

  return (
    <Container>
      <Avatar src={ UserCache[MessageCache[id].author].avatar }></Avatar>
      <ContentContainer>
        <StyledText className={ css`margin: 0;` }>{ UserCache[MessageCache[id].author].username }</StyledText>
        <StyledText className={ css`margin: 0; font-weight: 400; user-select: text` }>{ MessageCache[id].content }</StyledText>
      </ContentContainer>
    </Container>
  )
}

export default MessageRenderer;
