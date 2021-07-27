import classNames from 'classnames';
import { useStore } from 'effector-react';
import { format } from 'fecha';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import $MessageCacheStore from '../../store/MessageCacheStore';
import $UserCacheStore from '../../store/UserCacheStore';
import StyledText from '../ui/StyledText';

const Container = styled.div`
  margin-top: 8px;
  margin-bottom: -2px;
  padding: 4px 0;
  display: flex;
  flex-direction: row;

  &:hover {
    background: var(--background-secondary-alt);
  }
`

const GroupedContainerCss = css`
  margin: 0;
`

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0 16px;
  user-select: none;
`

const Spacer = styled.div`
  width: 72px;
`

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`

interface MessageProps {
  id: string,
  grouped: boolean
}

function MessageRenderer({ id, grouped }: MessageProps) {
  const UserCache = useStore($UserCacheStore);
  const MessageCache = useStore($MessageCacheStore);

  return (
    <Container className={ classNames({ [GroupedContainerCss]: grouped }) }>
      { !grouped ? (
        <Avatar src={ UserCache[MessageCache[id].author].avatar }></Avatar>
      ) : (
        <Spacer />
      ) }
      <ContentContainer>
        { !grouped && (
          <StyledText className={ css`margin: 0;` }>
            { UserCache[MessageCache[id].author].username }
            <StyledText className={ css`margin: 0 0 0 8px; color: var(--text-secondary); display: inline-block; font-size: 12px;` }>
              { format(new Date(MessageCache[id].created), 'HH:mm') }
            </StyledText>
          </StyledText>
        ) }
        <StyledText className={ css`margin: 0; font-weight: 400; user-select: text` }>{ MessageCache[id].content }</StyledText>
      </ContentContainer>
    </Container>
  )
}

export default MessageRenderer;
