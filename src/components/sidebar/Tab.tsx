import { styled } from 'linaria/react';
import { css } from 'linaria';
import classNames from 'classnames';

import { IconType } from 'react-icons/lib';
import StyledIconCss from '../css/StyledIconCss';
import StyledText from '../ui/StyledText';

const Container = styled.div`
  margin: 0 8px 8px 8px;
  padding: 6px 6px;
  border-radius: 4px;
  height: 36px;
  display: flex;
  alignSelf: stretch;
  flex-direction: row;
  cursor: pointer;
  &:hover {
    background: var(--background-primary);
  }
  &.active {
    background: var(--background-primary);
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
`

interface TabProps {
  Icon?: IconType,
  title: string
}

function Tab({ Icon, title }: TabProps) {
  return (
    <Container>
      { Icon && <Icon className={ classNames({ [StyledIconCss]: true, [TabIconCss]: true }) } /> }
      <StyledText className={ TextCss }>{ title }</StyledText>
    </Container>
  );
}

export default Tab;
