import { styled } from "linaria/lib/react";
import GuildBan from "../../store/models/GuildBan";
import StyledText from "../ui/StyledText";
import { format } from "fecha";
import { css } from "linaria";
import getIconString from "../../utils/getIconString";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";


const Container = styled.div`
  width: 100%;
  display: flex;
  flex-grow: 1;
  flex-direction: row;  
  align-items: center;
`

const ContentContainer = styled.div`
  width: 100%;
  padding: 16px;
`

const ButtonsContainer = styled.div`
  position: relative;
  top: -12px;
  right: -12px;
  height: 0px;
  opacity: 0;
  transition: .2s;
`

const CollapsibleContainer = styled.div`
  width: 100%;
  border-radius: 4px;
  background: var(--background-secondary-alt);
  margin-bottom: 4px;

  &:hover {
    & > ${ButtonsContainer} {
      opacity: 1;
    }
  }
`

const Splitter = styled.div`
  flex-grow: 1;
`

const CollapsibleHead = styled.div`
  display: flex;
  width: 100%;
  height: auto;
  height: 72px;
  padding: 16px;

  &:hover {
    cursor: pointer;
    background: var(--background-secondary);
  }
`
const CollapsibleContent = styled.div`
  width: 100%;
`

const CollapsibleContentActive = css`
  display: flex;
  overflow: hidden;
  transition: max-height .2s ease-out, opacity .2s ease-out;
  height: auto;
  max-height: 200px;
 `

const CollapsibleContentHidden = css`
  display: flex;
  overflow: hidden;
  transition: max-height .2s ease-out, opacity .2s ease-out;
  max-height: 0;
`

const AvatarCss = `
  width: 40px;
  height: 40px;
  border-radius: 50%;
  line-height: 40px;
  user-select: none;
  margin-right: 16px;
  text-align: center;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--background-light);
`
const Avatar = styled.img`${AvatarCss}`
const LetterAvatar = styled.div`${AvatarCss}`

const AvatarSmallCss = `
  width: 24px;
  height: 24px;
  border-radius: 50%;
  line-height: 24px;
  font-size: 8px;
  user-select: none;
  text-align: center;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--background-light);
`
const AvatarSmall = styled.img`${AvatarSmallCss}`
const LetterAvatarSmall = styled.div`${AvatarSmallCss}`

interface GuildBanCollapsibleProps {
  ban: GuildBan
}

function GuildBanCollapsible({ban}: GuildBanCollapsibleProps) {

  const { t } = useTranslation(['settings']);

  const [collapsed, toggle] = useState(false);

  const [bannedIndex, gBI] = useState(0);
  const [userIndex, gUI] = useState(0);
  
  useEffect(() => {
    gBI(ban.users.findIndex(u => u.id === ban.banned_by));
    gUI(ban.users.findIndex(u => u.id === ban.user_id));
  }, [ban.banned_by, ban.user_id, ban.users]);

  return (
    <CollapsibleContainer>
        <CollapsibleHead onClick={() => toggle(!collapsed)} className={collapsed ? css`background: var(--background-secondary);` : ''}>
        { ban.users && (
          <Container>
            {
              ban.users[userIndex].avatar
              ? <Avatar src={ ban.users[userIndex].avatar.replace('/avatar.webp', '/avatar_40.webp') }/>
              : <LetterAvatar>{ getIconString(ban.users[userIndex].username || '') }</LetterAvatar>
            }
            <StyledText className={ css`text-align: center; margin: 32px 0` }>{ban.users[userIndex].username}#{ban.users[userIndex].discriminator}</StyledText>
            <Splitter />
            <StyledText className={ css`margin: 0; font-weight: 900; width: 200px; text-align: right; color: var(--text-secondary)` }>{ format(new Date(ban.date), 'DD.MM.YY HH:mm') }</StyledText>
            </Container>
        )}
        </CollapsibleHead>
        <CollapsibleContent className={ collapsed ? CollapsibleContentActive : CollapsibleContentHidden }>
          <ContentContainer>
            <StyledText className={ css`margin-top: 0; color: var(--text-secondary)` }>{ t('server_bans.reason') }:</StyledText>
            <StyledText className={ css`margin-left: 8px;` }>{ ban.reason ? ban.reason : t('server_bans.no_reason') }</StyledText>
            <StyledText className={ css`color: var(--text-secondary); margin-top: 16px;` }>{ t('server_bans.banned_by') }:</StyledText>
            { ban.users && (
            <Container className={ css`margin-left: 8px; margin-top: 8px;` }>
              {
                ban.users[bannedIndex].avatar
                ? <AvatarSmall src={ ban.users[bannedIndex].avatar?.replace('/avatar.webp', '/avatar_40.webp') }/>
                : <LetterAvatarSmall>{ getIconString(ban.users[bannedIndex].username || '') }</LetterAvatarSmall>
              }
              <StyledText className={ css`transform: translateY(-4px); margin-left: 8px;` }>{ban.users[bannedIndex].username}#{ban.users[bannedIndex].discriminator}</StyledText>
            </Container>
            )}
          </ContentContainer> 
        </CollapsibleContent>
    </CollapsibleContainer>
  )
}

export default GuildBanCollapsible;
