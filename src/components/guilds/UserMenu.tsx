import { styled } from 'linaria/react';
import { css } from 'linaria';

import { useState } from 'react';

import {
  RiHomeFill,
  RiMailFill,
  RiSettings4Fill,
  RiEmotionLaughFill
} from 'react-icons/ri';

import { useAppDispatch, useAppSelector } from '../../store/hooks';

import { useHistory, useParams } from 'react-router-dom';

import PanelButton from './PanelButton';
import PanelIconCss from '../css/PanelIconCss';
import classNames from 'classnames';

const Container = styled.div`
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
    height: 272px;
  }
`

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
`

interface RouteParams {
  guildId: string
}

function UserMenu() {
  const history = useHistory();
  const { guildId } = useParams<RouteParams>();

  const [containerOpened, setContainerOpened] = useState(true);
  
  const user = useAppSelector((state) => state.user.value);

  return (
    <Container className={ classNames({ active: containerOpened }) }>
      <PanelButton className={ classNames({ active: containerOpened }) } onClick={ () => setContainerOpened(!containerOpened) }>
        <AvatarImg src={ user.avatar } />
      </PanelButton>
      <PanelButton onClick={ () => history.push('/channels/@home') } className={ classNames({ active: guildId === '@home' }) }>
        <RiHomeFill className={ PanelIconCss } />
      </PanelButton>
      <PanelButton onClick={ () => history.push('/channels/@me') } className={ classNames({ active: guildId === '@me' }) }>
        <RiMailFill className={ PanelIconCss } />
      </PanelButton>
      <PanelButton>
        <RiSettings4Fill className={ PanelIconCss } />
      </PanelButton>
      <PanelButton className={ css`margin-bottom: 0` }>
        <RiEmotionLaughFill className={ PanelIconCss } />
      </PanelButton>
    </Container>
  );
}

export default UserMenu;
