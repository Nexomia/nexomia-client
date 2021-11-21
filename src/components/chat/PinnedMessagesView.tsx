import { css } from 'linaria';
import { styled } from 'linaria/react';
import { useTranslation } from 'react-i18next';
import PopoutHeader from '../ui/PopoutHeader';
import MessageView from './MessageView';

const Container = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 56px;
  right: 248px;
  width: 420px;
  min-height: 400px;
  max-height: calc(100vh - 160px);
  background: var(--background-primary-alt);
  box-shadow: 0px 14px 30px 0px rgb(0, 0, 0, 20%);
  border-radius: 8px;
  z-index: 5;
`

const Scrollable = styled.div`
  flex-grow: 1;
  overflow: hidden auto;
`

interface PinnedMessagesViewProps {
  channel: string
}

function PinnedMessagesView({ channel }: PinnedMessagesViewProps) {
  const { t } = useTranslation(['settings']);

  return (
    <Container>
      <PopoutHeader className={ css`padding: 16px` }>{ t('tabs.pinned_messages') }</PopoutHeader>
      <Scrollable>
        <MessageView channel={ channel } type={ 1 } />
      </Scrollable>
    </Container>
  )
}

export default PinnedMessagesView;
