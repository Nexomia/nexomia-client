import { useStore } from 'effector-react';
import { styled } from 'linaria/react';
import { Fragment } from 'react';
import { useHistory } from 'react-router';
import MessagesService from '../../services/api/messages/messages.service';
import $ChannelCacheStore from '../../store/ChannelCacheStore';
import $ContextMenuStore from '../../store/ContextMenuStore';
import $MessageCacheStore from '../../store/MessageCacheStore';
import { ComputedPermissions } from '../../store/models/ComputedPermissions';
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
                <ContextTab title='Settings' onClick={ () => history.push(`/guildsettings/${id}/general`) } />
              ) : null }
              <ContextTab title='Leave Server' />
              <ContextTab title='Copy ID' />
            </Fragment>
          ) }

          { type === 'message' && (
            <Fragment>
              <ContextTab title='Add Reaction' />
              <ContextTab title='Edit' />
              { (
                PermissionCalculator.getUserPermissions(
                  ChannelCache[MessageCache[id || '']?.channel_id]?.guild_id || '',
                  MessageCache[id || '']?.channel_id || '',
                  ''
                ) &
                ComputedPermissions.MANAGE_MESSAGES
              ) ? (
                <ContextTab title='Delete' onClick={ deleteMessage } />
              ) : null }
              <ContextTab title='Copy ID' />
            </Fragment>
          ) }
        </Base>
      ) }
    </Fragment>
  )

  function deleteMessage() {
    MessagesService.deleteMessage(MessageCache[id || '']?.channel_id || '', id || '');
  }
}

export default ContextMenu;
