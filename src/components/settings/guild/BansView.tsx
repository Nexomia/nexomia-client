import classNames from 'classnames';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RiDeleteBinFill } from 'react-icons/ri';
import { useParams } from 'react-router';
import guildsService from '../../../services/api/guilds/guilds.service';
import GuildsService from '../../../services/api/guilds/guilds.service';
import { setContextMenu } from '../../../store/ContextMenuStore';
import { setModalState } from '../../../store/ModalStore';
import GuildBan from '../../../store/models/GuildBan';
import GuildBanCollapsible from '../../collapsibles/GuildBanCollapsible';
import StyledIconCss from '../../css/StyledIconCss';
import FilledButton from '../../ui/FilledButton';
import StyledText from '../../ui/StyledText';

const ButtonsContainer = styled.div`
  position: relative;
  top: -12px;
  right: -12px;
  height: 0px;
  opacity: 0;
  transition: .2s;
`

const Collapsible = styled.div`
  &:hover {
    & > ${ButtonsContainer} {
      opacity: 1;
    }
  }
`

const WrapContainer = styled.div`
  height: 24px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`

const MiniButton = styled.div`
  width: 24px;
  height: 24px;
  margin-left: 8px;
  border-radius: 12px;
  background: var(--background-secondary-alt);
  cursor: pointer;
`
interface RouteParams {
  guildId: string
}

function BansView() {
  const { guildId } = useParams<RouteParams>();

  const { t } = useTranslation(['settings']);

  const [bans, setBans] = useState<GuildBan[]>([]);

  useEffect(() => {
    async function getBans() {
      setBans(await GuildsService.getGuildBans(guildId));
    }
    getBans();
  
  }, []);

  function removeBan(guild: string, user: string) {
    guildsService.removeGuildBan(guild, user)
    .then(res => {
      update();
    });
    return undefined;
  }

  function update() {
    GuildsService.getGuildBans(guildId)
    .then(res => {
      if (res) {
        setBans(res);
      }
    })
    return undefined;
  }

  return (
    <Fragment>
      <StyledText className={ css`text-align: center; margin: 32px 0` }>
        { t('server_bans.description') }
      </StyledText>
      <FilledButton
        className={ css`margin: 0 0 8px 0` }
        onClick={ () => {
          setContextMenu({ id: guildId, data: { update } });
          setModalState({ guildBanUser: true });
        } }
      >{ t('server_bans.ban_create') }</FilledButton>
      { !!bans.length && (
        bans.map((ban) => (
          <Collapsible key={ ban.user_id }>
            <ButtonsContainer>
              <WrapContainer>
                <MiniButton className={ css`background: var(--text-negative)` } onClick={ () => removeBan(guildId, ban.user_id) }>
                  <RiDeleteBinFill className={ classNames(StyledIconCss, css`width: 20px; height: 20px; margin: 2px`) } />
                </MiniButton>
              </WrapContainer>
            </ButtonsContainer>
           <GuildBanCollapsible ban={ ban }/>
          </Collapsible>
        ))
      ) }
    </Fragment>
  )
}

export default BansView;
