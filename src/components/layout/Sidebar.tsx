import { styled } from 'linaria/react';
import { Fragment } from 'react';
import { useParams } from 'react-router-dom';

import { useStore } from 'effector-react';
import $GuildStore from '../../store/GuildStore';
import Tab from '../sidebar/Tab';

import { BiHash } from 'react-icons/bi';
import { RiVolumeDownFill } from 'react-icons/ri';

import SidebarHeader from './SidebarHeader';

const SidebarContainer = styled.div`
  display: flex;
  width: 240px;
  flex-direction: column;
  align-self: stretch;
  background: var(--background-secondary-alt)
`

const Content = styled.div`
  display: flex;
  align-self: center;
  color: var(--text-primary);
  font-weight: 900;
  font-size: 18px;
  padding: 0 16px;
  user-select: none;
`

interface RouteParams {
  guildId: string
}

interface SidebarProps {
  type?: string
}

function Sidebar({ type = 'channels' }: SidebarProps) {
  const { guildId } = useParams<RouteParams>();

  const guilds = useStore($GuildStore);

  return (
    <SidebarContainer>
      { guildId === '@me' && type === 'channels' && (
        <SidebarHeader>
          <Content>Direct Messages</Content>
        </SidebarHeader>
      ) }

      { guildId === '@home' && type === 'channels' && (
        <SidebarHeader>
          <Content>Home</Content>
        </SidebarHeader>
      ) }

      { guildId !== '@me' && guildId !== '@home' && type === 'channels' && (
        <Fragment>
          <SidebarHeader>
            <Content>{ guilds.find((guild) => guild.id === guildId)?.name }</Content>
          </SidebarHeader>
          <Tab Icon={ BiHash } title="general" />
          <Tab Icon={ BiHash } title="not general" />
          <Tab Icon={ RiVolumeDownFill } title="voice" />
        </Fragment>
      ) }
    </SidebarContainer>
  );
}

export default Sidebar;
