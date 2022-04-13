// TODO: Reimplement from scratch

import classNames from 'classnames';
import { styled } from 'linaria/lib/react';

type SwitchProps = {
  active: boolean
}

const SwitchContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 26px;
`

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--background-secondary);
  border-radius: 34px;
  transition: .2s;

  &::before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 4px;
    bottom: 4px;
    background-color: var(--text-primary);
    transition: .2s;
    border-radius: 50%;
  }

  &.active {
    background-color: var(--accent);
  }

  &.active::before {
    transform: translateX(18px);
  }
`

function Switch({ active }: SwitchProps) {
  return (
    <SwitchContainer>
      <Slider className={ classNames(active ? 'active' : undefined) }/>
    </SwitchContainer>
  );
}

export default Switch;