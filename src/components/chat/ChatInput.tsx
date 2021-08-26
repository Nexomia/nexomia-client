import { styled } from 'linaria/react';
import { css } from 'linaria';
import { htmlUnescape } from 'escape-goat';
import classNames from 'classnames';
import { KeyboardEvent, useMemo, useRef, useState } from 'react';
import { createEditor, BaseEditor, Descendant, Node } from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { RiAddCircleFill, RiEmotionLaughFill, RiSendPlane2Fill } from 'react-icons/ri';

import { addMessage } from '../../store/MessageStore';
import { cacheMessages } from '../../store/MessageCacheStore';

import StyledIconCss from '../css/StyledIconCss';

import MessagesService from '../../services/api/messages/messages.service';
import InputButton from './InputButton';
import { useTranslation } from 'react-i18next';
import ChannelsService from '../../services/api/channels/channels.service';
import renderMessageContent from '../../utils/renderMessageContent';

type CustomElement = { type: 'paragraph'; children: CustomText[] };
type CustomText = { text: string };

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor,
    Element: CustomElement,
    Text: CustomText,
  }
};

const Container = styled.div`
  display: flex;
  margin: 16px;
  border-radius: 8px;
  background: var(--background-primary-alt);
  min-height: 48px;
  max-height: calc(100vh - 400px);
  transition: .2s;
  flex-direction: row;
  flex-grow: 0;
  z-index: 2;
  overflow: hidden;
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

const EditableCss = css`
  width: 100%;
  min-height: 48px;
  max-height: calc(100vh - 400px);
  overflow: hidden auto;
  padding: 14px 0;
  outline: none;
  white-space: pre-wrap;
  word-break: break-all;
`

const Placeholder = styled.div`
  color: var(--text-secondary);
  position: absolute;
  padding: 14px 0;
  pointer-events: none;
`

interface ChatInputProps {
  channel: string,
  onMessageSent: any
}

function ChatInput({ channel, onMessageSent }: ChatInputProps) {
  const inputRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation(['chat']);

  const [sendLoading, setSendLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [sendLocked, setSendLocked] = useState(false);

  const editor = useMemo(() => withReact(createEditor()), []);
  const initialValue: CustomElement[] = [
    {
      type: 'paragraph',
      children: [{ text: '' }]
    }
  ];
  const [value, setValue] = useState<Descendant[]>(initialValue);

  return (
    <Container ref={ containerRef }>
      <InputButton>
        <RiAddCircleFill className={ classNames({ [StyledIconCss]: true, [InputIconCss]: true }) } />
      </InputButton>
      <Input ref={ inputRef }>
        <Slate
          editor={ editor }
          value={ value }
          onChange={ setValue }
        >
          <Editable
            className={ EditableCss }
            placeholder={ t('input_placeholder') }
            onKeyDown={ handleKeyPress }
            onKeyUp={ unlockInput }
          />
        </Slate>
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

    const output = value.map((child) => Node.string(child)).join('\n');

    const content = htmlUnescape(output);
    editor.insertBreak();
    setValue(initialValue);
    const response = await MessagesService.sendMessage(channel, content || '');

    if (!response) return setSendLoading(false);

    cacheMessages([response]);
    addMessage({ channel: response.channel_id, message: response.id });

    setSendLoading(false);

    onMessageSent();
  }

  function handleKeyPress(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' && !sendLocked) {
      event.preventDefault();
      sendMessage();
    }
    if (event.key === 'Shift') setSendLocked(true);

    if (typing) return;

    setTyping(true);
    setTimeout(() => setTyping(false), 2000);

    ChannelsService.sendTyping(channel);
  }

  function unlockInput(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Shift') setSendLocked(false);
  }
}

export default ChatInput;
