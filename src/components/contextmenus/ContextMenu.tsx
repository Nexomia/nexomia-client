import { useStore } from 'effector-react';
import { styled } from 'linaria/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import channelsService from '../../services/api/channels/channels.service';
import GuildsService from '../../services/api/guilds/guilds.service';
import MessagesService from '../../services/api/messages/messages.service';
import $ChannelCacheStore from '../../store/ChannelCacheStore';
import $ContextMenuStore, { setContextMenu } from '../../store/ContextMenuStore';
import $GuildCacheStore from '../../store/GuildCacheStore';
import { removeGuild } from '../../store/GuildStore';
import { addForwards } from '../../store/InputStore';
import $MessageCacheStore from '../../store/MessageCacheStore';
import { setModalState } from '../../store/ModalStore';
import { ComputedPermissions } from '../../store/models/ComputedPermissions';
import $UnreadStore, { removeUnread } from '../../store/UnreadStore';
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

interface RouteParams {
  path: string,
  guildId: string,
  channelId: string
}

function ContextMenu() {
  const { guildId } = useParams<RouteParams>();
  const ContextMenu = useStore($ContextMenuStore)
  const { top, left, visible, type, id } = ContextMenu;
  const navigate = useNavigate();
  const MessageCache = useStore($MessageCacheStore);
  const ChannelCache = useStore($ChannelCacheStore);
  const GuildCache = useStore($GuildCacheStore);
  const User = useStore($UserStore);
  const Unreads = useStore($UnreadStore);

  useEffect(() => {
    if (!visible) {
      setStep(false);
      setBlockVisible(false);
    } else if (baseRef.current) {
      if (baseRef.current.clientHeight + (top || 0) > window.innerHeight - 16) {
        setOffset((baseRef.current.clientHeight + (top || 0)) - (window.innerHeight - 16));
      } else {
        setOffset(0);
      }
      setTimeout(() => setBlockVisible(true), 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ContextMenu]);

  const [step, setStep] = useState(false);
  const [blockVisible, setBlockVisible] = useState(false);
  const [offset, setOffset] = useState(0);

  const baseRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation(['settings']);

  return (
    <Fragment>
      { visible && id && id !== 'new' && (
        <Base style={{ top, left, opacity: blockVisible ? 1 : 0, transform: `translateY(-${offset}px)` }} ref={ baseRef }>
          { type === 'guild' && (
            <Fragment>
              { (
                PermissionCalculator.getUserPermissions(id || '', '', '')
                & ComputedPermissions.MANAGE_GUILD
              ) ? (
                <ContextTab title={ t('menu.settings')! } onClick={ () => navigate(`/app/guildsettings/${id}/general`) } />
              ) : null }

              { (
                PermissionCalculator.getUserPermissions(id || '', '', '')
                & ComputedPermissions.CREATE_INVITES
              ) ? (
                <ContextTab title={ t('server_invites.invite_create')! } onClick={ () => setModalState({ inviteCreation: true }) } />
              ) : null }

              { GuildCache[id || '']?.owner_id !== User.id ? (
                <ContextTab title={ step ? t('menu.confirmation')! : t('menu.leave_server')! } onClick={ leaveGuild } />
              ) : null }

              <ContextTab title={ t('menu.copy_id')! } onClick={ copyId } />
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
              ) || ChannelCache[MessageCache[id || '']?.channel_id]?.recipients?.length ? (
                <ContextTab title={ t('menu.add_reaction')! } />
              ) : null }

              { (
                PermissionCalculator.getUserPermissions(
                  ChannelCache[MessageCache[id || '']?.channel_id]?.guild_id || '',
                  MessageCache[id || '']?.channel_id || '',
                  ''
                ) &
                ComputedPermissions.WRITE_MESSAGES
              ) || ChannelCache[MessageCache[id || '']?.channel_id]?.recipients?.length ? (
                <ContextTab title={ t('menu.reply')! } onClick={ addReply } />
              ) : null }

              { (
                MessageCache[id || ''].author === User.id
              ) && !MessageCache[id || '']?.type ? (
                <ContextTab title={ t('menu.edit')! } />
              ) : null }

              { ((
                PermissionCalculator.getUserPermissions(
                  ChannelCache[MessageCache[id || '']?.channel_id]?.guild_id || '',
                  MessageCache[id || '']?.channel_id || '',
                  ''
                ) &
                ComputedPermissions.MANAGE_MESSAGES
              ) && !MessageCache[id || '']?.type) || ChannelCache[MessageCache[id || '']?.channel_id]?.recipients?.length ? (
                <ContextTab
                  title={ ChannelCache[MessageCache[id || '']?.channel_id].pinned_messages_ids?.includes(id || '  ')
                    ? t('menu.unpin')!
                    : t('menu.pin')!
                  }
                  onClick={ ChannelCache[MessageCache[id || '']?.channel_id].pinned_messages_ids?.includes(id || '  ')
                    ? unpinMessage
                    : pinMessage
                  } />
              ) : null }

              { (
                PermissionCalculator.getUserPermissions(
                  ChannelCache[MessageCache[id || '']?.channel_id]?.guild_id || '',
                  MessageCache[id || '']?.channel_id || '',
                  ''
                ) &
                ComputedPermissions.MANAGE_MESSAGES
              ) ||
              ChannelCache[MessageCache[id || '']?.channel_id]?.recipients?.length ||
              MessageCache[id || '']?.author === User.id ? (
                <ContextTab title={ t('menu.delete')! } onClick={ deleteMessage } />
              ) : null }

              { (
                PermissionCalculator.getUserPermissions(
                  ChannelCache[MessageCache[id || '']?.channel_id]?.guild_id || '',
                  MessageCache[id || '']?.channel_id || '',
                  ''
                ) & (
                  ComputedPermissions.OWNER |
                  ComputedPermissions.ADMINISTRATOR |
                  ComputedPermissions.MANAGE_MEMBERS
                )
              ) &&
              MessageCache[id || '']?.author !== User.id ? (
                <ContextTab title={ t('menu.ban')! } onClick={ () => {
                  setContextMenu({ id: guildId, data: { user_id: MessageCache[id || ''].author } });
                  setModalState({ guildBanUser: true });
                } } />
              ) : null }

              <ContextTab title={ t('menu.copy_id')! } onClick={ copyId } />
            </Fragment>
          ) }

          { type === 'channel' && (
            <Fragment>
              { (Unreads[ChannelCache[id].guild_id || '@me']?.filter(ch => ch.channel_id === id).length) ? (
                <ContextTab title={ t('menu.set_read')! } onClick={ markChannelAsRead } />
              ) : null }

              { (
                PermissionCalculator.getUserPermissions(
                  ChannelCache[id || '']?.guild_id || '',
                  id || '',
                  ''
                ) & (
                  ComputedPermissions.OWNER |
                  ComputedPermissions.ADMINISTRATOR |
                  ComputedPermissions.MANAGE_CHANNELS |
                  ComputedPermissions.CREATE_INVITES
                )
              ) ? (
                <Fragment>
                  <ContextTab title={ t('menu.invite_people')! } onClick={ () => {
                    setContextMenu({ id, data: { channel: true, fast: true } })
                    setModalState({ inviteCreation: true })
                  }}
                  />
                </Fragment>
              ) : null }

              { (
                PermissionCalculator.getUserPermissions(
                  ChannelCache[id || '']?.guild_id || '',
                  id || '',
                  ''
                ) & (
                  ComputedPermissions.OWNER |
                  ComputedPermissions.ADMINISTRATOR |
                  ComputedPermissions.MANAGE_CHANNELS
                )
              ) ? (
                <Fragment>
                  <ContextTab title={ t('menu.edit')! } onClick={ () => navigate(`/app/channelsettings/${id}/general`) } />
                  <ContextTab title={ step ? t('menu.confirmation')! : t('menu.delete')! } onClick={ deleteChannel } />
                </Fragment>
              ) : null }

              <ContextTab title={ t('menu.copy_id')! } onClick={ copyId } />
            </Fragment>
          ) }
        </Base>
      ) }
    </Fragment>
  )

  function copyId() {
    navigator.clipboard.writeText(id || '');
  }

  function deleteMessage() {
    MessagesService.deleteMessage(MessageCache[id || '']?.channel_id || '', id || '');
  }

  async function deleteChannel() {
    if (!step) {
      setStep(true);
      setContextMenu({ lock: true });
      setImmediate(() => setContextMenu({ lock: false }));
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
      setImmediate(() => setContextMenu({ lock: false }));
    } else {
      await GuildsService.leaveGuild(id || '');
      removeGuild(id || '');
      setStep(false);
      setContextMenu({ visible: false, lock: false });

      if (guildId === id) {
        navigate('/app/home');
      }
    }
  }

  function markChannelAsRead() {
    if (id) {
      removeUnread({ guildId: ChannelCache[id].guild_id || '@me', channelId: id, force: true, message_id: "0"})
      channelsService.readChannel(id)
    }
  }

  function pinMessage() {
    MessagesService.pinMessage(MessageCache[id || '']?.channel_id || '', id || '');
  }

  function unpinMessage() {
    MessagesService.unpinMessage(MessageCache[id || '']?.channel_id || '', id || '');
  }

  function addReply() {
    addForwards({ channel: MessageCache[id || '']?.channel_id || '', forwards: [id || ''] });
  }
}

export default ContextMenu;
