import classNames from 'classnames';
import { useStore } from 'effector-react';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RiArrowLeftLine } from 'react-icons/ri';
import { useFilePicker } from 'use-file-picker';
import EmojisService from '../../../services/api/emojis/emojis.service';
import FilesService from '../../../services/api/files/files.service';
import UsersService from '../../../services/api/users/users.service';
import $EmojiPackCacheStore, { addEmoji, cacheEmojiPacks, removeEmoji } from '../../../store/EmojiPackStore';
import $EmojiCacheStore, { cacheEmojis } from '../../../store/EmojiStore';
import $ModalStore, { setModalState } from '../../../store/ModalStore';
import $UserStore, { addEmojiPack } from '../../../store/UserStore';
import StyledIconCss from '../../css/StyledIconCss';
import FilledButton from '../../ui/FilledButton';
import InputField from '../../ui/InputField';
import MultilineField from '../../ui/MultilineField';
import StyledText from '../../ui/StyledText';
import PackCard from '../ui/PackCard';

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: -8px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 32px;
`

const ButtonContainer = styled.div`
  display: flex;
  padding: 14px;
  cursor: pointer;
  border-radius: 4px;
  flex-direction: row;
  margin: 16px 0;

  &:hover {
    background: var(--background-light);
  }
`

const IconCss = css`
  width: 20px;
  height: 20px;
  margin-right: 14px;
`

const PreviewContainer = styled.div`
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
`

const Preview = styled.img`
  max-height: 80%;
  max-width: 80%;
  user-select: none;
  user-drag: none;
`

const HeadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--background-secondary-alt);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
`

