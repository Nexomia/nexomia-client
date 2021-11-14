import { css } from 'linaria';

export default css`
  opacity: 0;
  & > div {
    transform: scale(.8);
  }
  & > img {
    transform: scale(.8);
  }
  pointer-events: none;
`
