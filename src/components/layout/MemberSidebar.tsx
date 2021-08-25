import { useStore } from 'effector-react';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
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

  const { t } = useTranslation(['chat']);

  let renderedUsers: string[] = [];

  return (
    <SidebarContainer>
      <SidebarHeader />
      { GuildStore[guildId]?.roles && GuildStore[guildId].roles?.map((role: string) => {
        if (!RoleCacheStore[role]?.hoist) return null;

        const onlineMembers = GuildStore[guildId].members?.map((memberId) => (
          UserCacheStore[memberId].presence !== 4 &&
          RoleCacheStore[role].members.includes(memberId) &&
          !renderedUsers.includes(memberId) &&
          UserCacheStore[memberId].connected
        ));
        if (!onlineMembers?.includes(true)) return null;

        return (
          <Fragment key={ role }>
            <StyledText className={ css`margin: 8px 0 8px 16px; font-size: 14px; font-weight: 900` } key={ role }>{ RoleCacheStore[role].name !== 'everyone' ? RoleCacheStore[role].name : t('online') }</StyledText>
            {
              GuildStore[guildId].members?.sort(
                (a: string, b: string) => UserCacheStore[a]?.username?.localeCompare(UserCacheStore[b]?.username || '') || 0
              )?.map((memberId: string) => {
                if (
                  !RoleCacheStore[role].members.includes(memberId) ||
                  renderedUsers.includes(memberId) ||
                  UserCacheStore[memberId].presence === 4 ||
                  !UserCacheStore[memberId].connected
                ) return null;
                renderedUsers.push(memberId);
    
                return (
                  memberId && (PermissionCalculator.getUserPermissions(guildId, channelId, memberId) & ComputedPermissions.VIEW_CHANNEL) && (
                    <Member id={ memberId } key={ memberId } guild={ guildId } />
                  )
                )
              })
            }
          </Fragment>
        )
      }) }
      <StyledText className={ css`margin: 8px 0 8px 16px; font-size: 14px; font-weight: 900` }>{ t('offline') }</StyledText>
      {
        (
          GuildStore[guildId]?.members &&
          GuildStore[guildId].members?.sort(
            (a: string, b: string) => UserCacheStore[a]?.username?.localeCompare(UserCacheStore[b]?.username || '') || 0
          )?.map((memberId: string) => {
            if (
              renderedUsers.includes(memberId)
            ) return null;
            renderedUsers.push(memberId);

            return (
              memberId && (PermissionCalculator.getUserPermissions(guildId, channelId, memberId) & ComputedPermissions.VIEW_CHANNEL) ? (
                <Member offline id={ memberId } key={ memberId } guild={ guildId } />
              ) : null
            )
          })
        ) || null
      }
      { (renderedUsers = []) && null }
    </SidebarContainer>
  )
}

export default MemberSidebar;
