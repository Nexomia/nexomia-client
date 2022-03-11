import classNames from "classnames"
import { styled } from "linaria/lib/react"

type SwitchProps = {
  active: boolean,
}

const SwitchCss = styled.div`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
`

const SliderCss = styled.span`
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
    height: 16px;
    width: 16px;
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
    transform: translateX(22px);
  }
`

function Switch({ active }: SwitchProps) {
  return (
    <SwitchCss>
      <SliderCss className={ classNames(active ? 'active' : undefined) }/>
    </SwitchCss>
  )
}

export default Switch;