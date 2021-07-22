import { styled } from '@linaria/react';
import { css } from '@linaria/core';

const Dot = styled.div`
  display: inline-block;
  margin: 0 3px;
  width: 8px;
  height: 8px;
  background: var(--text-primary);
  border-radius: 50%;
  animation: dot 1.2s infinite;

  @keyframes dot {
    from, to {
      transform: scale(1);
      opacity: 1;
    }

    50% {
      transform: scale(.5);
      opacity: .5;
    }
  }
`

function Dots() {
  return (
    <div>
      <Dot className={css`animation-delay: -400ms`} />
      <Dot className={css`animation-delay: -200ms`} />
      <Dot />
    </div>
  );
}

export default Dots;
