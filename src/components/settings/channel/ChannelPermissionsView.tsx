import { useStore } from 'effector-react';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import $RoleCacheStore from '../../../store/RolesCacheStore';
import LoadingPlaceholder from '../../ui/LoadingPlaceholder';
import StyledText from '../../ui/StyledText';
import PermissionEditor from '../ui/PermissionEditor';
import { useTranslation } from 'react-i18next';
import $ChannelCacheStore, { cacheChannels } from '../../../store/ChannelCacheStore';
import $GuildCacheStore from '../../../store/GuildCacheStore';
import Tab from '../../sidebar/Tab';
import { ChannelOverwrites, OverwriteType } from '../../../store/models/Channel';
import $UserCacheStore from '../../../store/UserCacheStore';
import FilledButton from '../../ui/FilledButton';
import guildsService from '../../../services/api/guilds/guilds.service';
import { setContextMenu } from '../../../store/ContextMenuStore';
import { setModalState } from '../../../store/ModalStore';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  max-width: 900px;
  width: 100%;
`

const Overwrites = styled.div`
  width: 150px;
  height: auto;
  margin: 0 8px 0 -8px;
`

const Permissions = styled.div`
  flex: 1;
`

interface RouteParams {
  guildId: string,
}


function ChannelPermissionsView() {
  const { guildId } = useParams<RouteParams>();
  const GuildsCache = useStore($GuildCacheStore);
  const ChannelsCache = useStore($ChannelCacheStore);
  const UserCache = useStore($UserCacheStore);
  const RolesCache = useStore($RoleCacheStore);

  const { t } = useTranslation(['settings']);

  const [overwriteSelected, setOverwriteSelected] = useState('');
  const [editedPermissions, setEditedPermissions] = useState<ChannelOverwrites>();
  const [permissionsWasEdited, setPermissionsWasEdited] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const defoult_role = RolesCache[GuildsCache[ChannelsCache[guildId].guild_id!].roles![GuildsCache[ChannelsCache[guildId].guild_id!].roles?.length! - 1]]

  useEffect(() => {
    if (!overwriteSelected) {
      setOverwriteSelected(ChannelsCache[guildId]?.permission_overwrites[0]?.id || defoult_role.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <LoadingPlaceholder title={ t('saving_changes') } active={ saveLoading } />
      { permissionsWasEdited && <FilledButton onClick={ () => saveOverwrite() }>{ t('save_changes') }</FilledButton> }
      <StyledText className={ css`text-align: center; margin: 48px 0 24px 0; font-size: 22px; font-weight: 900` }>
        { t('server_roles.permissions') }
      </StyledText>
      <StyledText className={ css`text-align: center; margin: 0 0 24px 0` }>
        { t('server_roles.permissions_description') }
      </StyledText>
      <Container>
      <Overwrites>
        <FilledButton
          className={ css`margin: 0 0 12px 0; width 100%;` }
          onClick={ ()=> {
            setContextMenu({ id: guildId });
            setModalState({ pickOverwrite: true });
          } }
        >{ t('channel.add_overwrite') }</FilledButton>
        { ChannelsCache[guildId] && ChannelsCache[guildId].guild_id && (
          <Fragment>
            {!!ChannelsCache[guildId].permission_overwrites.length ? ChannelsCache[guildId].permission_overwrites?.map((overwrite) => {
              if (overwrite.id !== defoult_role.id) {
                return (
                  <Tab
                    key={overwrite.id}
                    title={ overwrite.type === OverwriteType.MEMBER ? (UserCache[overwrite.id] ? `${UserCache[overwrite.id].username}#${UserCache[overwrite.id].discriminator}`: 'loading...') : `@${RolesCache[overwrite.id].name }` }
                    tabId={ overwrite.id }
                    active={ overwriteSelected === overwrite.id }
                    onClick={ () => { setOverwriteSelected(overwrite.id) } }
                  />
                );
              } else return null;
            }) : null }
            <Tab
              key={ defoult_role.id }
              title={ `@${defoult_role.name}` }
              tabId={ defoult_role.id }
              active={ overwriteSelected === defoult_role.id }
              onClick={ () => { setOverwriteSelected(defoult_role.id) }}
            />
          </Fragment>
        ) }
      </Overwrites>
        <Permissions>
          <Fragment>
            { overwriteSelected && (
              <PermissionEditor
                initialPermissions={ ChannelsCache[guildId].permission_overwrites.filter(ow => ow.id === overwriteSelected)[0] || { allow: 0, deny: 0 } }
                inherit={ true }
                onChange={ permissionsEdited }
              />
            ) }
          </Fragment>
        </Permissions>
      </Container>
    </Fragment>
  )

  function permissionsEdited(permissions: ChannelOverwrites) {
    setEditedPermissions(permissions);
    setPermissionsWasEdited(true);
  }

  async function saveOverwrite() {
    if (permissionsWasEdited && editedPermissions) {
      setSaveLoading(true);
      const response = await guildsService.patchChannelOverwrite(ChannelsCache[guildId].guild_id!, guildId, {
        id: overwriteSelected,
        allow: editedPermissions.allow,
        deny: editedPermissions.deny,
      });

      if (response) {
        const index = ChannelsCache[guildId].permission_overwrites.findIndex(ow => ow.id === response.id)
        if (index + 1) {
          ChannelsCache[guildId].permission_overwrites[index] = response
          cacheChannels([ChannelsCache[guildId]])
        } else {
          ChannelsCache[guildId].permission_overwrites.push(response)
          cacheChannels([ChannelsCache[guildId]])
        }
      }

      setSaveLoading(false);
    }

    setPermissionsWasEdited(false);
    setEditedPermissions(undefined);
  }

}

export default ChannelPermissionsView;
