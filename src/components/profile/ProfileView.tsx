import classNames from 'classnames';
import { useStore } from 'effector-react';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { RiShieldCheckFill, RiCodeSSlashFill } from 'react-icons/ri';
import markdown from 'snarkdown';
import $UserCacheStore from '../../store/UserCacheStore';
import getIconString from '../../utils/getIconString';
import StyledIconCss from '../css/StyledIconCss';
import CenteredContainer from '../layout/CenteredContainer';
import StyledText from '../ui/StyledText';

interface ProfileViewProps {
  user: string
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const Banner = styled.div`
  height: 400px;
  background-size: cover;
  background-position: center;
`

const AvatarCss = `
  width: 128px;
  height: 128px;
  border-radius: 50%;
  margin-top: -64px;
  user-select: none;
  border: solid 8px var(--background-primary);
  background: var(--background-primary);
  line-height: 110px;
  text-align: center;
  font-weight: 900;
  color: var(--text-primary);
  background: var(--background-light);
  flex-shrink: 0;
  font-size: 48px;
`

const Avatar = styled.img`${AvatarCss}`
const LetterAvatar = styled.div`${AvatarCss}`

const DarkText = styled.div`
  color: var(--text-secondary);
`

const InfoContainer = styled.div`
  padding: 16px 18px;
  border-radius: 8px;
  background: var(--background-secondary-alt);
  max-width: 900px;
  width: 100%;
  margin-top: 32px;
`

const BadgeCss = css`
  width: 32px;
  height: 32px;
  margin-right: 16px;
`

const BlueBadge = css`
  color: var(--accent);
`

const GreenBadge = css`
  color: var(--accent-green);
`

function ProfileView({ user }: ProfileViewProps) {
  const UserCache = useStore($UserCacheStore);

  const { t } = useTranslation(['chat']);

  return (
    <Container>
      { UserCache[user] && (
        <Fragment>
          { UserCache[user].banner ? (
            <Banner style={{ background: `url(${ UserCache[user].banner })`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          ) : (
            <Banner className={ css`background: var(--accent-dark)` } />
          ) }
          <CenteredContainer className={ css`flex-direction: column; margin: 0 16px` }>
            { UserCache[user].avatar ? (
              <Avatar src={ UserCache[user].avatar } />
            ) : (
              <LetterAvatar>{ getIconString(UserCache[user].username || '') }</LetterAvatar>
            ) }
            <StyledText className={ css`font-size: 28px; font-weight: 900` }>
              { UserCache[user].username }
              <DarkText className={ css`display: inline-block` }>#{ UserCache[user].discriminator }</DarkText>
            </StyledText>
            <StyledText className={ css`font-size: 18px` }>{ UserCache[user].status }</StyledText>
            { UserCache[user].description && (
              <InfoContainer>
                <StyledText className={ css`font-size: 22px; margin: 0; font-weight: 900; margin-bottom: 16px` }>{ t('profile.about_me') }</StyledText>
                <StyledText className={ css`font-size: 18px; margin: 0` } dangerouslySetInnerHTML={{ __html: markdown(UserCache[user].description || '') }}></StyledText>
              </InfoContainer>
            ) }
            { UserCache[user].verified && (
              <InfoContainer>
                <StyledText className={ css`font-size: 22px; margin: 0; font-weight: 900; margin-bottom: 16px` }>{ t('profile.badges') }</StyledText>
                { UserCache[user].verified && (<RiCodeSSlashFill className={ classNames({ [StyledIconCss]: true, [BadgeCss]: true, [BlueBadge]: true }) } />) }
                { UserCache[user].verified && (<RiShieldCheckFill className={ classNames({ [StyledIconCss]: true, [BadgeCss]: true, [GreenBadge]: true }) } />) }
              </InfoContainer>
            ) }
          </CenteredContainer>
        </Fragment>
      ) }
    </Container>
  )
}

export default ProfileView;
