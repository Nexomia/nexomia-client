import { css } from 'linaria';
import { styled } from 'linaria/react';
import StyledIconCss from '../../css/StyledIconCss';
import StyledText from '../../ui/StyledText';

import {
  RiCheckFill,
  RiCloseFill
} from 'react-icons/ri';
import classNames from 'classnames';


const Container = styled.div`
  padding: 16px;
  border-radius: 4px;
  background: var(--background-secondary-alt);
  margin: 4px 0;
  display: flex;
  flex-grow: 1;
  flex-direction: row;
  align-items: center;

  &:hover {
    background: var(--background-secondary);
  }
`

const Splitter = styled.div`
  flex-grow: 1;
`

const Selector = styled.div`
  width: 28px;
  height: 28px;
  padding: 2px;
  background: var(--background-light);
  cursor: pointer;

  & > svg {
    width: 24px;
    height: 24px;
  }

  &:not(.active):hover {
    background: var(--background-primary);
  }

  &.active {
    background: var(--accent);
  }
`

const GreenActiveCss = css`
  &.active {
    background: var(--accent-green);
  }
`

const RedActiveCss = css`
  &.active {
    background: var(--text-negative);
  }
`

const LeftIconCss = css`border-radius: 2px 0 0 2px`;
const RightIconCss = css`border-radius: 0 2px 2px 0`;

interface PermissionProps {
  name: string,
  description: string,
  active?: number,
  inherit: boolean,
  onEnablePerm?: any,
  onDisablePerm?: any,
  onInheritPerm?: any
}

function Permission({ name, description, active = 1, inherit, onEnablePerm, onDisablePerm, onInheritPerm }: PermissionProps) {
  return (
    <Container>
      <div>
        <StyledText className={ css`margin: 0; font-weight: 900` }>{ name }</StyledText>
        <StyledText className={ css`margin: 0; font-size: 14px` }>{ description }</StyledText>
      </div>
      <Splitter />
      <Selector className={ classNames({ [LeftIconCss]: true, active: active === 0 || (!inherit && active === 1), [RedActiveCss]: true }) } onClick={ onDisablePerm }>
        <RiCloseFill className={ StyledIconCss } />
      </Selector>
      { inherit && (<Selector className={ classNames({ active: active === 1 }) } onClick={ onInheritPerm } />) }
      <Selector className={ classNames({ [RightIconCss]: true, active: active === 2, [GreenActiveCss]: true }) } onClick={ onEnablePerm }>
        <RiCheckFill className={ StyledIconCss } />
      </Selector>
    </Container>
  )
}

export default Permission;
