import { useStore } from 'effector-react';
import { styled } from 'linaria/react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import MessagesService from '../../services/api/messages/messages.service';
import $ChannelCacheStore from '../../store/ChannelCacheStore';
import $ContextMenuStore from '../../store/ContextMenuStore';
import $MessageCacheStore from '../../store/MessageCacheStore';
import { ComputedPermissions } from '../../store/models/ComputedPermissions';
import $UserStore from '../../store/UserStore';
import PermissionCalculator from '../../utils/PermissionCalculator';
import ContextTab from './ContextTab';


const Base = styled.div`
  position: fixed;
  background: var(--background-light);
  border-radius: 4px;
  padding: 8px 8px;
  box-shadow: 0px 5px 15px 0 rgba(0, 0, 0, 0.2);
  z-index: 10;
`

function ContextMenu() {
  const { top, left, visible, type, id } = useStore($ContextMenuStore);
  const history = useHistory();
  const MessageCache = useStore($MessageCacheStore);
  const ChannelCache = useStore($ChannelCacheStore);
  const User = useStore($UserStore);

  const { t } = useTranslation(['settings']);

  return (
    <Fragment>
      { visible && (
        <Base style={{ top, left }}>
          { type === 'guild' && (
            <Fragment>
              { (
                PermissionCalculator.getUserPermissions(id || '', '', '')
                & ComputedPermissions.MANAGE_GUILD
              ) ? (
                <ContextTab title={ t('menu.settings') } onClick={ () => history.push(`/guildsettings/${id}/general`) } />
              ) : null }
              <ContextTab title={ t('menu.leave_server') } />
              <ContextTab title={ t('menu.copy_id') } />
            </Fragment>
          ) }

          { type === 'message' && (
            <Fragment>
              { (
                PermissionCalculator.getUserPermissions(
                  ChannelCache[MessageCache[id || '']?.channel_id]?.guild_id || '',
                  MessageCache[id || '']?.channel_id || '',
                  ''
                ) &
                ComputedPermissions.ADD_REACTIONS
              ) ? (
                <ContextTab title={ t('menu.add_reaction') } />
              ) : null }

              { (
                MessageCache[id || ''].author === User.id
              ) ? (
                <ContextTab title={ t('menu.edit') } />
              ) : null }

              { (
                PermissionCalculator.getUserPermissions(
                  ChannelCache[MessageCache[id || '']?.channel_id]?.guild_id || '',
                  MessageCache[id || '']?.channel_id || '',
                  ''
                ) &
                ComputedPermissions.MANAGE_MESSAGES
              ) ? (
                <ContextTab title={ t('menu.pin') } onClick={ pinMessage } />
              ) : null }

              { (
                PermissionCalculator.getUserPermissions(
                  ChannelCache[MessageCache[id || '']?.channel_id]?.guild_id || '',
                  MessageCache[id || '']?.channel_id || '',
                  ''
                ) &
                ComputedPermissions.MANAGE_MESSAGES
              ) ? (
                <ContextTab title={ t('menu.delete') } onClick={ deleteMessage } />
              ) : null }

              <ContextTab title={ t('menu.copy_id') } />
            </Fragment>
          ) }
        </Base>
      ) }
    </Fragment>
  )

  function deleteMessage() {
    MessagesService.deleteMessage(MessageCache[id || '']?.channel_id || '', id || '');
  }

  function pinMessage() {
    MessagesService.pinMessage(MessageCache[id || '']?.channel_id || '', id || '');
  }
}

export default ContextMenu;
