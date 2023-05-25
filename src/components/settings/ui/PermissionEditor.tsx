import { Fragment, useEffect, useState } from 'react';
import { css } from 'linaria';
import { ComputedPermissions } from '../../../store/models/ComputedPermissions';
import PermissionOverwrites from '../../../store/models/PermissionOverwrites';
import FilledButton from '../../ui/FilledButton';
import Permission from './Permission';
import { useTranslation } from 'react-i18next';

interface PermissionProps {
  initialPermissions: PermissionOverwrites,
  inherit: boolean,
  guild?: boolean,
  category?: boolean,
  channel?: boolean,
  onChange: any,
}

function PermissionEditor({ initialPermissions, inherit, onChange, guild, category, channel }: PermissionProps) {
  const [permissions, setPermissions] = useState(initialPermissions);

  const { t } = useTranslation(['settings']);
    useEffect(() => {
      setPermissions(initialPermissions); 
      
    }, [initialPermissions]);
  return (
    <Fragment>
      <FilledButton onClick={ clearPermissions } className={ css`margin: 0 0 8px 0; width: 100%;` }>{ t('server_permissions.action_clear_permissions') }</FilledButton>
      {guild && <Permission 
        name={ t('server_permissions.administrator') }
        description={ t('server_permissions.administrator_description') }
        active={ getPermissionState(ComputedPermissions.ADMINISTRATOR) }
        inherit={ inherit }
        onEnablePerm={ () => enablePermission(ComputedPermissions.ADMINISTRATOR) }
        onDisablePerm={ () => disablePermission(ComputedPermissions.ADMINISTRATOR) }
        onInheritPerm={ () => inheritPermission(ComputedPermissions.ADMINISTRATOR) }
      />}
      { guild && <Permission
        name={ t('server_permissions.manage_guild') }
        description={ t('server_permissions.manage_guild_description') }
        active={ getPermissionState(ComputedPermissions.MANAGE_GUILD) }
        inherit={ inherit }
        onEnablePerm={ () => enablePermission(ComputedPermissions.MANAGE_GUILD) }
        onDisablePerm={ () => disablePermission(ComputedPermissions.MANAGE_GUILD) }
        onInheritPerm={ () => inheritPermission(ComputedPermissions.MANAGE_GUILD) }
      />}
      { guild && <Permission
        name={ t('server_permissions.manage_roles') }
        description={ t('server_permissions.manage_roles_description') }
        active={ getPermissionState(ComputedPermissions.MANAGE_ROLES) }
        inherit={ inherit }
        onEnablePerm={ () => enablePermission(ComputedPermissions.MANAGE_ROLES) }
        onDisablePerm={ () => disablePermission(ComputedPermissions.MANAGE_ROLES) }
        onInheritPerm={ () => inheritPermission(ComputedPermissions.MANAGE_ROLES) }
      />}
      { guild && <Permission
        name={ t('server_permissions.manage_messages') }
        description={ t('server_permissions.manage_messages_description') }
        active={ getPermissionState(ComputedPermissions.MANAGE_MESSAGES) }
        inherit={ inherit }
        onEnablePerm={ () => enablePermission(ComputedPermissions.MANAGE_MESSAGES) }
        onDisablePerm={ () => disablePermission(ComputedPermissions.MANAGE_MESSAGES) }
        onInheritPerm={ () => inheritPermission(ComputedPermissions.MANAGE_MESSAGES) }
      />}
      {guild && <Permission
        name={ t('server_permissions.manage_emojis') }
        description={ t('server_permissions.manage_emojis_description') }
        active={ getPermissionState(ComputedPermissions.MANAGE_EMOJIS) }
        inherit={ inherit }
        onEnablePerm={ () => enablePermission(ComputedPermissions.MANAGE_EMOJIS) }
        onDisablePerm={ () => disablePermission(ComputedPermissions.MANAGE_EMOJIS) }
        onInheritPerm={ () => inheritPermission(ComputedPermissions.MANAGE_EMOJIS) }
      />}
      <Permission
        name={ t('server_permissions.view_channels') }
        description={ t('server_permissions.view_channels_description') }
        active={ getPermissionState(ComputedPermissions.VIEW_CHANNEL) }
        inherit={ inherit }
        onEnablePerm={ () => enablePermission(ComputedPermissions.VIEW_CHANNEL) }
        onDisablePerm={ () => disablePermission(ComputedPermissions.VIEW_CHANNEL) }
        onInheritPerm={ () => inheritPermission(ComputedPermissions.VIEW_CHANNEL) }
      />
      <Permission
        name={ t('server_permissions.read_messages') }
        description={ t('server_permissions.read_messages_description') }
        active={ getPermissionState(ComputedPermissions.READ_MESSAGES) }
        inherit={ inherit }
        onEnablePerm={ () => enablePermission(ComputedPermissions.READ_MESSAGES) }
        onDisablePerm={ () => disablePermission(ComputedPermissions.READ_MESSAGES) }
        onInheritPerm={ () => inheritPermission(ComputedPermissions.READ_MESSAGES) }
      />
      <Permission
        name={ t('server_permissions.send_messages') }
        description={ t('server_permissions.send_messages_description') }
        active={ getPermissionState(ComputedPermissions.WRITE_MESSAGES) }
        inherit={ inherit }
        onEnablePerm={ () => enablePermission(ComputedPermissions.WRITE_MESSAGES) }
        onDisablePerm={ () => disablePermission(ComputedPermissions.WRITE_MESSAGES) }
        onInheritPerm={ () => inheritPermission(ComputedPermissions.WRITE_MESSAGES) }
      />
      <Permission
        name={ t('server_permissions.send_voice_messages') }
        description={ t('server_permissions.send_voice_messages_description') }
        active={ getPermissionState(ComputedPermissions.VOICE_MESSAGES) }
        inherit={ inherit }
        onEnablePerm={ () => enablePermission(ComputedPermissions.VOICE_MESSAGES) }
        onDisablePerm={ () => disablePermission(ComputedPermissions.VOICE_MESSAGES) }
        onInheritPerm={ () => inheritPermission(ComputedPermissions.VOICE_MESSAGES) }
      />
      <Permission
        name={ t('server_permissions.use_stickers') }
        description={ t('server_permissions.use_stickers_description') }
        active={ getPermissionState(ComputedPermissions.ATTACH_STICKERS) }
        inherit={ inherit }
        onEnablePerm={ () => enablePermission(ComputedPermissions.ATTACH_STICKERS) }
        onDisablePerm={ () => disablePermission(ComputedPermissions.ATTACH_STICKERS) }
        onInheritPerm={ () => inheritPermission(ComputedPermissions.ATTACH_STICKERS) }
      />
      <Permission
        name={ t('server_permissions.add_attachments') }
        description={ t('server_permissions.add_attachments_description') }
        active={ getPermissionState(ComputedPermissions.ATTACH_FILES) }
        inherit={ inherit }
        onEnablePerm={ () => enablePermission(ComputedPermissions.ATTACH_FILES) }
        onDisablePerm={ () => disablePermission(ComputedPermissions.ATTACH_FILES) }
        onInheritPerm={ () => inheritPermission(ComputedPermissions.ATTACH_FILES) }
      />
      <Permission
        name={ t('server_permissions.use_extended_markdown') }
        description={ t('server_permissions.use_extended_markdown_description') }
        active={ getPermissionState(ComputedPermissions.USE_EXTENDED_MARKDOWN) }
        inherit={ inherit }
        onEnablePerm={ () => enablePermission(ComputedPermissions.USE_EXTENDED_MARKDOWN) }
        onDisablePerm={ () => disablePermission(ComputedPermissions.USE_EXTENDED_MARKDOWN) }
        onInheritPerm={ () => inheritPermission(ComputedPermissions.USE_EXTENDED_MARKDOWN) }
      />
      <Permission
        name={ t('server_permissions.forward_messages') }
        description={ t('server_permissions.forward_messages_description') }
        active={ getPermissionState(ComputedPermissions.FORWARD_MESSAGES_FROM_SERVER) }
        inherit={ inherit }
        onEnablePerm={ () => enablePermission(ComputedPermissions.FORWARD_MESSAGES_FROM_SERVER) }
        onDisablePerm={ () => disablePermission(ComputedPermissions.FORWARD_MESSAGES_FROM_SERVER) }
        onInheritPerm={ () => inheritPermission(ComputedPermissions.FORWARD_MESSAGES_FROM_SERVER) }
      />
      { guild && <Permission
        name={ t('server_permissions.change_nickname') }
        description={ t('server_permissions.change_nickname_description') }
        active={ getPermissionState(ComputedPermissions.CHANGE_SELF_NICKNAME) }
        inherit={ inherit }
        onEnablePerm={ () => enablePermission(ComputedPermissions.CHANGE_SELF_NICKNAME) }
        onDisablePerm={ () => disablePermission(ComputedPermissions.CHANGE_SELF_NICKNAME) }
        onInheritPerm={ () => inheritPermission(ComputedPermissions.CHANGE_SELF_NICKNAME) }
      />}
      { guild && <Permission
        name={ t('server_permissions.change_member_nicknames') }
        description={ t('server_permissions.change_member_nicknames_description') }
        active={ getPermissionState(ComputedPermissions.CHANGE_MEMBER_NICKNAMES) }
        inherit={ inherit }
        onEnablePerm={ () => enablePermission(ComputedPermissions.CHANGE_MEMBER_NICKNAMES) }
        onDisablePerm={ () => disablePermission(ComputedPermissions.CHANGE_MEMBER_NICKNAMES) }
        onInheritPerm={ () => inheritPermission(ComputedPermissions.CHANGE_MEMBER_NICKNAMES) }
      />}
      <Permission
        name={ t('server_permissions.add_reactions') }
        description={ t('server_permissions.add_reactions_description') }
        active={ getPermissionState(ComputedPermissions.ADD_REACTIONS) }
        inherit={ inherit }
        onEnablePerm={ () => enablePermission(ComputedPermissions.ADD_REACTIONS) }
        onDisablePerm={ () => disablePermission(ComputedPermissions.ADD_REACTIONS) }
        onInheritPerm={ () => inheritPermission(ComputedPermissions.ADD_REACTIONS) }
      />
      <Permission
        name={ t('server_permissions.add_external_reactions') }
        description={ t('server_permissions.add_external_reactions_description') }
        active={ getPermissionState(ComputedPermissions.ADD_EXTERNAL_REACTIONS) }
        inherit={ inherit }
        onEnablePerm={ () => enablePermission(ComputedPermissions.ADD_EXTERNAL_REACTIONS) }
        onDisablePerm={ () => disablePermission(ComputedPermissions.ADD_EXTERNAL_REACTIONS) }
        onInheritPerm={ () => inheritPermission(ComputedPermissions.ADD_EXTERNAL_REACTIONS) }
      />
      { guild && <Permission
        name={ t('server_permissions.delete_multiple_messages') }
        description={ t('server_permissions.delete_multiple_messages_description') }
        active={ getPermissionState(ComputedPermissions.BULK_DELETE) }
        inherit={ inherit }
        onEnablePerm={ () => enablePermission(ComputedPermissions.BULK_DELETE) }
        onDisablePerm={ () => disablePermission(ComputedPermissions.BULK_DELETE) }
        onInheritPerm={ () => inheritPermission(ComputedPermissions.BULK_DELETE) }
      />}
      <div className={ css`height: 58px` } />
    </Fragment>
  )

  function getPermissionState(compare: number) {
    return permissions?.allow & compare
      ? 2
      : permissions?.deny & compare
      ? 0
      : 1
  }

  function enablePermission(compare: number) {
    const editedPermissions = { allow: permissions?.allow | compare, deny: permissions?.deny & ~compare };
    setPermissions(editedPermissions);
    onChange(editedPermissions);
  }

  function disablePermission(compare: number) {
    const editedPermissions = { allow: permissions?.allow & ~compare, deny: permissions?.deny | compare };
    setPermissions(editedPermissions);
    onChange(editedPermissions);
  }

  function inheritPermission(compare: number) {
    const editedPermissions = { allow: permissions?.allow & ~compare, deny: permissions?.deny & ~compare };
    setPermissions(editedPermissions);
    onChange(editedPermissions);
  }

  function clearPermissions() {
    const editedPermissions = { allow: 0, deny: 0 };
    setPermissions(editedPermissions);
    onChange(editedPermissions);
  }
}

export default PermissionEditor;
