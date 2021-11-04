import { css } from 'linaria';
import { styled } from 'linaria/react';
import { ChangeEvent, useState } from 'react';
import InputField from '../ui/InputField';
import StyledText from '../ui/StyledText';

import emojis from 'emojibase-data/en/data.json';

import { Emoji } from 'emojibase';
import { parse } from 'twemoji-parser';
import classNames from 'classnames';
import { RiBuildingFill, RiCakeFill, RiEmotion2Fill, RiFlagFill, RiGlobalFill, RiGroupFill, RiHeartPulseFill, RiLeafFill, RiOutletFill, RiStarFill } from 'react-icons/ri';
import StyledIconCss from '../css/StyledIconCss';
import InputButton from './InputButton';
import { useTranslation } from 'react-i18next';

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

const InputIconCss = css`
  width: 24px;
  height: 24px;
`

interface PickerProps {
  onSelect: any
}

function ContentPicker({ onSelect = () => null }: PickerProps) {
  const { t } = useTranslation(['chat']);

  const [hoveredId, setHoveredId] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [searchText, setSearchText] = useState('');

  let parsedOptimize: any = null

  return (
    <Container>
      <Sidebar>
        <InputButton
          className={ classNames(css`height: 36px; width: 36px; margin: 3px 6px; padding: 6px; margin-top: 8px;`, { hover: selectedGroup === 0 && !searchText }) }
          onClick={ () => setSelectedGroup(0) }
        >
          <RiEmotion2Fill className={ classNames({ [StyledIconCss]: true, [InputIconCss]: true }) } />
        </InputButton>
        <InputButton
          className={ classNames(css`height: 36px; width: 36px; margin: 3px 6px; padding: 6px; margin-top: 8px;`, { hover: selectedGroup === 1 && !searchText }) }
          onClick={ () => setSelectedGroup(1) }
        >
          <RiGroupFill className={ classNames({ [StyledIconCss]: true, [InputIconCss]: true }) } />
        </InputButton>
        <InputButton
          className={ classNames(css`height: 36px; width: 36px; margin: 3px 6px; padding: 6px; margin-top: 8px;`, { hover: selectedGroup === 2 && !searchText }) }
          onClick={ () => setSelectedGroup(2) }
        >
          <RiOutletFill className={ classNames({ [StyledIconCss]: true, [InputIconCss]: true }) } />
        </InputButton>
        <InputButton
          className={ classNames(css`height: 36px; width: 36px; margin: 3px 6px; padding: 6px; margin-top: 8px;`, { hover: selectedGroup === 3 && !searchText }) }
          onClick={ () => setSelectedGroup(3) }
        >
          <RiLeafFill className={ classNames({ [StyledIconCss]: true, [InputIconCss]: true }) } />
        </InputButton>
        <InputButton
          className={ classNames(css`height: 36px; width: 36px; margin: 3px 6px; padding: 6px; margin-top: 8px;`, { hover: selectedGroup === 4 && !searchText }) }
          onClick={ () => setSelectedGroup(4) }
        >
          <RiCakeFill className={ classNames({ [StyledIconCss]: true, [InputIconCss]: true }) } />
        </InputButton>
        <InputButton
          className={ classNames(css`height: 36px; width: 36px; margin: 3px 6px; padding: 6px; margin-top: 8px;`, { hover: selectedGroup === 5 && !searchText }) }
          onClick={ () => setSelectedGroup(5) }
        >
          <RiBuildingFill className={ classNames({ [StyledIconCss]: true, [InputIconCss]: true }) } />
        </InputButton>
        <InputButton
          className={ classNames(css`height: 36px; width: 36px; margin: 3px 6px; padding: 6px; margin-top: 8px;`, { hover: selectedGroup === 6 && !searchText }) }
          onClick={ () => setSelectedGroup(6) }
        >
          <RiHeartPulseFill className={ classNames({ [StyledIconCss]: true, [InputIconCss]: true }) } />
        </InputButton>
        <InputButton
          className={ classNames(css`height: 36px; width: 36px; margin: 3px 6px; padding: 6px; margin-top: 8px;`, { hover: selectedGroup === 7 && !searchText }) }
          onClick={ () => setSelectedGroup(7) }
        >
          <RiStarFill className={ classNames({ [StyledIconCss]: true, [InputIconCss]: true }) } />
        </InputButton>
        <InputButton
          className={ classNames(css`height: 36px; width: 36px; margin: 3px 6px; padding: 6px; margin-top: 8px;`, { hover: selectedGroup === 8 && !searchText }) }
          onClick={ () => setSelectedGroup(8) }
        >
          <RiGlobalFill className={ classNames({ [StyledIconCss]: true, [InputIconCss]: true }) } />
        </InputButton>
        <InputButton
          className={ classNames(css`height: 36px; width: 36px; margin: 3px 6px; padding: 6px; margin-top: 8px;`, { hover: selectedGroup === 9 && !searchText }) }
          onClick={ () => setSelectedGroup(9) }
        >
          <RiFlagFill className={ classNames({ [StyledIconCss]: true, [InputIconCss]: true }) } />
        </InputButton>
      </Sidebar>
      <ContentContainer>
        <SearchContainer>
          <InputField
            placeholder={ t('emoji_search') }
            className={ css`
              margin: 6px;
              height: 36px;
              width: calc(100% - 12px);
              padding: 0 6px;
            ` }
            onChange={ (event: ChangeEvent<HTMLInputElement>) => setSearchText(event.target.value) }
          />
        </SearchContainer>
        <Scrollable>
          <SplitterContainer />
          { emojis.map((emote: Emoji, index) => (
            (
              (!searchText && emote.group === selectedGroup) ||
              (searchText && emote.label.includes(searchText))
            ) && (parsedOptimize = parse(emote.emoji)).length ? (
              <Emote
                key={ index }
                className={ hoveredId === index ? 'hovered' : '' }
                onMouseEnter={ () => setHoveredId(index) }
                onClick={ () => onSelect(emote.label) }
              >
                <EmoteImage src={ parsedOptimize[0].url } />
              </Emote>
            ) : null
          )) }
          <SplitterContainer />
        </Scrollable>
        <BottomContainer>
          <EmoteImage src={ parse(emojis[hoveredId].emoji)[0].url } />
          <StyledText className={ css`margin: 0 0 0 8px` }>{ emojis[hoveredId].label }</StyledText>
        </BottomContainer>
      </ContentContainer>
    </Container>
  )
}

export default ContentPicker;
