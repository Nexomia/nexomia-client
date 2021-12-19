import { css } from 'linaria';

export default css`
  cursor: pointer;
  transition: .3s cubic-bezier(.22,.54,.41,1.46);
  filter: drop-shadow(0 0 0 rgba(0, 0, 0, .3));

  &:hover {
    position: relative;
    transform: scale(1.2);
    filter: drop-shadow(0 5px 10px rgba(0, 0, 0, .3));
    z-index: 9;
  }
`