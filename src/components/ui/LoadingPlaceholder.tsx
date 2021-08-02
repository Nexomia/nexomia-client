import { styled } from 'linaria/react';
import { css } from 'linaria';

import classNames from 'classnames';

import StyledText from './StyledText';
import Dots from '../animations/Dots';

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
  background: var(--background-primary);
`

const DotsContainer = styled.div`
  margin: 0 0 20px 0;
  transition: .4s;

  &.inactive {
    transform: translateY(-20px);
    opacity: 0;
  }
`

type LoadingPlaceholderProps = {
  title: string,
  active: boolean,
  solid?: boolean,
  subtext?: string
}

const textCss = css`
  font-size: 24px;
  font-weight: 800;
  transition: .4s;

  &.inactive {
    transform: translateY(20px);
    opacity: 0;
  }
`

function LoadingPlaceholder({ title, active, solid = false, subtext = '' }: LoadingPlaceholderProps) {
  return (
    <Layer className={ classNames({ inactive: !active, [SolidLayer]: solid }) }>
      <DotsContainer className={ classNames({ inactive: !active }) }>
        <Dots />
      </DotsContainer>
      <StyledText
        className={ classNames({ inactive: !active, [textCss]: true }) }
      >{ title }{ subtext && ( <StyledText className={ css`text-align: center` }>{ subtext }</StyledText> ) }</StyledText>
    </Layer>
  )
}

export default LoadingPlaceholder;
