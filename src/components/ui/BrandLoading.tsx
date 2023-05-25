import { styled } from 'linaria/react';
import { css } from 'linaria';

import classNames from 'classnames';

import Brand from '../animations/Brand';
import { useEffect, useState } from 'react';

const Layer = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 100;
  transition: .4s;
  
  &.inactive {
    pointer-events: none;
    opacity: 0;
  }
`

const SolidLayer = css`
  background: var(--text-primary);
`

const DotsContainer = styled.div`
  margin: 0 0 20px 0;
  transition: .4s;

  &.inactive {
    opacity: 0;
  }
`

type BrandLoadingPlaceholderProps = {
  active: boolean,
  solid?: boolean,
}

function BrandLoading({ active, solid = false }: BrandLoadingPlaceholderProps) {
  const [clearElements, setClearElements] = useState(false);

  useEffect(() => {
    if (active && clearElements) setClearElements(false)
    if (active) return;
    setTimeout(() => setClearElements(true), 1000);
    
  }, [active]);

  return (
    !clearElements ? (
      <Layer className={ classNames({ inactive: !active, [SolidLayer]: solid }) }>
        <DotsContainer className={ classNames({ inactive: !active }) }>
          <Brand inactive={ !active } />
        </DotsContainer>
      </Layer>
    ) : null
  )
}

export default BrandLoading;
