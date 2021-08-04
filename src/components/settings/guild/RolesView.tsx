import classNames from 'classnames';
import { useStore } from 'effector-react';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { RiArrowLeftLine, RiArrowRightSLine } from 'react-icons/ri';
import { useParams } from 'react-router-dom';
import { List, arrayMove } from 'react-movable';
import RolesService from '../../../services/api/roles/roles.service';
import $GuildCacheStore, { setGuildRoles } from '../../../store/GuildCacheStore';
import PermissionOverwrites from '../../../store/models/PermissionOverwrites';
import $RoleCacheStore, { cacheRoles, updateRole } from '../../../store/RolesCacheStore';
import StyledIconCss from '../../css/StyledIconCss';
import InputField from '../../ui/InputField';
import LoadingPlaceholder from '../../ui/LoadingPlaceholder';
import StyledText from '../../ui/StyledText';
import PermissionEditor from '../ui/PermissionEditor';
import Role from '../ui/Role';
import PermissionCalculator from '../../../utils/PermissionCalculator';
import { ComputedPermissions } from '../../../store/models/ComputedPermissions';

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

const ColorDot = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-right: 16px;
`

const Container = styled.div`
  padding: 16px;
  border-radius: 4px;
  background: var(--background-secondary-alt);
  margin-bottom: 4px;
  display: flex;
  flex-grow: 1;
  flex-direction: row;
  align-items: center;

  &:hover {
    cursor: pointer;
    background: var(--background-secondary);
  }
`

const Splitter = styled.div`
  flex-grow: 1;
`

const DefaultIconCss = css`
  padding: 2px 4px;
  border-radius: 2px;
  background: var(--accent);
  margin: 0;
  font-size: 14px;
`

const RoleIconCss = css`
  width: 20px;
  height: 20px;
  margin-left: 16px;
