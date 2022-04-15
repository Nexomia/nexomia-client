import { styled } from 'linaria/react';

const PanelButton = styled.div`
  width: 48px;
  height: 48px;
  position: relative;
  align-self: center;
  overflow: hidden;
  background: var(--background-primary);
  margin-bottom: 8px;
  border-radius: 50%;
  outline: solid 0px;
  outline-color: transparent;
  transition: .2s;
  cursor: pointer;
  flex-shrink: 0;
  &:hover, &.active {
    background: var(--background-light);
    border-radius: 12px;
  }
  &.active:not(.remoutline) {
    outline: solid 2px;
    outline-color: var(--accent);
  }
  &:active {
    transform: translateY(2px);
  }
`

export default PanelButton;