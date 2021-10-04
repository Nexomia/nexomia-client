import { styled } from 'linaria/react';

const Modal = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  background: var(--background-primary);
  padding: 16px;
  box-shadow: 0px 14px 30px 0px rgb(0, 0, 0, 20%);
  transform: scale(1);
  transition: .3s cubic-bezier(.22,.54,.41,1.46);
`

export default Modal;
