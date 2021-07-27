import { useStore } from 'effector-react';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { Fragment, useEffect } from 'react';
import markdown from 'snarkdown';
import $UserCacheStore from '../../store/UserCacheStore';
import Dots from '../animations/Dots';
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
`

const DarkText = styled.div`
  color: var(--text-secondary);
`

const InfoContainer = styled.div`
  padding: 16px;
  border-radius: 8px;
  background: var(--background-secondary-alt);
  width: 900px;
  margin-top: 32px;
`

function ProfileView({ user }: ProfileViewProps) {
  const UserCache = useStore($UserCacheStore);

  return (
    <Fragment>
      { UserCache[user] && (
        <Fragment>
          <Banner style={{ background: `url(${ UserCache[user].banner })`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <CenteredContainer className={ css`flex-direction: column` }>
            <Avatar src={ UserCache[user].avatar } />
            <StyledText className={ css`font-size: 28px; font-weight: 900` }>
              { UserCache[user].username }
              <DarkText className={ css`display: inline-block` }>#{ UserCache[user].discriminator }</DarkText>
            </StyledText>
            <StyledText className={ css`font-size: 18px` }>{ UserCache[user].status }</StyledText>
            <InfoContainer>
              <StyledText className={ css`font-size: 18px; margin: 0` } dangerouslySetInnerHTML={{ __html: markdown(UserCache[user].description || '') }}></StyledText>
            </InfoContainer>
          </CenteredContainer>
        </Fragment>
      ) }
    </Fragment>
  )
}

export default ProfileView;
