import { styled } from 'linaria/react';
import { css } from 'linaria';
import classNames from 'classnames';

import { IconType } from 'react-icons/lib';
import StyledIconCss from '../css/StyledIconCss';
import StyledText from '../ui/StyledText';

const Container = styled.div`
  padding: 6px 16px 6px 6px;
  margin: 0;
  border-radius: 2px;
  height: 32px;
  display: flex;
  alignSelf: stretch;
  flex-direction: row;
  cursor: pointer;
  transition: .2s transform;
  &:hover {
    background: var(--accent);
  }
  &:active {
    transform: scale(0.98);
  }
`

const TabIconCss = css`
  width: 24px;
  height: 24px;
`

const TextCss = css`
  margin-top: 1px;
  margin-left: 4px;
  font-weight: 600;
  font-size: 14px;
`

interface TabProps {
  Icon?: IconType,
  title: string,
  onClick?: any
}

function ContextTab({ Icon, title, onClick }: TabProps) {
  return (
    <Container onClick={ onClick }>
      { Icon && <Icon className={ classNames({ [StyledIconCss]: true, [TabIconCss]: true }) } /> }
      <StyledText className={ TextCss }>{ title }</StyledText>
    </Container>
  );
}

export default ContextTab;
