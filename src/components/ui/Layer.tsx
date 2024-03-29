import { styled } from 'linaria/react';

const Layer = styled.div`
  display: flex;
  position: fixed;
  width: 100vw;
  height: 100vh;
  align-items: center;
  justify-content: center;
  padding: 16px;
  opacity: 1;
  transition: .25s;
  z-index: 10;
`

export default Layer;
