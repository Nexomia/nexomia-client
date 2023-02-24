import { css } from 'linaria';
import { styled } from 'linaria/react';
import { ChangeEvent, Fragment, startTransition, useEffect, useState } from 'react';
import InputField from '../ui/InputField';
import StyledText from '../ui/StyledText';

import emojis from 'emojibase-data/en/data.json';

import { Emoji } from 'emojibase';
import classNames from 'classnames';
import { RiBuildingFill, RiCakeFill, RiEmotion2Fill, RiFlagFill, RiGlobalFill, RiGroupFill, RiHeartPulseFill, RiLeafFill, RiOutletFill, RiStarFill } from 'react-icons/ri';
import StyledIconCss from '../css/StyledIconCss';
import InputButton from './InputButton';
import { useTranslation } from 'react-i18next';
import { useStore } from 'effector-react';
import $UserStore from '../../store/UserStore';
import $EmojiPackCacheStore from '../../store/EmojiPackStore';
import $EmojiCacheStore from '../../store/EmojiStore';
import EmojiPackType from '../../store/models/EmojiPackType';
import EmoteHoverEffect from '../css/EmoteHoverEffect';
import EmojiCacheManager from '../../utils/EmojiCacheManager';

const Container = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  bottom: 80px;
  right: 256px;
  width: 480px;
  height: 500px;
  background: var(--background-primary);
  box-shadow: 0px 14px 30px 0px rgb(0, 0, 0, 20%);
  border-radius: 8px;
  z-index: 5;
  overflow: hidden;
`

const Sidebar = styled.div`
  width: 48px;
  height: 500px;
  overflow-y: scroll;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`

const ContentContainer = styled.div`
  display: flex;
  flex-grow: 0;
  flex-direction: column;
`

const SearchContainer = styled.div`
  height: 48px;
  flex-shrink: 0;
`

const SplitterContainer = styled.div`
  height: 16px;
  flex-shrink: 0;
`

const BottomContainer = styled.div`
  height: 48px;
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  padding: 0 8px;
  align-items: center;
`

const Scrollable = styled.div`
  flex-grow: 1;
  width: 432px;
  padding-left: 16px;
  overflow: hidden auto;
  background: var(--background-primary-alt);
  border-radius: 8px 0 0 8px;
  align-items: center;
`

const Emote = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  cursor: pointer;
  border-radius: 4px;
  user-drag: none;
  user-select: none;

  &.hovered {
    background-color: var(--background-light);
  }
`

const EmoteImage = styled.img`
  width: 40px;
  height: 40px;
  padding: 4px;
  user-select: none;
  user-drag: none;
`

const StickerCss = css`
  width: 100px;
  height: 100px;
`

const InputIconCss = css`
  width: 24px;
  height: 24px;
  user-select: none;
  user-drag: none;
`

const CategoryButtonCss = css`
  height: 36px;
  width: 36px;
  margin: 3px 6px;
  padding: 6px;
  margin-top: 6px;
`

interface PickerProps {
  onSelect: any,
  type: EmojiPackType
}

