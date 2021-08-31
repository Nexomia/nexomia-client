import { styled } from 'linaria/react';
import { css } from 'linaria';

import classNames from 'classnames';

import { useHistory, useParams } from 'react-router-dom';

import {
  RiAddFill
} from 'react-icons/ri'

import { useStore } from 'effector-react';
import { setModalState } from '../../store/ModalStore';
import $GuildStore from '../../store/GuildStore';
import $GuildCacheStore from '../../store/GuildCacheStore';
import { setContextMenu } from '../../store/ContextMenuStore';

import UserMenu from '../guilds/UserMenu';
import PanelButton from '../guilds/PanelButton';
import StyledText from '../ui/StyledText';
import PanelIconCss from '../css/PanelIconCss';
import getIconString from '../../utils/getIconString';
import $ChannelStore from '../../store/ChannelStore';

const GuildsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 64px;
  align-self: stretch;
  background: var(--background-secondary);
  overflow: auto

  &::-webkit-scrollbar {
    width: 0;
  }
`

const Splitter = styled.div`
  flex-shrink: 0;
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

  const guildList = useStore($GuildStore);
  const guilds = useStore($GuildCacheStore);
  const channels = useStore($ChannelStore);

  return (
    <GuildsContainer>
      <UserMenu />
      <Splitter />
      {
        guildList.map((guildListId) => (
          <PanelButton
            onClick={ () => switchGuild(guildListId) }
            onContextMenu={ (event: any) => openContextMenu(event, guildListId) }
            key={ guildListId }
            className={ classNames({ active: guildId === guildListId }) }
          >
            { guilds[guildListId]?.icon && <AvatarImg src={ guilds[guildListId]?.icon } /> }
            {
              !guilds[guildListId]?.icon &&
              (
                <StyledText className={ GuildLetters }>
                  {
                    guilds[guildListId]?.name && getIconString(guilds[guildListId].name)
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
    if (channels[id] && channels[id].length) {
      history.push(`/channels/${id}/${channels[id][channels[id].indexOf(guilds[id]?.default_channel || '')] || channels[id][0]}`);
    } else {
      history.push(`/channels/${id}`);
    }
  }

  function openContextMenu(event: any, id: string) {
    event.preventDefault();
    setContextMenu({ type: 'guild', top: event.pageY, left: event.pageX, visible: true, id });
  }
}

export default Guilds;
