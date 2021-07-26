import { styled } from 'linaria/react';
import { css } from 'linaria';
import classNames from 'classnames';
import { useRef, useState } from 'react';
import { RiAddCircleFill, RiEmotionLaughFill, RiSendPlane2Fill } from 'react-icons/ri';

import { addMessage } from '../../store/MessageStore';
import { cacheMessages } from '../../store/MessageCacheStore';

import StyledIconCss from '../css/StyledIconCss';
import Dots from '../animations/Dots';

import MessagesService from '../../services/api/messages/messages.service';

const Container = styled.div`
  display: flex;
  margin: 16px;
  border-radius: 8px;
  background: var(--background-primary-alt);
  height: 48px;
  flex-direction: row;
`

const InputButton = styled.div`
  display: flex;
  flex-direction: row;
  width: 40px;
  height: 40px;
  padding: 8px;
  margin: 4px;
  border-radius: 6px;
  cursor: pointer;
  transition: .2s;

  &:hover {
    background: var(--background-light);
  }
  &:active, &.active {
    transform: scale(0.93);
  }
  &.active {
    opacity: .5;
  }
`

const InputIconCss = css`
  width: 24px;
  height: 24px;
`

const Input = styled.input`
  display: flex;
  flex-grow: 1;
  outline: none;
  background: transparent;
  border: 0px;
  font-weight: 900;
  font-size: 14px;
  color: var(--text-primary);
  &::placeholder {
    color: var(--text-secondary);
    user-select: none;
  }
`

interface ChatInputProps {
  channel: string
}

function ChatInput({ channel }: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [sendLoading, setSendLoading] = useState(false);

  return (
    <Container>
      <InputButton>
        <RiAddCircleFill className={ classNames({ [StyledIconCss]: true, [InputIconCss]: true }) } />
      </InputButton>
      <Input placeholder="Type something here..." ref={ inputRef } />
      <InputButton>
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
    const content = inputRef.current?.value;
    if (inputRef.current) inputRef.current.value = '';
    const response = await MessagesService.sendMessage(channel, content || '');

    if (!response) return setSendLoading(false);

    cacheMessages([response]);
    addMessage(response.id);

    setSendLoading(false);
  }
}

export default ChatInput;