function ContentPicker({ onSelect = () => null, type }: PickerProps) {
  const { t } = useTranslation(['chat']);

  const UserCache = useStore($UserStore);
  const EmojiPacks = useStore($EmojiPackCacheStore);
  const Emojis = useStore($EmojiCacheStore);

  const [hoveredId, setHoveredId]: any = useState(0);
  const [selectedGroup, setSelectedGroup] = useState('0');
  const [selectedGroupIndication, setSelectedGroupIndication] = useState('0');
  const [searchText, setSearchText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSelectedGroup(
      type === EmojiPackType.EMOJI
      ? '0'
      : UserCache.emojiPacks[0]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    const currentSearchQuery = `${ searchQuery }`;
    startTransition(() => {
      setSearchText(currentSearchQuery);
    });
  }, [searchQuery]);

  useEffect(() => {
    const currentSelectedGroup = `${ selectedGroupIndication }`;
    startTransition(() => {
      setSelectedGroup(currentSelectedGroup);
    });
  }, [selectedGroupIndication]);

  let parsedOptimize: any = null

  return (
    <Container>
      <Sidebar>
        {
          UserCache.emojiPacks.map((pack: string) => EmojiPacks[pack].type === type && (
            <InputButton
              className={ classNames(CategoryButtonCss, { hover: selectedGroup === pack && !searchText }) }
              onClick={ () => setSelectedGroupIndication(pack) }
            >
              <img
                alt=''
                src={ EmojiPacks[pack].icon }
                className={ classNames(StyledIconCss, InputIconCss) }
              />
            </InputButton>
          ))
        }
        {
          type === EmojiPackType.EMOJI && (
            <Fragment>
              <InputButton
                className={ classNames(CategoryButtonCss, { hover: selectedGroupIndication === '0' && !searchText }) }
                onClick={ () => setSelectedGroupIndication('0') }
              >
                <RiEmotion2Fill className={ classNames(StyledIconCss, InputIconCss) } />
              </InputButton>
              <InputButton
                className={ classNames(CategoryButtonCss, { hover: selectedGroupIndication === '1' && !searchText }) }
                onClick={ () => setSelectedGroupIndication('1') }
              >
                <RiGroupFill className={ classNames(StyledIconCss, InputIconCss) } />
              </InputButton>
              <InputButton
                className={ classNames(CategoryButtonCss, { hover: selectedGroupIndication === '2' && !searchText }) }
                onClick={ () => setSelectedGroupIndication('2') }
              >
                <RiOutletFill className={ classNames(StyledIconCss, InputIconCss) } />
              </InputButton>
              <InputButton
                className={ classNames(CategoryButtonCss, { hover: selectedGroupIndication === '3' && !searchText }) }
                onClick={ () => setSelectedGroupIndication('3') }
              >
                <RiLeafFill className={ classNames(StyledIconCss, InputIconCss) } />
              </InputButton>
              <InputButton
                className={ classNames(CategoryButtonCss, { hover: selectedGroupIndication === '4' && !searchText }) }
                onClick={ () => setSelectedGroupIndication('4') }
              >
                <RiCakeFill className={ classNames(StyledIconCss, InputIconCss) } />
              </InputButton>
              <InputButton
                className={ classNames(CategoryButtonCss, { hover: selectedGroupIndication === '5' && !searchText }) }
                onClick={ () => setSelectedGroupIndication('5') }
              >
                <RiBuildingFill className={ classNames(StyledIconCss, InputIconCss) } />
              </InputButton>
              <InputButton
                className={ classNames(CategoryButtonCss, { hover: selectedGroupIndication === '6' && !searchText }) }
                onClick={ () => setSelectedGroupIndication('6') }
              >
                <RiHeartPulseFill className={ classNames(StyledIconCss, InputIconCss) } />
              </InputButton>
              <InputButton
                className={ classNames(CategoryButtonCss, { hover: selectedGroupIndication === '7' && !searchText }) }
                onClick={ () => setSelectedGroupIndication('7') }
              >
                <RiStarFill className={ classNames(StyledIconCss, InputIconCss) } />
              </InputButton>
              <InputButton
                className={ classNames(CategoryButtonCss, { hover: selectedGroupIndication === '8' && !searchText }) }
                onClick={ () => setSelectedGroupIndication('8') }
              >
                <RiGlobalFill className={ classNames(StyledIconCss, InputIconCss) } />
              </InputButton>
              <InputButton
                className={ classNames(CategoryButtonCss, { hover: selectedGroupIndication === '9' && !searchText }) }
                onClick={ () => setSelectedGroupIndication('9') }
              >
                <RiFlagFill className={ classNames(StyledIconCss, InputIconCss) } />
              </InputButton>
            </Fragment>
          )
        }
      </Sidebar>
      <ContentContainer>
        <SearchContainer>
          <InputField
            placeholder={ t('emoji_search')! }
            className={ css`
              margin: 6px;
              height: 36px;
              width: calc(100% - 12px);
              padding: 0 6px;
            ` }
            onChange={ (event: ChangeEvent<HTMLInputElement>) => setSearchQuery(event.target.value) }
          />
        </SearchContainer>
        <Scrollable>
          <SplitterContainer />
          {
            EmojiPacks[selectedGroup] && EmojiPacks[selectedGroup].emojis && EmojiPacks[selectedGroup].emojis.map((emoji: string) => !Emojis[emoji].deleted ? (
              <Emote
                key={ emoji }
                className={
                  classNames(
                    hoveredId === emoji ? 'hovered' : '',
                    type === EmojiPackType.STICKER && StickerCss,
                    EmoteHoverEffect
                  )
                }
                onMouseEnter={ () => setHoveredId(emoji) }
                onClick={ () => onSelect(Emojis[emoji].name, emoji, type === EmojiPackType.STICKER) }
              >
                <EmoteImage src={ Emojis[emoji].url } className={ classNames(type === EmojiPackType.STICKER && StickerCss) } />
              </Emote>
            ) : null)
          }
          {
            type === EmojiPackType.EMOJI && emojis.map((emote: Emoji, index) => (
              (
                (!searchText && emote.group?.toString() === selectedGroup) ||
                (searchText && emote.label.includes(searchText))
              ) && (parsedOptimize = EmojiCacheManager.get(emote.emoji)).length ? (
                <Emote
                  key={ index }
                  className={ classNames(hoveredId === index ? 'hovered' : '', EmoteHoverEffect) }
                  onMouseEnter={ () => setHoveredId(index) }
                  onClick={ () => onSelect(emote.label) }
                >
                  <EmoteImage src={ parsedOptimize[0].url } />
                </Emote>
              ) : null
            ))
          }
          <SplitterContainer />
        </Scrollable>
        <BottomContainer>
          {
            emojis[hoveredId] && (
              <Fragment>
                <EmoteImage src={ EmojiCacheManager.get(emojis[hoveredId].emoji)[0].url } />
                <StyledText className={ css`margin: 0 0 0 8px` }>{ emojis[hoveredId].label }</StyledText>
              </Fragment>
            )
          }
          {
            Emojis[hoveredId] && (
              <Fragment>
                <EmoteImage src={ Emojis[hoveredId].url } />
                <div>
                  <StyledText className={ css`margin: 0 0 0 8px` }>{ Emojis[hoveredId].name }</StyledText>
                  <StyledText className={ css`margin: 0 0 0 8px; color: var(--text-secondary)` }>{ 'From ' + EmojiPacks[Emojis[hoveredId].pack_id].name }</StyledText>
                </div>
              </Fragment>
            )
          }
        </BottomContainer>
      </ContentContainer>
    </Container>
  )
}

export default ContentPicker;
