import { useStore } from 'effector-react';
import { styled } from 'linaria/react';
import { useParams } from 'react-router-dom';
import $GuildCacheStore from '../../store/GuildCacheStore';
import { ComputedPermissions } from '../../store/models/ComputedPermissions';
import PermissionCalculator from '../../utils/PermissionCalculator';
import Member from '../sidebar/Member';
import SidebarHeader from './SidebarHeader';

const SidebarContainer = styled.div`
  display: flex;
  width: 240px;
  flex-shrink: 0;
  flex-direction: column;
  align-self: stretch;
  background: var(--background-secondary-alt)
`

interface RouteParams {
  guildId: string,
  channelId: string
}

function MemberSidebar() {
  const { guildId, channelId } = useParams<RouteParams>();
  const GuildStore = useStore($GuildCacheStore);

  return (
    <SidebarContainer>
      <SidebarHeader />
      { GuildStore[guildId]?.members && GuildStore[guildId].members?.map((memberId: string) => (
        memberId && (PermissionCalculator.getUserPermissions(guildId, channelId, memberId) & ComputedPermissions.VIEW_CHANNEL) && (
          <Member id={ memberId } />
        )
      )) }
    </SidebarContainer>
  )
}

export default MemberSidebar;
