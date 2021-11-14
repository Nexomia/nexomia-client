import { useStore } from 'effector-react';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import GuildsService from '../../../services/api/guilds/guilds.service';
import $ChannelCacheStore from '../../../store/ChannelCacheStore';
import { setContextMenu } from '../../../store/ContextMenuStore';
import $GuildCacheStore, { setGuildInvites } from '../../../store/GuildCacheStore';
import { setModalState } from '../../../store/ModalStore';
import $UserCacheStore from '../../../store/UserCacheStore';
import FilledButton from '../../ui/FilledButton';
import StyledText from '../../ui/StyledText';

interface RouteParams {
  guildId: string
}

const Container = styled.div`
  padding: 16px;
  border-radius: 4px;
  background: var(--background-secondary-alt);
  margin-bottom: 4px;
  display: flex;
  flex-direction: row;

  &:hover {
    background: var(--background-secondary);
  }
`

const Splitter = styled.div`
  flex-grow: 1;
`

function InvitesView() {
  const { guildId } = useParams<RouteParams>();

  const { t } = useTranslation(['settings']);

  const Guilds = useStore($GuildCacheStore);
  const Channels = useStore($ChannelCacheStore);
  const Users = useStore($UserCacheStore);

  useEffect(() => {
    if (!Guilds[guildId]?.invites?.length) {
      loadInvites();
    }
  }, []);

  return (
    <Fragment>
      <StyledText className={ css`text-align: center; margin: 32px 0` }>
        { t('server_invites.description') }
      </StyledText>
      <FilledButton
        className={ css`margin: 0 0 8px 0` }
        onClick={ () => {
          setContextMenu({ id: guildId });
          setModalState({ inviteCreation: true });
        } }
      >{ t('server_invites.invite_create') }</FilledButton>
      { !!Guilds[guildId]?.invites?.length && (
        Guilds[guildId]?.invites?.map((invite) => (
          <Container>
            <StyledText className={ css`margin: 0; font-weight: 900; width: 200px; text-align: left; user-select: text` }>
              { invite.code }
            </StyledText>
            <Splitter />
            <StyledText className={ css`margin: 0; font-weight: 900; width: 200px; text-align: left; color: var(--text-secondary)` }>
              #{ Channels[invite.channel_id || '']?.name }
            </StyledText>
            <Splitter />
            <StyledText className={ css`margin: 0; font-weight: 900; width: 200px; text-align: right; color: var(--text-secondary)` }>
              { invite.uses || 0 } { t('server_invites.uses') }
            </StyledText>
          </Container>
        ))
      ) }
    </Fragment>
  )

  async function loadInvites() {
    const response = await GuildsService.getGuildInvites(guildId);

    if (!response) return;

    setGuildInvites({ guild: guildId, invites: response });
  }
}

export default InvitesView;