`

interface RouteParams {
  guildId: string
}

function RolesView() {
  const { guildId } = useParams<RouteParams>();
  const GuildsCache = useStore($GuildCacheStore);
  const RolesCache = useStore($RoleCacheStore);

  const [roleList, setRoleList] = useState<string[]>([]);
  
  useEffect(() => {
    setRoleList([ ...(GuildsCache[guildId]?.roles || []) ]);
    setCanMove(
      !!(
        PermissionCalculator.getUserPermissions(guildId, '', '')
        & (ComputedPermissions.MANAGE_ROLES | ComputedPermissions.ADMINISTRATOR)
      )
    );
  }, []);

  useEffect(() => {
    setRoleList([ ...(GuildsCache[guildId]?.roles || []) ]);
  }, [GuildsCache]);

  const [canMove, setCanMove] = useState(false);

  const [roleSelected, setRoleSelected] = useState('');
  const [editedPermissions, setEditedPermissions] = useState<PermissionOverwrites>({ allow: 0, deny: 0 });
  const [permissionsWasEdited, setPermissionsWasEdited] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [roleName, setRoleName] = useState('');
  const [roleColor, setRoleColor] = useState('');

  return (
    <Fragment>
      <LoadingPlaceholder title="Saving Changes..." active={ saveLoading } />
      { !roleSelected ? (
        <Fragment>
          <StyledText className={ css`text-align: center; margin: 32px 0` }>
            Roles help you organize your server and configure permissions for your members.
            <br />Role permissions are calculated from lowest (default) to highest role.
          </StyledText>
          { 
            <List
              lockVertically
              values={ roleList }
              onChange={ 
                ({ oldIndex, newIndex }) => {
                  const updatedRoleList = arrayMove(roleList, oldIndex, newIndex);
                  updateRolePosition(newIndex, updatedRoleList);
                  setRoleList(updatedRoleList);
                }
              }
              renderList={ ({ children, props }) => <div { ...props }>{ children }</div> }
              renderItem={ ({ value, props }) =>
                <Container { ...props } onClick={ () => selectRole(value) }>
                  <ColorDot
                    style={{ background: RolesCache[value].color || 'var(--text-primary)' }}
                  >
                    <div data-movable-handle style={{ 
                      width: canMove && !RolesCache[value].default ? '100%' : '0px',
                      height: canMove && !RolesCache[value].default ? '100%' : '0px',
                      cursor: 'grab'
                    }} />
                  </ColorDot>
                  <StyledText className={ css`margin: 0; font-weight: 900` }>{ RolesCache[value].name }</StyledText>
                  <Splitter />
                  { RolesCache[value].default && (<StyledText className={ DefaultIconCss }>DEFAULT</StyledText>) }
                  <RiArrowRightSLine className={ classNames({ [StyledIconCss]: true, [RoleIconCss]: true }) } />
                </Container>
              }
            />
          }
        </Fragment>
      ) : (
        <Fragment>
          <ButtonContainer onClick={ () => goBack() }>
            <RiArrowLeftLine className={ classNames({ [IconCss]: true, [StyledIconCss]: true }) } />
            <StyledText className={ css`margin: 0; font-weight: 900` }>
              { !permissionsWasEdited ? 'Back' : 'Save & Go Back' }
            </StyledText>
          </ButtonContainer>
          <Role
            name={ roleName }
            color={ roleColor || 'var(--background-light)' }
            defaultRole={ RolesCache[roleSelected].default === true }
            active={ true }
          />
          <StyledText className={ css`text-align: center; margin: 48px 0 24px 0; font-size: 22px; font-weight: 900` }>
            Appearance
          </StyledText>
          <StyledText className={ css`text-align: left; margin: 4px; font-size: 14px; font-weight: 900` }>
            Role Name
          </StyledText>
          <InputField
            className={ css`margin-top: 2px; margin-bottom: 16px` }
            defaultValue={ RolesCache[roleSelected].name }
            onChange={ (event: ChangeEvent<HTMLInputElement>) => { setRoleName(event.target.value); setPermissionsWasEdited(true) } }
          />
          <StyledText className={ css`text-align: left; margin: 4px; font-size: 14px; font-weight: 900` }>
            Role Color
          </StyledText>
          <InputField
            className={ css`margin-top: 2px; margin-bottom: 16px` }
            defaultValue={ RolesCache[roleSelected].color }
            onChange={ (event: ChangeEvent<HTMLInputElement>) => { setRoleColor(event.target.value); setPermissionsWasEdited(true) } }
          />
          <StyledText className={ css`text-align: center; margin: 48px 0 24px 0; font-size: 22px; font-weight: 900` }>
            Permissions
          </StyledText>
          <StyledText className={ css`text-align: center; margin: 0 0 24px 0` }>
            Configure permissions carefully, forcing a lot of permissions to "allowed" state is a bad practice, though you are not restricted from doing this. Higher roles will inherit all permissions from this role and apply their overwrites to them.
          </StyledText>
          
          <PermissionEditor
            initialPermissions={ RolesCache[roleSelected].permissions }
            inherit={ !RolesCache[roleSelected].default }
            onChange={ permissionsEdited }
          />
        </Fragment>
      ) }
    </Fragment>
  )

  function permissionsEdited(permissions: PermissionOverwrites) {
    setEditedPermissions(permissions);
    setPermissionsWasEdited(true);
  }

  function selectRole(role: string) {
    setRoleName(RolesCache[role].name);
    setRoleColor(RolesCache[role].color || '');
    setRoleSelected(role);
  }

  async function goBack() {
    if (permissionsWasEdited) {
      setSaveLoading(true);

      const response = await RolesService.patchRole(guildId, roleSelected, {
        name: roleName,
        color: roleColor,
        permissions: editedPermissions
      });

      if (response) {
        cacheRoles([response]);
      }

      setSaveLoading(false);
    }

    setPermissionsWasEdited(false);
    setRoleSelected('');
  }

  async function updateRolePosition(index: number, updatedRoleList: string[]) {
    setGuildRoles({ guild: guildId, roles: updatedRoleList });
    await RolesService.patchRole(guildId, updatedRoleList[index], { position: index + 1 });
  }
}

export default RolesView;
