import { styled } from 'linaria/react';

export default styled.div`
  display: flex;
  flex-direction: row;
  width: 46px;
  height: 40px;
  padding: 8px 11px;
  margin: 4px;
  border-radius: 6px;
  cursor: pointer;
  transition: .2s;

  &:hover {
    background: var(--background-light);
  }
  &:active, &.active {
    transform: scale(0.93);
  }
  &.active {
    opacity: .5;
  }
`