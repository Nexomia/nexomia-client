import classNames from 'classnames';
import { useStore } from 'effector-react';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { Fragment, useState } from 'react';
import { RiArrowLeftLine } from 'react-icons/ri';
import { useParams } from 'react-router-dom';
import $GuildCacheStore from '../../../store/GuildCacheStore';
import $RoleCacheStore from '../../../store/RolesCacheStore';
import StyledIconCss from '../../css/StyledIconCss';
import InputField from '../../ui/InputField';
import StyledText from '../../ui/StyledText';
import Role from '../ui/Role';

const ButtonContainer = styled.div`
  display: flex;
  padding: 14px;
  cursor: pointer;
  border-radius: 4px;
  flex-grow: 1;
  flex-direction: row;
  margin: 16px 0;

  &:hover {
    background: var(--background-light);
  }
`

const IconCss = css`
  width: 20px;
  height: 20px;
  margin-right: 14px;
`

interface RouteParams {
  guildId: string
}

function RolesView() {
  const { guildId } = useParams<RouteParams>();
  const GuildsCache = useStore($GuildCacheStore);
  const RolesCache = useStore($RoleCacheStore);

  const [roleSelected, setRoleSelected] = useState('');

  return (
    <Fragment>
      { !roleSelected ? (
        <Fragment>
          <StyledText className={ css`text-align: center; margin: 32px 0` }>
            Roles help you organize your server and configure permissions for your members.
            <br />Role permissions are calculated from lowest (default) to highest role.
          </StyledText>
          { 
            GuildsCache[guildId]?.roles?.map((role) => (
              <Role
                name={ RolesCache[role].name }
                color={ RolesCache[role].color || 'var(--background-light)' }
                defaultRole={ RolesCache[role].default === true }
                onClick={ () => setRoleSelected(role) }
              /> 
            ))
          }
        </Fragment>
      ) : (
        <Fragment>
          <ButtonContainer onClick={ () => setRoleSelected('') }>
            <RiArrowLeftLine className={ classNames({ [IconCss]: true, [StyledIconCss]: true }) } />
            <StyledText className={ css`margin: 0` }>Back</StyledText>
          </ButtonContainer>
          <Role
            name={ RolesCache[roleSelected].name }
            color={ RolesCache[roleSelected].color || 'var(--background-light)' }
            defaultRole={ RolesCache[roleSelected].default === true }
            active={ true }
          />
          <StyledText className={ css`text-align: center; margin: 48px 0 24px 0; font-size: 22px; font-weight: 900` }>
            Appearance
          </StyledText>
          <StyledText className={ css`text-align: left; margin: 4px; font-size: 14px; font-weight: 900` }>
            Role Name
          </StyledText>
          <InputField className={ css`margin-top: 2px; margin-bottom: 16px` } value={ RolesCache[roleSelected].name } />
          <StyledText className={ css`text-align: left; margin: 4px; font-size: 14px; font-weight: 900` }>
            Role Color
          </StyledText>
          <InputField className={ css`margin-top: 2px; margin-bottom: 16px` } value={ RolesCache[roleSelected].color } />
          <StyledText className={ css`text-align: center; margin: 48px 0 24px 0; font-size: 22px; font-weight: 900` }>
            Permissions
          </StyledText>
          <StyledText className={ css`text-align: center; margin: 0 0 24px 0` }>
            Configure permissions carefully, forcing a lot of permissions to "allowed" state is a bad practice, though you are not restricted from doing this. Higher roles will inherit all permissions from this role and apply their overwrites to them.
          </StyledText>
        </Fragment>
      ) }
    </Fragment>
  )
}

export default RolesView;
