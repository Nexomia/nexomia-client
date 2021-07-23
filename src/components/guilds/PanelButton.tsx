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
    background: var(--accent-alt);
    border-radius: 12px;
  }
`

export default PanelButton;