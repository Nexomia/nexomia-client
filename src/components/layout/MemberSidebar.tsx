import { useStore } from 'effector-react';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { Fragment } from 'react';
import { useParams } from 'react-router-dom';
import $GuildCacheStore from '../../store/GuildCacheStore';
import { ComputedPermissions } from '../../store/models/ComputedPermissions';
import $RoleCacheStore from '../../store/RolesCacheStore';
import $UserCacheStore from '../../store/UserCacheStore';
import PermissionCalculator from '../../utils/PermissionCalculator';
import Member from '../sidebar/Member';
import StyledText from '../ui/StyledText';
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
  const RoleCacheStore = useStore($RoleCacheStore);
  const UserCacheStore = useStore($UserCacheStore);

  let renderedUsers: string[] = [];

  return (
    <SidebarContainer>
      <SidebarHeader />
      { GuildStore[guildId]?.roles && GuildStore[guildId].roles?.map((role: string) => {
        if (!RoleCacheStore[role].hoist) return null;

        return (
          <Fragment>
            <StyledText className={ css`margin: 8px 0 8px 16px; font-size: 14px;` }>{ RoleCacheStore[role].name !== 'everyone' ? RoleCacheStore[role].name : 'Online' }</StyledText>
            {
              GuildStore[guildId].members?.map((memberId: string) => {
                if (
                  !RoleCacheStore[role].members.includes(memberId) ||
                  renderedUsers.includes(memberId) ||
                  UserCacheStore[memberId].presence === 4
                ) return;
                renderedUsers.push(memberId);
    
                return (
                  memberId && (PermissionCalculator.getUserPermissions(guildId, channelId, memberId) & ComputedPermissions.VIEW_CHANNEL) && (
                    <Member id={ memberId } color={ RoleCacheStore[role].color || 'var(--text-primary)' } />
                  )
                )
              })
            }
          </Fragment>
        )
      }) }
      <StyledText className={ css`margin: 8px 0 8px 16px; font-size: 14px;` }>Offline</StyledText>
      {
        GuildStore[guildId]?.members && GuildStore[guildId].members?.map((memberId: string) => {
          if (
            renderedUsers.includes(memberId)
          ) return;
          renderedUsers.push(memberId);

          return (
            memberId && (PermissionCalculator.getUserPermissions(guildId, channelId, memberId) & ComputedPermissions.VIEW_CHANNEL) && (
              <Member id={ memberId } color={ 'var(--text-primary)' } />
            )
          )
        })
      }
    </SidebarContainer>
  )
}

export default MemberSidebar;
