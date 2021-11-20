import classNames from 'classnames';
import { useStore } from 'effector-react';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RiArrowLeftLine } from 'react-icons/ri';
import $EmojiPackCacheStore from '../../../store/EmojiPackStore';
import $EmojiCacheStore from '../../../store/EmojiStore';
import EmojiPackType from '../../../store/models/EmojiPackType';
import $UserStore from '../../../store/UserStore';
import StyledIconCss from '../../css/StyledIconCss';
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
  width: 250px;
  height: 250px;
  background: var(--background-secondary);
  border-radius: 8px;
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

function EmotesUserView() {
  const UserCache = useStore($UserStore);
  const EmojiPacks = useStore($EmojiPackCacheStore);
  const Emojis = useStore($EmojiCacheStore);

  const [openedPack, setOpenedPack] = useState('');

  const { t } = useTranslation(['settings']);

  return (
    <Fragment>
      { !openedPack ? (
        <Fragment>
          <StyledText className={ css`text-align: center; margin: 32px 0` }>
            { 'Express your emotions freely with user-created emote packs! Create your own emote pack or add an existing one!' }
          </StyledText>
          <CardContainer>
            {
              UserCache.emojiPacks.map((pack: string) => (
                <PackCard
                  picture={ EmojiPacks[pack]?.icon || '' }
                  name={ EmojiPacks[pack]?.name }
                  description={ EmojiPacks[pack]?.description || '' }
                  author={ EmojiPacks[pack].owner_id }
                  onClick={ () => setOpenedPack(pack) }
                />
              ))
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
          <PreviewContainer className={ css`background: var(--background-secondary-alt)` }>
            <Preview src={ EmojiPacks[openedPack]?.icon || '' } />
          </PreviewContainer>
          <StyledText className={ css`text-align: center; margin: 24px 0 24px 0; font-size: 22px; font-weight: 900` }>
            { EmojiPacks[openedPack]?.name }
          </StyledText>
          {
            EmojiPacks[openedPack].owner_id === UserCache.id && (
              <StyledText className={ css`text-align: center; margin: -12px 0 24px 0; font-weight: 900` }>
                { 'You own this pack.' }
              </StyledText>
            )
          }
          <CardContainer>
            {
              EmojiPacks[openedPack].emojis.map((emoji: string) => (
                <PackCard
                  picture={ Emojis[emoji].url || '' }
                  name={ Emojis[emoji].name }
                  mini={ true }
                />
              ))
            }
          </CardContainer>
        </Fragment>
      ) }
    </Fragment>
  )
}

export default EmotesUserView;
