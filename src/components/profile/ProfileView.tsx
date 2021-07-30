import classNames from 'classnames';
import { useStore } from 'effector-react';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { Fragment, useEffect } from 'react';
import { RiShieldCheckFill, RiCodeSSlashFill } from 'react-icons/ri';
import markdown from 'snarkdown';
import $UserCacheStore from '../../store/UserCacheStore';
import Dots from '../animations/Dots';
import StyledIconCss from '../css/StyledIconCss';
import CenteredContainer from '../layout/CenteredContainer';
import StyledText from '../ui/StyledText';

interface ProfileViewProps {
  user: string
}

const Banner = styled.div`
  height: 400px;
  background-size: cover;
  background-position: center;
`

const Avatar = styled.img`
  width: 128px;
  height: 128px;
  border-radius: 50%;
  margin-top: -64px;
  user-select: none;
  border: solid 8px var(--background-primary);
  background: var(--background-primary);
`

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

  return (
    <Fragment>
      { UserCache[user] && (
        <Fragment>
          { UserCache[user].banner ? (
            <Banner style={{ background: `url(${ UserCache[user].banner })`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          ) : (
            <Banner className={ css`background: var(--accent-dark)` } />
          ) }
          <CenteredContainer className={ css`flex-direction: column; margin: 0 16px` }>
            <Avatar src={ UserCache[user].avatar } />
            <StyledText className={ css`font-size: 28px; font-weight: 900` }>
              { UserCache[user].username }
              <DarkText className={ css`display: inline-block` }>#{ UserCache[user].discriminator }</DarkText>
            </StyledText>
            <StyledText className={ css`font-size: 18px` }>{ UserCache[user].status }</StyledText>
            { UserCache[user].description && (
              <InfoContainer>
                <StyledText className={ css`font-size: 22px; margin: 0; font-weight: 900; margin-bottom: 16px` }>About me</StyledText>
                <StyledText className={ css`font-size: 18px; margin: 0` } dangerouslySetInnerHTML={{ __html: markdown(UserCache[user].description || '') }}></StyledText>
              </InfoContainer>
            ) }
            { UserCache[user].verified && (
              <InfoContainer>
                <StyledText className={ css`font-size: 22px; margin: 0; font-weight: 900; margin-bottom: 16px` }>Badges</StyledText>
                { UserCache[user].verified && (<RiCodeSSlashFill className={ classNames({ [StyledIconCss]: true, [BadgeCss]: true, [BlueBadge]: true }) } />) }
                { UserCache[user].verified && (<RiShieldCheckFill className={ classNames({ [StyledIconCss]: true, [BadgeCss]: true, [GreenBadge]: true }) } />) }
              </InfoContainer>
            ) }
          </CenteredContainer>
        </Fragment>
      ) }
    </Fragment>
  )
}

export default ProfileView;
