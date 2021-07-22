import { styled } from 'linaria/react';

const FilledButton = styled.button`
  height: 42px;
  background: var(--accent);
  border: 0;
  border-radius: 4px;
  padding: 0 16px;
  font-size: 16px;
  font-weight: 400;
  margin-top: 16px;
  color: var(--text-primary);
  cursor: pointer;
  transition: .2s;
  user-select: none;

  &:hover {
    background: var(--accent-alt);
  }

  &:active {
    background: var(--accent-dark);
  }
`

export default FilledButton;
