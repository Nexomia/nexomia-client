import { styled } from 'linaria/react';
import { css } from 'linaria';

import classNames from 'classnames';

import { useNavigate, useParams } from 'react-router-dom';

import {
  RiAddFill
} from 'react-icons/ri';

import ReactFreezeframe from 'react-freezeframe';

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
import $UnreadStore from '../../store/UnreadStore';

const GuildsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 64px;
  align-self: stretch;
  background: var(--background-secondary);
  overflow: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    width: 0;
  }
`
const GuildContainer = styled.div`
  width: 64px;
  height: 56px;
  padding-left: 8px;
`

const Splitter = styled.div`
  flex-shrink: 0;
  height: 4px;
  width: calc(100% - 32px);
  margin: 0 16px 8px 16px;
  border-radius: 2px;
  background: var(--background-primary);
`

const GuildLetters = css`
  line-height: 48px;
  height: 48px;
  text-align: center;
  font-weight: 600;
  margin: 0;
`

const Indicator = styled.div`

  width: 2px;
  background: #fff;
  position: relative;
  height: 8px;
  border: 0px solid #fff;
  border-radius: 0 4px 4px 0;
  top: 50%;
  margin-top: -8px;
  margin-left: -10px;
  transition: transform .2s ease-in, border-radius .2s ease-in, border .2s ease-in;

  &.unread {
    border: 2px solid #fff;
  }

  &.selected {
    border: 2px solid #fff;
    transform: scaleY(3);
    border-radius: 0 1px 1px 0;
  }
`

interface RouteParams {
  guildId: string
}

function Guilds() {
  const navigate = useNavigate();
  const { guildId } = useParams<RouteParams>();

  const guildList = useStore($GuildStore);
  const guilds = useStore($GuildCacheStore);
  const channels = useStore($ChannelStore);
  const Unreads = useStore($UnreadStore);

  return (
    <GuildsContainer>
      <UserMenu />
      <Splitter />
      {
        guildList.map((guildListId) => (
          <GuildContainer>
            <Indicator className={ `${ guildId === guildListId ? 'selected' : undefined } ${ (Unreads[guildListId] || (guilds[guildListId].unread && !channels[guildListId])) ? 'unread' : undefined }` }/>
            <PanelButton
              onClick={ () => switchGuild(guildListId) }
              onContextMenu={ (event: any) => openContextMenu(event, guildListId) }
              key={ guildListId }
              className={ classNames({ active: guildId === guildListId }) }
            >
              { guilds[guildListId]?.icon && (
                <ReactFreezeframe className={ css`width: 100%; height: 100%` } src={ guilds[guildListId]?.icon } />
              ) }
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
            </GuildContainer>
        ))
      }
      <PanelButton className={ css`margin-bottom: 0` } onClick={ () => { setModalState({ serverCreation: true }) } }>
        <RiAddFill className={ PanelIconCss } />
      </PanelButton>
    </GuildsContainer>
  );

  function switchGuild(id: string) {
    if (channels[id] && channels[id].length) {
      navigate(`/channels/${id}/${channels[id][channels[id].indexOf(guilds[id]?.default_channel || '')] || channels[id][0]}`);
    } else {
      navigate(`/channels/${id}`);
    }
  }

  function openContextMenu(event: any, id: string) {
    event.preventDefault();
    setContextMenu({ type: 'guild', top: event.pageY, left: event.pageX, visible: true, id });
  }
}

export default Guilds;
