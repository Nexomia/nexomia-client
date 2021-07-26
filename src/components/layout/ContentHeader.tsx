import { styled } from 'linaria/react';
import { css } from 'linaria';

import { useStore } from 'effector-react';
import { $CurrentChannelStore } from '../../store/ChannelStore';
import { BiHash } from 'react-icons/bi';
import classNames from 'classnames';
import StyledIconCss from '../css/StyledIconCss';

const Header = styled.div`
  height: 48px;
  display: flex;
  alignSelf: stretch;
  align-items: center;
`

const Content = styled.div`
  display: flex;
  align-self: center;
  color: var(--text-primary);
  font-weight: 900;
  font-size: 18px;
  padding: 0 8px;
  user-select: none;
`

const HeaderIconCss = css`
  width: 28px;
  height: 28px;
  margin-left: 8px;
`

function ContentHeader() {
  const currentChannel = useStore($CurrentChannelStore);

  return (
    <Header>
      { currentChannel.name && (<BiHash className={ classNames({ [StyledIconCss]: true, [HeaderIconCss]: true }) } />) }
      <Content>{ currentChannel.name || '' }</Content>
    </Header>
  );
}

export default ContentHeader;