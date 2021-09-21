import classNames from 'classnames';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { Fragment, useState } from 'react';
import { RiArrowDownSLine } from 'react-icons/ri';
import StyledIconCss from '../css/StyledIconCss';
import DropdownKey from '../interfaces/DropdownKey';

const PhysicalContainer = styled.div`
  display: flex;
  width: 100%;
  height: 48px;
  margin-top: 16px;
`

const NoMargin = css`
  margin: 0;
`

const Container = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 48px;
  flex-direction: column;
  border: 2px solid var(--background-secondary-alt);
  background: var(--background-secondary-alt);
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  outline: none;
  transition: .2s;
  cursor: pointer;
  overflow: hidden;

  &.active {
    border: 2px solid var(--accent);
    height: 300px;
  }

  &:hover:not(.active) {
    border: 2px solid var(--accent-dark);
  }
`

const DropIconCss = css`
  width: 24px;
  height: 24px;
  margin: 10px 0;
  transition: .2s;

  &.active {
    transform: rotate(180deg);
  }
`

const Header = styled.div`
  display: flex;
  flex-direction: row;
  height: 44px;
  width: 100%;
  line-height: 44px;
  user-select: none;
  padding: 0 14px;
`

const Item = styled.div`
  display: flex;
  flex-direction: row;
  height: 44px;
  width: 100%;
  line-height: 44px;
  user-select: none;
  padding: 0 14px;

  &:hover, &.active {
    background: var(--background-secondary);
  }
`

const Scrollable = styled.div`
  width: 100%;
  height: 256px;
  overflow-y: auto;
  flex-shrink: 0;
`

const Text = styled.div`
  flex-grow: 1;
  transition: .2s;

  &.active {
    opacity: 0;
  }
`

interface DropdownProps {
  keys: DropdownKey[],
  defaultKey?: number,
  noMargin?: boolean,
  onChange?: any
}

function DropdownInput({ keys, defaultKey, noMargin = false, onChange = () => null }: DropdownProps) {
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState(defaultKey || 0);

  return (
    <PhysicalContainer className={ classNames(noMargin && NoMargin) }>
      <Container onClick={ () => setActive(!active) } className={ classNames({ active }) }>
        <Header>
          { !!keys.length && (
            <Fragment>
              <Text className={ classNames({ active }) }>{ keys[selected]?.text }</Text>
              <RiArrowDownSLine className={ classNames(StyledIconCss, DropIconCss, { active }) } />
            </Fragment>
          ) }
        </Header>
        <Scrollable>
          {
            keys.map((key) => (
              <Item
                onClick={ () => { setSelected(keys.indexOf(key)); onChange(key) } }
                className={ classNames({ active: selected === keys.indexOf(key) }) }
                key={ key.id }
              >{ key.text }</Item>
            ))
          }
        </Scrollable>
      </Container>
    </PhysicalContainer>
  )
}

export default DropdownInput;
