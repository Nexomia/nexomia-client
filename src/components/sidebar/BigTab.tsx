import classNames from 'classnames';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { useEffect, useRef } from 'react';
import getIconString from '../../utils/getIconString';
import StyledText from '../ui/StyledText';

const Presence = styled.div`
  width: 9px;
  height: 9px;
  margin: 0 -9px -9px 0;
  border-radius: 50%;
  outline: 4px solid var(--background-secondary-alt);
  position: relative;
  left: 25px;
  top: 8px;
  transition: .2s;
`

const Container = styled.div`
  margin: 0 8px 8px 8px;
  padding: 6px 8px;
  border-radius: 4px;
  display: flex;
  height: 46px;
  flex-direction: row;
  flex-grow: 0;
  align-items: center;
  cursor: pointer;
  transition: .2s;
  &:hover {
    background: var(--background-primary);

    & > ${ Presence } {
      outline-color: var(--background-primary);
    }
  }
  &:active {
    transform: scale(0.98);
  }
`

const OfflineCss = css`
  opacity: .5;

  &:hover {
    opacity: 1;
  }
`

const AvatarCss = `
  width: 34px;
  height: 34px;
  border-radius: 50%;
  user-select: none;
  margin-right: 8px;
  cursor: pointer;
  transition: .2s;
  &:active {
    transform: translateY(2px);
  }
  line-height: 34px;
  height: 34px;
  text-align: center;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--background-light);
`

const ActiveCss = css`
  &, &:hover {
    background: var(--background-light);
  }

  & > ${ Presence }, &:hover >  ${ Presence } {
    outline-color: var(--background-light);
  }
`

const Avatar = styled.img`${AvatarCss}`
const LetterAvatar = styled.div`${AvatarCss}`

interface BigTabProps {
  name: string,
  tab?: boolean,
  active?: boolean,
  onClick?: any
}

function BigTab({ name, tab = false, onClick = () => null, active = false }: BigTabProps) {
  const textRef = useRef<HTMLDivElement>(null);

  // trash workaround for React/Chrome bug
  // it can potentially lower the performance
  useEffect(() => {
    if (textRef.current) textRef.current.style.webkitBackgroundClip = 'text';
    
  });

  return (
    <Container className={ classNames(active && ActiveCss) } onClick={ onClick }>
      <LetterAvatar>{ getIconString(name) }</LetterAvatar>
      <div className={ css`display: flex; flex-direction: column; justify-content: center; width: 157px;` }>
        <div>
          <StyledText
            className={ css`
              margin: 0;
              font-size: 16px;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              display: inline;
            ` }
            ref={ textRef }
            style={{
              background: 'var(--text-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            { name }
          </StyledText>
        </div>
      </div>
    </Container>
  )
}

export default BigTab;
