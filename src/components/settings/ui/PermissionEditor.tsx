import { Fragment, useState } from 'react';
import { css } from 'linaria';
import { ComputedPermissions } from '../../../store/models/ComputedPermissions';
import PermissionOverwrites from '../../../store/models/PermissionOverwrites';
import FilledButton from '../../ui/FilledButton';
import Permission from './Permission';

interface PermissionProps {
  initialPermissions: PermissionOverwrites,
  inherit: boolean,
  onChange: any
}

function PermissionEditor({ initialPermissions, inherit, onChange }: PermissionProps) {
  const [permissions, setPermissions] = useState(initialPermissions);

  return (
    <Fragment>
      <FilledButton onClick={ clearPermissions } className={ css`margin: 0 0 8px 0` }>Clear all permissions</FilledButton>
      <Permission 
        name='Administrator'
        description='Enables all permissions and bypasses channel restrictions.'
        active={ getPermissionState(ComputedPermissions.ADMINISTRATOR) }
        inherit={ inherit }
        onEnablePerm={ () => enablePermission(ComputedPermissions.ADMINISTRATOR) }
        onDisablePerm={ () => disablePermission(ComputedPermissions.ADMINISTRATOR) }
        onInheritPerm={ () => inheritPermission(ComputedPermissions.ADMINISTRATOR) }
      />
      <Permission
        name='Manage Guild'
        description='Ability to edit general guild settings.'
        active={ getPermissionState(ComputedPermissions.MANAGE_GUILD) }
        inherit={ inherit }
        onEnablePerm={ () => enablePermission(ComputedPermissions.MANAGE_GUILD) }
        onDisablePerm={ () => disablePermission(ComputedPermissions.MANAGE_GUILD) }
        onInheritPerm={ () => inheritPermission(ComputedPermissions.MANAGE_GUILD) }
      />
      <Permission
        name='Manage Roles'
        description='Ability to edit roles.'
        active={ getPermissionState(ComputedPermissions.MANAGE_ROLES) }
        inherit={ inherit }
        onEnablePerm={ () => enablePermission(ComputedPermissions.MANAGE_ROLES) }
        onDisablePerm={ () => disablePermission(ComputedPermissions.MANAGE_ROLES) }
        onInheritPerm={ () => inheritPermission(ComputedPermissions.MANAGE_ROLES) }
      />
      <Permission
        name='Manage Messages'
        description='Ability to delete and pin messages.'
        active={ getPermissionState(ComputedPermissions.MANAGE_MESSAGES) }
        inherit={ inherit }
        onEnablePerm={ () => enablePermission(ComputedPermissions.MANAGE_MESSAGES) }
        onDisablePerm={ () => disablePermission(ComputedPermissions.MANAGE_MESSAGES) }
        onInheritPerm={ () => inheritPermission(ComputedPermissions.MANAGE_MESSAGES) }
      />
      <Permission
        name='Manage Emojis'
        description='Ability to create and delete emojis.'
        active={ getPermissionState(ComputedPermissions.MANAGE_EMOJIS) }
        inherit={ inherit }
        onEnablePerm={ () => enablePermission(ComputedPermissions.MANAGE_EMOJIS) }
        onDisablePerm={ () => disablePermission(ComputedPermissions.MANAGE_EMOJIS) }
        onInheritPerm={ () => inheritPermission(ComputedPermissions.MANAGE_EMOJIS) }
      />
      <Permission
        name='View Channels'
        description='Ability to view channels.'
        active={ getPermissionState(ComputedPermissions.VIEW_CHANNEL) }
        inherit={ inherit }
        onEnablePerm={ () => enablePermission(ComputedPermissions.VIEW_CHANNEL) }
        onDisablePerm={ () => disablePermission(ComputedPermissions.VIEW_CHANNEL) }
        onInheritPerm={ () => inheritPermission(ComputedPermissions.VIEW_CHANNEL) }
      />
      <Permission
        name='Read Messages'
        description='Ability to read messages.'
        active={ getPermissionState(ComputedPermissions.READ_MESSAGES) }
        inherit={ inherit }
        onEnablePerm={ () => enablePermission(ComputedPermissions.READ_MESSAGES) }
        onDisablePerm={ () => disablePermission(ComputedPermissions.READ_MESSAGES) }
        onInheritPerm={ () => inheritPermission(ComputedPermissions.READ_MESSAGES) }
      />
      <Permission
        name='Send Messages'
        description='Ability to send messages.'
        active={ getPermissionState(ComputedPermissions.WRITE_MESSAGES) }
        inherit={ inherit }
        onEnablePerm={ () => enablePermission(ComputedPermissions.WRITE_MESSAGES) }
        onDisablePerm={ () => disablePermission(ComputedPermissions.WRITE_MESSAGES) }
        onInheritPerm={ () => inheritPermission(ComputedPermissions.WRITE_MESSAGES) }
      />
      <Permission
        name='Send Voice Messages'
        description='Ability to send voice messages.'
        active={ getPermissionState(ComputedPermissions.VOICE_MESSAGES) }
        inherit={ inherit }
        onEnablePerm={ () => enablePermission(ComputedPermissions.VOICE_MESSAGES) }
        onDisablePerm={ () => disablePermission(ComputedPermissions.VOICE_MESSAGES) }
        onInheritPerm={ () => inheritPermission(ComputedPermissions.VOICE_MESSAGES) }
      />
      <Permission
        name='Use Stickers'
        description='Ability to use stickers.'
        active={ getPermissionState(ComputedPermissions.ATTACH_STICKERS) }
        inherit={ inherit }
        onEnablePerm={ () => enablePermission(ComputedPermissions.ATTACH_STICKERS) }
        onDisablePerm={ () => disablePermission(ComputedPermissions.ATTACH_STICKERS) }
        onInheritPerm={ () => inheritPermission(ComputedPermissions.ATTACH_STICKERS) }
      />
      <Permission
        name='Add Attachments'
        description='Ability to attach files, images and music to messages.'
        active={ getPermissionState(ComputedPermissions.ATTACH_FILES) }
        inherit={ inherit }
        onEnablePerm={ () => enablePermission(ComputedPermissions.ATTACH_FILES) }
        onDisablePerm={ () => disablePermission(ComputedPermissions.ATTACH_FILES) }
        onInheritPerm={ () => inheritPermission(ComputedPermissions.ATTACH_FILES) }
      />
      <Permission
        name='Use Extended Markdown'
        description='Ability to add tables, hyperlinks to messages and write large text.'
        active={ getPermissionState(ComputedPermissions.USE_EXTENDED_MARKDOWN) }
        inherit={ inherit }
        onEnablePerm={ () => enablePermission(ComputedPermissions.USE_EXTENDED_MARKDOWN) }
        onDisablePerm={ () => disablePermission(ComputedPermissions.USE_EXTENDED_MARKDOWN) }
        onInheritPerm={ () => inheritPermission(ComputedPermissions.USE_EXTENDED_MARKDOWN) }
      />
      <Permission
        name='Forward Messages'
        description='Ability to forward messages to external servers or direct messages.'
        active={ getPermissionState(ComputedPermissions.FORWARD_MESSAGES_FROM_SERVER) }
        inherit={ inherit }
        onEnablePerm={ () => enablePermission(ComputedPermissions.FORWARD_MESSAGES_FROM_SERVER) }
        onDisablePerm={ () => disablePermission(ComputedPermissions.FORWARD_MESSAGES_FROM_SERVER) }
        onInheritPerm={ () => inheritPermission(ComputedPermissions.FORWARD_MESSAGES_FROM_SERVER) }
      />
      <Permission
        name='Change Nickname'
        description='Ability to set a custom nickname.'
        active={ getPermissionState(ComputedPermissions.CHANGE_SELF_NICKNAME) }
        inherit={ inherit }
        onEnablePerm={ () => enablePermission(ComputedPermissions.CHANGE_SELF_NICKNAME) }
        onDisablePerm={ () => disablePermission(ComputedPermissions.CHANGE_SELF_NICKNAME) }
        onInheritPerm={ () => inheritPermission(ComputedPermissions.CHANGE_SELF_NICKNAME) }
      />
      <Permission
        name='Change Member Nicknames'
        description='Ability to change nicknames of all members'
        active={ getPermissionState(ComputedPermissions.CHANGE_MEMBER_NICKNAMES) }
        inherit={ inherit }
        onEnablePerm={ () => enablePermission(ComputedPermissions.CHANGE_MEMBER_NICKNAMES) }
        onDisablePerm={ () => disablePermission(ComputedPermissions.CHANGE_MEMBER_NICKNAMES) }
        onInheritPerm={ () => inheritPermission(ComputedPermissions.CHANGE_MEMBER_NICKNAMES) }
      />
      <Permission
        name='Add Reactions'
        description='Ability to add reactions.'
        active={ getPermissionState(ComputedPermissions.ADD_REACTIONS) }
        inherit={ inherit }
        onEnablePerm={ () => enablePermission(ComputedPermissions.ADD_REACTIONS) }
        onDisablePerm={ () => disablePermission(ComputedPermissions.ADD_REACTIONS) }
        onInheritPerm={ () => inheritPermission(ComputedPermissions.ADD_REACTIONS) }
      />
      <Permission
        name='Add External Reactions'
        description='Ability to add reactions from other servers.'
        active={ getPermissionState(ComputedPermissions.ADD_EXTERNAL_REACTIONS) }
        inherit={ inherit }
        onEnablePerm={ () => enablePermission(ComputedPermissions.ADD_EXTERNAL_REACTIONS) }
        onDisablePerm={ () => disablePermission(ComputedPermissions.ADD_EXTERNAL_REACTIONS) }
        onInheritPerm={ () => inheritPermission(ComputedPermissions.ADD_EXTERNAL_REACTIONS) }
      />
      <Permission
        name='Delete Multiple Messages'
        description='Ability to delete multiple messages (it is also called purging).'
        active={ getPermissionState(ComputedPermissions.BULK_DELETE) }
        inherit={ inherit }
        onEnablePerm={ () => enablePermission(ComputedPermissions.BULK_DELETE) }
        onDisablePerm={ () => disablePermission(ComputedPermissions.BULK_DELETE) }
        onInheritPerm={ () => inheritPermission(ComputedPermissions.BULK_DELETE) }
      />
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
