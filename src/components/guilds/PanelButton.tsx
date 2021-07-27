import { styled } from 'linaria/react';

const PanelButton = styled.div`
  width: 48px;
  height: 48px;
  align-self: center;
  overflow: hidden;
  background: var(--background-primary);
  margin-bottom: 8px;
  border-radius: 50%;
  transition: .2s;
  cursor: pointer;
  &:hover, &.active {
    background: var(--accent);
    border-radius: 12px;
  }
  &:active {
    transform: translateY(2px);
  }
`

export default PanelButton;