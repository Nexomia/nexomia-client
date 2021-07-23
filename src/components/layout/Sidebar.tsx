import { styled } from 'linaria/react';

import { useParams } from 'react-router-dom';

import { useAppSelector } from '../../store/hooks';

import SidebarHeader from './SidebarHeader';

const SidebarContainer = styled.div`
  display: flex;
  width: 240px;
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

  const guilds = useAppSelector((state) => state.guilds.value);

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
        <SidebarHeader>
          <Content>{ guilds.find((guild) => guild.id === guildId)?.name }</Content>
        </SidebarHeader>
      ) }
    </SidebarContainer>
  );
}

export default Sidebar;