function EmotesUserView() {
  const UserCache = useStore($UserStore);
  const EmojiPacks = useStore($EmojiPackCacheStore);
  const Emojis = useStore($EmojiCacheStore);
  const Modals = useStore($ModalStore);
  
  const [prevContent, setPrevContent] = useState(false);
  const [openedPack, setOpenedPack] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [openPicker, result] = useFilePicker({
    readAs: 'DataURL',
    accept: 'image/*'
  });

  const [openIconPicker, iconResult] = useFilePicker({
    readAs: 'DataURL',
    accept: 'image/*'
  });

  useEffect(() => {
    setOpenedPack(Modals.emojiPack[1]);
    setModalState({ emojiPack: [false, ''] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (result.filesContent?.length && !result.loading && !prevContent) {
      uploadEmoji();
      setPrevContent(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.loading]);

  useEffect(() => {
    if (iconResult.filesContent?.length && !iconResult.loading) {
      uploadIcon();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iconResult.loading]);

  const { t } = useTranslation(['settings']);

  return (
    <Fragment>
      { !openedPack ? (
        <Fragment>
          <StyledText className={ css`text-align: center; margin: 32px 0` }>
            { 'Express your emotions freely with user-created emote packs! Create your own emote pack or add an existing one!' }
          </StyledText>
          <FilledButton
            className={ css`margin-top: 0; margin-bottom: 32px` }
            onClick={ () => setModalState({ packCreation: true }) }
          >{ 'New emote pack' }</FilledButton>
          <CardContainer>
            {
              UserCache.emojiPacks.map((pack: string) => EmojiPacks[pack] ? (
                <PackCard
                  picture={ EmojiPacks[pack]?.icon || '' }
                  name={ EmojiPacks[pack]?.name }
                  description={ EmojiPacks[pack]?.description || '' }
                  author={ EmojiPacks[pack].owner_id }
                  onClick={ () => setOpenedPack(pack) }
                  buttons={ true }
                  hideEdit={ EmojiPacks[pack]?.owner_id !== UserCache.id }
                  onDeleteClicked={ () => setModalState({ packDelete: [true, pack] }) }
                />
              ) : null)
            }
          </CardContainer>
        </Fragment>
      ) : (
        <Fragment>
          <ButtonContainer onClick={ () => setOpenedPack('') }>
            <RiArrowLeftLine className={ classNames({ [IconCss]: true, [StyledIconCss]: true }) } />
            <StyledText className={ css`margin: 0; font-weight: 900` }>
              { t('server_roles.back') }
            </StyledText>
          </ButtonContainer>
          {
            !UserCache.emojiPacks.includes(openedPack) && (
              <FilledButton
                className={ css`margin-top: 0; margin-bottom: 32px` }
                onClick={ () => savePack() }
              >{ 'Save this pack' }</FilledButton>
            )
          }
          <HeadingContainer>
            <PreviewContainer
              onClick={ () => EmojiPacks[openedPack].owner_id === UserCache.id ? openIconPicker() : null }
              className={ css`background: var(--background-secondary-alt)` }
            >
              <Preview src={ EmojiPacks[openedPack]?.icon || '' } />
            </PreviewContainer>
            {
              EmojiPacks[openedPack].owner_id === UserCache.id ? (
                <Fragment>
                  <InputField
                    className={
                      css`
                        margin-top: 16px;
                        font-weight: 900;
                        font-size: 22px;
                        text-align: center;
                        background: var(--background-secondary);
                        border: 2px solid var(--background-secondary);

                        &:not(:hover):not(:focus) {
                          background: transparent;
                          border-color: transparent;
                        }
                      `
                    }
                    defaultValue={ EmojiPacks[openedPack]?.name }
                    placeholder={ 'Pack name' }
                    onChange={ (event: ChangeEvent<HTMLInputElement>) => { setName(event.target.value) } }
                    onBlur={ updateName }
                  />
                  <MultilineField
                    className={
                      css`
                        background: var(--background-secondary);
                        border: 2px solid var(--background-secondary);
                        height: 200px;
                        margin-bottom: 32px;
                      `
                    }
                    defaultValue={ EmojiPacks[openedPack]?.description }
                    placeholder={ 'Tell more about your pack!' }
                    onChange={ (event: ChangeEvent<HTMLTextAreaElement>) => { setDescription(event.target.value) } }
                    onBlur={ updateDescription }
                  />
                </Fragment>
              ) : (
                <StyledText className={ css`text-align: center; margin: 24px 0 24px 0; font-size: 22px; font-weight: 900` }>
                  { EmojiPacks[openedPack]?.name }
                </StyledText>
              )
            }
            {
              EmojiPacks[openedPack].owner_id === UserCache.id && (
                <StyledText className={ css`text-align: center; margin: -12px 0 8px 0; font-weight: 900` }>
                  { 'You own this pack' }
                </StyledText>
              )
            }
          </HeadingContainer>
          {
            EmojiPacks[openedPack].owner_id === UserCache.id && (
              <FilledButton
                className={ css`margin-top: 0; margin-bottom: 32px` }
                onClick={ () => { openPicker(); setPrevContent(false); } }
              >{ 'Add an emote' }</FilledButton>
            )
          }
          <CardContainer>
            {
              EmojiPacks[openedPack].emojis.map((emoji: string) => !Emojis[emoji].deleted ? (
                <PackCard
                  picture={ Emojis[emoji].url || '' }
                  name={ Emojis[emoji].name }
                  mini={ true }
                  buttons={ EmojiPacks[openedPack].owner_id === UserCache.id }
                  onEditClicked={ () => setModalState({ emojiEdit: [true, emoji, openedPack, Emojis[emoji].name] }) }
                  onDeleteClicked={ () => deleteEmoji(emoji) }
                />
              ) : null)
            }
            {
              !EmojiPacks[openedPack].emojis.filter((emoji: string) => !Emojis[emoji].deleted).length ? (
                <StyledText className={ css`text-align: center; margin: 32px 0` }>
                  { 'This pack is empty...' }
                </StyledText>
              ) : null
            }
          </CardContainer>
        </Fragment>
      ) }
    </Fragment>
  )

  async function uploadEmoji() {
    const uploadUrl = await FilesService.createFile(6 - EmojiPacks[openedPack].type);
    const fileInfo = await FilesService.uploadFile(uploadUrl, result.plainFiles[0]);
    const emoji = await EmojisService.putEmoji(
      result.filesContent[0].name.split('.')[0],
      fileInfo.id,
      openedPack
    );
    cacheEmojis([emoji]);
    addEmoji({ pack: openedPack, emoji: emoji.id });
  }

  async function uploadIcon() {
    const uploadUrl = await FilesService.createFile(2);
    const fileInfo = await FilesService.uploadFile(uploadUrl, iconResult.plainFiles[0]);
    const pack = await EmojisService.editPackIcon(
      fileInfo.id,
      openedPack
    );
    cacheEmojiPacks([pack]);
  }

  async function updateName() {
    if (!name) return;
    const pack = await EmojisService.editPackName(
      name,
      openedPack
    );
    cacheEmojiPacks([pack]);
  }

  async function updateDescription() {
    if (!description) return;
    const pack = await EmojisService.editPackDescription(
      description,
      openedPack
    );
    cacheEmojiPacks([pack]);
  }

  async function deleteEmoji(emoji: string) {
    await EmojisService.deleteEmoji(emoji, openedPack);
    removeEmoji({ pack: openedPack, emoji });
  }

  async function savePack() {
    await UsersService.putEmojiPack(openedPack);
    addEmojiPack(openedPack);
  }
}

export default EmotesUserView;
