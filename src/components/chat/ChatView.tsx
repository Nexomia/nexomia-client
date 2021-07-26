import { styled } from 'linaria/react';
import { Fragment } from 'react';

import ChatInput from './ChatInput';
import MessageView from './MessageView';

const MessageContainerWrapper = styled.div`
  flex-grow: 1;
`

const MessageContainer = styled.div`
  width: 100%;
  height: calc(100% + 26px);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`

interface ChatViewProps {
  channel: string
}

function ChatView({ channel }: ChatViewProps) {
  return (
    <Fragment>
      <MessageContainerWrapper>
        <MessageContainer>
          <MessageView channel={ channel } />
        </MessageContainer>
      </MessageContainerWrapper>
      <ChatInput channel={ channel } />
    </Fragment>
  )
}

export default ChatView;
