import { styled } from 'linaria/react';
import { Fragment, useEffect, useRef } from 'react';

import ChatInput from './ChatInput';
import MessageView from './MessageView';

const MessageContainerWrapper = styled.div`
  flex-grow: 1;
`

const MessageContainer = styled.div`
  position: relative;
  width: 100%;
  height: calc(100% + 26px);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`

const ScrollableContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: hidden auto;
  box-sizing: border-box;
`

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 100%;
  padding-bottom: 32px;
  justify-content: flex-end;
`

interface ChatViewProps {
  channel: string
}

function ChatView({ channel }: ChatViewProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => scrollView(), [channel]);

  return (
    <Fragment>
      <MessageContainerWrapper>
        <MessageContainer>
          <ScrollableContent ref={ scrollerRef }>
            <MessageWrapper>
              <MessageView channel={ channel } onMessagesLoaded={ scrollView } />
            </MessageWrapper>
          </ScrollableContent>
        </MessageContainer>
      </MessageContainerWrapper>
      <ChatInput channel={ channel } onMessageSent={ scrollView } />
    </Fragment>
  )

  function scrollView() {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: 'auto' });
  }
}

export default ChatView;
