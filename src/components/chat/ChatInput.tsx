import { styled } from 'linaria/react';
import { css } from 'linaria';
import { htmlUnescape } from 'escape-goat';
import classNames from 'classnames';
import { KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import { createEditor, BaseEditor, Descendant, Node, Text } from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { RiAddCircleFill, RiCloseLine, RiEmotionLaughFill, RiSendPlane2Fill, RiStickyNoteFill } from 'react-icons/ri';

import { addMessage, leanArray } from '../../store/MessageStore';
import { cacheMessages } from '../../store/MessageCacheStore';

import StyledIconCss from '../css/StyledIconCss';

import MessagesService from '../../services/api/messages/messages.service';
import InputButton from './InputButton';
import { useTranslation } from 'react-i18next';
import ChannelsService from '../../services/api/channels/channels.service';
import getMessageMarkdownBounds from '../../utils/getMessageMarkdownBounds';
import MarkdownLeaf from './markdown/MarkdownLeaf';
import { useStore } from 'effector-react';
import $InputStore, { updateInputInfo } from '../../store/InputStore';
import MessageRenderer from './MessageRenderer';
import StyledText from '../ui/StyledText';
import { useFilePicker } from 'use-file-picker';
import AttachmentPreview from './AttachmentPreview';
import { FileContent } from 'use-file-picker/dist/interfaces';
import FilesService from '../../services/api/files/files.service';
import ContentPicker from './ContentPicker';
import EmojiPackType from '../../store/models/EmojiPackType';

type CustomElement = { type: 'paragraph'; children: CustomText[] };
type CustomText = { text: string };

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor,
    Element: CustomElement,
    Text: CustomText,
  }
};

const OuterContainer = styled.div`
  display: flex;
  margin: 16px;
  flex-direction: column;
  z-index: 2;
`

const Container = styled.div`
  display: flex;
  border-radius: 8px;
  background: var(--background-primary-alt);
  min-height: 48px;
  max-height: calc(100vh - 400px);
  transition: .2s;
  flex-direction: row;
  flex-grow: 0;
  overflow: hidden;
`

const InputIconCss = css`
  width: 24px;
  height: 24px;
`

const SmallInputIconCss = css`
  width: 18px;
  height: 18px;
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

const ForwardsContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const AttachmentsContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: -8px;
  margin-top: 8px;
  flex-wrap: wrap;
`

const ForwardDivider = styled.div`
  width: 4px;
  border-radius: 2px;
  margin: 16px 12px 0 12px;
  background: var(--accent);
`

const ForwardedMessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`

interface ChatInputProps {
  channel: string,
  onMessageSent: any,
  onAttachmentAdded: any
}

interface InputAttachment {
  content: FileContent,
  plain: File,
  progress: number,
  ready: boolean,
  id: string
}

function ChatInput({ channel, onMessageSent, onAttachmentAdded }: ChatInputProps) {
  const inputRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const InputCache = useStore($InputStore);

  const { t } = useTranslation(['chat']);

  const [sendLoading, setSendLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [sendLocked, setSendLocked] = useState(false);
  const [attachments, setAttachments]: any[] = useState([]);
  const [pickerOpened, setPickerOpened]: any = useState(null);

  const editor = useMemo(() => withReact(createEditor()), []);
  const initialValue: CustomElement[] = [
    {
      type: 'paragraph',
      children: [{ text: '' }]
    }
  ];
  const [value, setValue] = useState<Descendant[]>(initialValue);

  const [openFilePicker, { filesContent, plainFiles, loading }] = useFilePicker({
    readAs: 'DataURL'
  });

  useEffect(() => {
    if (loading) return;

    let modifiedAttachments = [ ...attachments ];
    for (const i in filesContent) {
      const newFile = {
        content: filesContent[i],
        plain: plainFiles[i],
        progress: 0,
        ready: false,
        id: ''
      };

      modifiedAttachments = [
        ...modifiedAttachments,
        newFile
      ];

      uploadAttachment(newFile, modifiedAttachments);
    }

    setAttachments(modifiedAttachments);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => onAttachmentAdded(), [attachments, InputCache[channel]]);

  return (
    <OuterContainer>
      <Container ref={ containerRef }>
        <InputButton onClick={ openFilePicker }>
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
              decorate={ decorate }
              renderLeaf={ (props) => (<MarkdownLeaf { ...props } />) }
              onKeyDown={ handleKeyPress }
              onKeyUp={ unlockInput }
            />
          </Slate>
        </Input>
        <InputButton
          onClick={ () => togglePickerType(EmojiPackType.STICKER) }
          className={ classNames(css`margin-right: 0`, { hover: pickerOpened === EmojiPackType.STICKER }) }
        >
          <RiStickyNoteFill className={ classNames({ [StyledIconCss]: true, [InputIconCss]: true }) } />
        </InputButton>
        <InputButton
          onClick={ () => togglePickerType(EmojiPackType.EMOJI) }
          className={ classNames(css`margin-right: 0`, { hover: pickerOpened === EmojiPackType.EMOJI }) }
        >
          <RiEmotionLaughFill className={ classNames({ [StyledIconCss]: true, [InputIconCss]: true }) } />
        </InputButton>
        <InputButton onClick={ sendMessage } className={ classNames({ active: sendLoading }) } >
          <RiSendPlane2Fill className={ classNames({ [StyledIconCss]: true, [InputIconCss]: true }) } />
        </InputButton>
      </Container>
      { !!(InputCache[channel] && InputCache[channel]?.forwards?.length) && (
        <ForwardsContainer>
          <ForwardDivider />
          <ForwardedMessagesContainer>
            {
              InputCache[channel]?.forwards?.length < 2 ? (
                InputCache[channel].forwards.map((forwarded) => (
                  <MessageRenderer
                    id={ forwarded }
                    key={ forwarded }
                    grouped={ false }
                    channel={ channel }
                    avatar={ false }
                  />
                ))
              ) : (
                <StyledText className={ css`margin: 20px 0 0 0` }>{ InputCache[channel]?.forwards?.length } { t('forwarded_messages') }</StyledText>
              )
            }
          </ForwardedMessagesContainer>
          <InputButton
            className={ css`height: 34px; width: 34px; padding: 8px; margin-top: 8px;` }
            onClick={ () => updateInputInfo({ channel, forwards: [], attachments: [] }) }
          >
            <RiCloseLine className={ classNames({ [StyledIconCss]: true, [SmallInputIconCss]: true }) } />
          </InputButton>
        </ForwardsContainer>
      ) }
      <AttachmentsContainer>
        { !!attachments?.length && attachments.map((attachment: InputAttachment) => (
          <AttachmentPreview
            file={ attachment.content }
            plainFile={ attachment.plain }
            ready={ attachment.ready }
            progress={ attachment.progress }
          />
        )) }
      </AttachmentsContainer>
      { pickerOpened !== null && <ContentPicker type={ pickerOpened } onSelect={ addEmojiText } /> }
    </OuterContainer>
  );

  function decorate([node, path]: Array<any>) {
    if (!Text.isText(node)) {
      return [];
    }

    return getMessageMarkdownBounds(node.text, path);
  }

  async function sendMessage() {
    if (sendLoading) return;

    const forwards = [ ...(InputCache[channel]?.forwards || []) ];
    const attaches = [ ...attachments ].map((attachment) => attachment.id);

    setSendLoading(true);

    const output = value.map((child) => Node.string(child)).join('\n');

    const content = htmlUnescape(output);
    editor.insertBreak();
    setValue(initialValue);
    updateInputInfo({ channel, forwards: [], attachments: [] });
    setAttachments([]);

    const response = await MessagesService.sendMessage(channel, content || '', forwards, attaches);

    if (!response) return setSendLoading(false);

    cacheMessages([response]);
    addMessage({ channel: response.channel_id, message: response.id });
    leanArray(response.channel_id);

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

  async function uploadAttachment(file: InputAttachment, modifiedAttachments: InputAttachment[]) {
    const uploadUrl = await FilesService.createFile(1);
    const fileInfo = await FilesService.uploadFile(uploadUrl, file.plain, (progress: any) => {
      let newAttachments = [ ...modifiedAttachments ];
      newAttachments[newAttachments.findIndex((attachment) => attachment.content === file.content)].progress = (progress.loaded / progress.total) * 100;
      setAttachments(newAttachments);
    });

    let newAttachments = [ ...modifiedAttachments ];

    const index = newAttachments.findIndex((attachment) => attachment.content === file.content);
    newAttachments[index].ready = true;
    newAttachments[index].id = fileInfo.id;
    setAttachments(newAttachments);
  }

  async function addEmojiText(text: string, id: string, sticker: boolean) {
    if (!sticker) { // cringe cringe cringe
      // @ts-ignore
      inputRef.current?.children[0]?.focus();
      setImmediate(() => {
        if (!id) editor.insertText('<i:' + text + '>');
        else editor.insertText('<e:' + id + '>');
      });
    } else {
      if (sendLoading) return;
      setSendLoading(true);
      await MessagesService.sendMessage(channel, '', [], [], id);
      setSendLoading(false);
    }
  }

  function togglePickerType(type: EmojiPackType) {
    setPickerOpened(pickerOpened === type ? null : type);
  }
}

export default ChatInput;
