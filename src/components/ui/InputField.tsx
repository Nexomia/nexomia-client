import { styled } from '@linaria/react';

const InputField = styled.input`
  display: flex;
  width: 100%;
  height: 48px;
  margin-top: 16px;
  padding: 0 14px;
  border: 2px solid var(--background-secondary-alt);
  background: var(--background-secondary-alt);
  border-radius: 4px;
  font-size: 16px;
  font-weight: 400;
  color: var(--text-primary);
  outline: none;
  transition: .2s;
  -moz-appearance: textfield;

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

export default InputField;
