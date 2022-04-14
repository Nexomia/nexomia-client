import { useStore } from 'effector-react';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { Fragment, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import $RoleCacheStore from '../../../store/RolesCacheStore';
import LoadingPlaceholder from '../../ui/LoadingPlaceholder';
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

const OverwritesContainer = styled.div`
  flex-grow: 1;
  background: var(--background-secondary-alt);
  border-radius: 4px;
  overflow: scroll hidden;
`

const Overwrites = styled.div`
  width: 192px;
  height: auto;
  margin: 0 16px 0 0;
  display: flex;
  flex-direction: column;
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

  const navigate = useNavigate();

  const { t } = useTranslation(['settings']);

  const [overwriteSelected, setOverwriteSelected] = useState('');
  const [editedPermissions, setEditedPermissions] = useState<ChannelOverwrites>();
  const [permissionsWasEdited, setPermissionsWasEdited] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const defaultRole = RolesCache[GuildsCache[ChannelsCache[guildId]?.guild_id!]?.roles![GuildsCache[ChannelsCache[guildId]?.guild_id!]?.roles?.length! - 1]] || {};

  useEffect(() => {
    if (!overwriteSelected) {
      setOverwriteSelected(ChannelsCache[guildId]?.permission_overwrites[0]?.id || defaultRole.id);
    }

    if (!defaultRole.name) {
      navigate('/home');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <LoadingPlaceholder title={ t('saving_changes') } active={ saveLoading } />
      { permissionsWasEdited && <FilledButton onClick={ () => saveOverwrite() }>{ t('save_changes') }</FilledButton> }
      <div className={ css`height: 16px` } />
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
            <OverwritesContainer>
              <div className={ css`height: 8px` } />
              {!!ChannelsCache[guildId].permission_overwrites.length ? ChannelsCache[guildId].permission_overwrites?.map((overwrite) => {
                if (overwrite.id !== defaultRole.id) {
                  return (
                    <Tab
                      key={overwrite.id}
                      title={
                        overwrite.type === OverwriteType.MEMBER
                        ? (UserCache[overwrite.id] ? `${UserCache[overwrite.id].username}#${UserCache[overwrite.id].discriminator}`: 'loading...')
                        : `${ RolesCache[overwrite.id].name }`
                      }
                      tabId={ overwrite.id }
                      active={ overwriteSelected === overwrite.id }
                      onClick={ () => { setOverwriteSelected(overwrite.id) } }
                      dot={ RolesCache[overwrite.id].color }
                    />
                  );
                } else return null;
              }) : null }
              <Tab
                key={ defaultRole.id }
                dot={ defaultRole.color }
                title={ `${defaultRole.name}` }
                tabId={ defaultRole.id }
                active={ overwriteSelected === defaultRole.id }
                onClick={ () => { setOverwriteSelected(defaultRole.id) }}
              />
            </OverwritesContainer>
          ) }
          <div className={ css`height: 58px` } />
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
