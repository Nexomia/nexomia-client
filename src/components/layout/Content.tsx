import { styled } from 'linaria/react';
import { useParams } from 'react-router-dom';

import ContentHeader from './ContentHeader';
import ChatView from '../chat/ChatView';

const Container = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  alignSelf: stretch;
  background: var(--background-secondary-alt);
`

const ContentBody = styled.div`
  display: flex;
  align-self: stretch;
  flex-grow: 1;
  flex-direction: column;
  justify-content: stretch;
  border-radius: 8px 8px 0 0;
  background: var(--background-primary);
`

interface RouteParams {
  guildId: string,
  channelId: string
}

function Content() {
  const { guildId, channelId } = useParams<RouteParams>();

  return (
    <Container>
      <ContentHeader />
      <ContentBody>
        { guildId !== '@me' && guildId !== '@home' && channelId && (
          <ChatView channel={ channelId } />
        ) }
      </ContentBody>
    </Container>
  );
}

export default Content;