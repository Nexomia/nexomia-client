import { styled } from 'linaria/react';

const FilledButton = styled.button`
  height: 64px;
  background: var(--accent-dark);
  border: 0;
  border-radius: 4px;
  padding: 0 24px;
  font-size: 18px;
  font-weight: 800;
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
