import { styled } from 'linaria/react';
import { css } from 'linaria';

import classNames from 'classnames';

import { useHistory, useParams } from 'react-router-dom';

import {
  RiAddFill
} from 'react-icons/ri'

import { useStore } from 'effector-react';
import $ModalStore, { setModalState } from '../../store/ModalStore';
import $GuildStore from '../../store/GuildStore';
import $GuildCacheStore from '../../store/GuildCacheStore';

import UserMenu from '../guilds/UserMenu';
import PanelButton from '../guilds/PanelButton';
import StyledText from '../ui/StyledText';
import PanelIconCss from '../css/PanelIconCss';

const GuildsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 64px;
  align-self: stretch;
  background: var(--background-secondary);
`

const Splitter = styled.div`
  height: 4px;
  width: calc(100% - 32px);
  margin: 0 16px 8px 16px;
  border-radius: 2px;
  background: var(--background-primary);
`

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
`

const GuildLetters = css`
  line-height: 48px;
  height: 48px;
  text-align: center;
  font-weight: 600;
  margin: 0;
`

interface RouteParams {
  guildId: string
}

function Guilds() {
  const history = useHistory();
  const { guildId } = useParams<RouteParams>();

  const modals = useStore($ModalStore);
  const guildList = useStore($GuildStore);
  const guilds = useStore($GuildCacheStore);

  return (
    <GuildsContainer>
      <UserMenu />
      <Splitter />
      {
        guildList.map((guildListId) => (
          <PanelButton
            onClick={ () => switchGuild(guildListId) }
            key={ guildListId }
            className={ classNames({ active: guildId === guildListId }) }
          >
            { guilds[guildListId]?.icon && <AvatarImg src={ guilds[guildListId]?.icon } /> }
            {
              !guilds[guildListId]?.icon &&
              (
                <StyledText className={ GuildLetters }>
                  {
                    guilds[guildListId]?.name && (
                      guilds[guildListId].name.split(' ')[1]
                      ? guilds[guildListId].name.split(' ')[0][0] + guilds[guildListId].name.split(' ')[1][0]
                      : guilds[guildListId].name.split(' ')[0][0] + (
                        guilds[guildListId].name.split(' ')[0][1]
                        ? guilds[guildListId].name.split(' ')[0][1]
                        : ''
                      )
                    )
                  }
                </StyledText>
              )
            }
          </PanelButton>
        ))
      }
      <PanelButton className={ css`margin-bottom: 0` } onClick={ () => { setModalState({ serverCreation: true }) } }>
        <RiAddFill className={ PanelIconCss } />
      </PanelButton>
    </GuildsContainer>
  );

  function switchGuild(id: string) {
    history.push(`/channels/${id}`);
  }
}

export default Guilds;
