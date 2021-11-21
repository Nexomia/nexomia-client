import { styled } from 'linaria/react';
import { css } from 'linaria';

import { useState } from 'react';

import {
  RiHomeFill,
  RiMailFill,
  RiSettings4Fill,
  RiEmotionLaughFill,
  RiCompassFill
} from 'react-icons/ri';

import { useStore } from 'effector-react';
import $UserStore from '../../store/UserStore';

import { useHistory, useParams } from 'react-router-dom';

import PanelButton from './PanelButton';
import PanelIconCss from '../css/PanelIconCss';
import classNames from 'classnames';
import getIconString from '../../utils/getIconString';

const Container = styled.div`
  flex-shrink: 0;
  width: 48px;
  align-self: center;
  overflow: hidden;
  background: var(--background-primary);
  margin: 8px 0;
  border-radius: 24px;
  height: 48px;
  transition: .2s;
  &:hover {
    border-radius: 12px;
  }
  &.active {
    border-radius: 12px;
    height: 328px;
  }
`

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  user-select: none;
  user-drag: none;
`

const AvatarLetters = styled.div`
  width: 100%;
  line-height: 48px;
  font-size: 18px;
  height: 100%;
  text-align: center;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--background-light);
  flex-shrink: 0;
  user-select: none;
  user-drag: none;
`

interface RouteParams {
  path: string,
  guildId: string
}

function UserMenu() {
  const history = useHistory();
  const { path, guildId } = useParams<RouteParams>();

  const [containerOpened, setContainerOpened] = useState(true);
  
  const user = useStore($UserStore);

  return (
    <Container className={ classNames({ active: containerOpened }) }>
      <PanelButton className={ classNames({ active: containerOpened }) } onClick={ () => setContainerOpened(!containerOpened) }>
        { user.avatar ? (
          <AvatarImg src={ user.avatar } />
        ) : (
          <AvatarLetters>{ getIconString(user.username) }</AvatarLetters>
        ) }
      </PanelButton>
      <PanelButton onClick={ () => history.push('/home') } className={ classNames({ active: path === 'home' }) }>
        <RiHomeFill className={ PanelIconCss } />
      </PanelButton>
      <PanelButton onClick={ () => history.push('/discover') } className={ classNames({ active: path === 'discover' || path === 'profiles' }) }>
        <RiCompassFill className={ PanelIconCss } />
      </PanelButton>
      <PanelButton onClick={ () => history.push('/channels/@me') } className={ classNames({ active: guildId === '@me' }) }>
        <RiMailFill className={ PanelIconCss } />
      </PanelButton>
      <PanelButton onClick={ () => history.push('/settings/general') } className={ classNames({ active: path === 'guildsettings' || path === 'settings' }) }>
        <RiSettings4Fill className={ PanelIconCss } />
      </PanelButton>
      <PanelButton className={ css`margin-bottom: 0` }>
        <RiEmotionLaughFill className={ PanelIconCss } />
      </PanelButton>
    </Container>
  );
}

export default UserMenu;
