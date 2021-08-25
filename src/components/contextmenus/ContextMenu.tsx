import { useStore } from 'effector-react';
import { styled } from 'linaria/react';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import GuildsService from '../../services/api/guilds/guilds.service';
import MessagesService from '../../services/api/messages/messages.service';
import $ChannelCacheStore from '../../store/ChannelCacheStore';
import $ContextMenuStore, { setContextMenu } from '../../store/ContextMenuStore';
import $GuildCacheStore from '../../store/GuildCacheStore';
import { removeGuild } from '../../store/GuildStore';
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
  const GuildCache = useStore($GuildCacheStore);
  const User = useStore($UserStore);

  const [step, setStep] = useState(false);

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

              { GuildCache[id || '']?.owner_id !== User.id ? (
                <ContextTab title={ step ? t('menu.confirmation') : t('menu.leave_server') } onClick={ leaveGuild } />
              ) : null }

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
              ) && !MessageCache[id || '']?.type ? (
                <ContextTab title={ t('menu.edit') } />
              ) : null }

              { (
                PermissionCalculator.getUserPermissions(
                  ChannelCache[MessageCache[id || '']?.channel_id]?.guild_id || '',
                  MessageCache[id || '']?.channel_id || '',
                  ''
                ) &
                ComputedPermissions.MANAGE_MESSAGES
              ) && !MessageCache[id || '']?.type ? (
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

          { type === 'channel' && (
            <Fragment>
              { (
                PermissionCalculator.getUserPermissions(
                  ChannelCache[id || '']?.guild_id || '',
                  id || '',
                  ''
                ) &
                ComputedPermissions.MANAGE_CHANNELS
              ) ? (
                <ContextTab title={ step ? t('menu.confirmation') : t('menu.delete') } onClick={ deleteChannel } />
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

  async function deleteChannel() {
    if (!step) {
      setStep(true);
      setContextMenu({ lock: true });
    } else {
      await GuildsService.deleteGuildChannel(ChannelCache[id || '']?.guild_id || '', id || '');
      setStep(false);
      setContextMenu({ visible: false, lock: false });
    }
  }

  async function leaveGuild() {
    if (!step) {
      setStep(true);
      setContextMenu({ lock: true });
    } else {
      await GuildsService.leaveGuild(id || '');
      removeGuild(id || '');
      setStep(false);
      setContextMenu({ visible: false, lock: false });
    }
  }

  function pinMessage() {
    MessagesService.pinMessage(MessageCache[id || '']?.channel_id || '', id || '');
  }
}

export default ContextMenu;
