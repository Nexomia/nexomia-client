import { styled } from 'linaria/react';

const MultilineField = styled.textarea`
  display: flex;
  width: 100%;
  height: 48px;
  margin-top: 16px;
  padding: 14px;
  border: 2px solid var(--background-secondary-alt);
  background: var(--background-secondary-alt);
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  color: var(--text-primary);
  outline: none;
  transition: .2s;
  -moz-appearance: textfield;
  resize: none;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &::placeholder {
    color: var(--text-secondary);
    user-select: none;
  }

  &:focus {
    border: 2px solid var(--accent);
  }

  &:hover:not(:focus) {
    border: 2px solid var(--accent-dark);
  }
`

export default MultilineField;
