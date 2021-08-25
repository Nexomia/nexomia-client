import { styled } from 'linaria/react';
import { css } from 'linaria';
import classNames from 'classnames';
import { KeyboardEvent, useRef, useState } from 'react';
import { RiAddCircleFill, RiEmotionLaughFill, RiSendPlane2Fill } from 'react-icons/ri';

import { addMessage } from '../../store/MessageStore';
import { cacheMessages } from '../../store/MessageCacheStore';

import StyledIconCss from '../css/StyledIconCss';

import MessagesService from '../../services/api/messages/messages.service';
import InputButton from './InputButton';
import { useTranslation } from 'react-i18next';
import ChannelsService from '../../services/api/channels/channels.service';

const Container = styled.div`
  display: flex;
  margin: 16px;
  border-radius: 8px;
  background: var(--background-primary-alt);
  min-height: 48px;
  max-height: 128px;
  flex-direction: row;
  z-index: 2;
`

const InputIconCss = css`
  width: 24px;
  height: 24px;
`

const Input = styled.div`
  flex-grow: 1;
  outline: none;
  background: transparent;
  border: 0px;
  font-weight: 400;
  font-size: 16px;
  font-family: Inter;
  resize: none;
  color: var(--text-primary);
`

const ContentEditable = styled.div`
  width: 100%;
  min-height: 48px;
  padding: 14px 0;
  outline: none;
  white-space: pre-wrap;
`

const Placeholder = styled.div`
  color: var(--text-secondary);
  position: absolute;
  padding: 14px 0;
`

interface ChatInputProps {
  channel: string,
  onMessageSent: any
}

function ChatInput({ channel, onMessageSent }: ChatInputProps) {
  const inputRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation(['chat']);

  const [sendLoading, setSendLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [placeholder, setPlaceholder] = useState(true);
  const [sendLocked, setSendLocked] = useState(false);

  return (
    <Container>
      <InputButton>
        <RiAddCircleFill className={ classNames({ [StyledIconCss]: true, [InputIconCss]: true }) } />
      </InputButton>
      <Input>
        { placeholder && <Placeholder>{ t('input_placeholder') }</Placeholder> }
        <ContentEditable
          contentEditable
          ref={ inputRef }
          onKeyDown={ handleKeyPress }
          onKeyUp={ unlockInput }
          onInput={ () => setPlaceholder(!inputRef?.current?.innerHTML) }
        />
      </Input>
      <InputButton className={ css`margin-right: 0` }>
        <RiEmotionLaughFill className={ classNames({ [StyledIconCss]: true, [InputIconCss]: true }) } />
      </InputButton>
      <InputButton onClick={ sendMessage } className={ classNames({ active: sendLoading }) } >
        <RiSendPlane2Fill className={ classNames({ [StyledIconCss]: true, [InputIconCss]: true }) } />
      </InputButton>
    </Container>
  );

  async function sendMessage() {
    if (sendLoading) return;

    setSendLoading(true);
    const content = inputRef.current?.innerHTML;
    setImmediate(() => {
      if (inputRef.current) inputRef.current.innerHTML = '';
      setPlaceholder(true);
    });
    const response = await MessagesService.sendMessage(channel, content || '');

    if (!response) return setSendLoading(false);

    cacheMessages([response]);
    addMessage({ channel: response.channel_id, message: response.id });

    setSendLoading(false);

    onMessageSent();
  }

  function handleKeyPress(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' && !sendLocked) sendMessage();
    if (event.key === 'Shift') setSendLocked(true);

    /* if (typing) return;

    setTyping(true);
    setTimeout(() => setTyping(false), 3000);

    ChannelsService.sendTyping(channel); */
  }

  function unlockInput(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Shift') setSendLocked(false);
  }
}

export default ChatInput;
