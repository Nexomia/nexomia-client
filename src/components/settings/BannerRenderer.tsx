import { css } from 'linaria';
import { styled } from 'linaria/react';
import { useTranslation } from 'react-i18next';
import getIconString from '../../utils/getIconString';
import StyledText from '../ui/StyledText';

interface BannerProps {
  banner: string,
  avatar: string,
  letters: string,
  onBannerClick: any,
  onAvatarClick: any
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const BannerInner = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .6);
  transition: .2s;
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const AvatarInner = styled.div`
  width: 112px;
  height: 112px;
  background: rgba(0, 0, 0, .6);
  transition: .2s;
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  top: -150px;
`

const LetterAvatar = styled.div`
  width: 128px;
  height: 128px;
  border-radius: 50%;
  margin-top: -64px;
  user-select: none;
  border: solid 8px var(--background-secondary-alt);
  background: var(--background-secondary-alt);
  line-height: 110px;
  text-align: center;
  font-weight: 900;
  color: var(--text-primary);
  flex-shrink: 0;
  font-size: 48px;
  cursor: pointer;
  overflow: hidden;
  z-index: 5;

  &:hover > ${AvatarInner} {
    opacity: 1;
  }
`

const Avatar = styled.img`
  width: 100%;
  height: 100%;
`

const Banner = styled.div`
  margin-top: 16px;
  width: 100%;
  height: 256px;
  border-radius: 8px 8px 0px 0px;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  overflow: hidden;

  &:hover > ${BannerInner} {
    opacity: 1;
  }
`

function BannerRenderer({ banner, avatar, letters, onBannerClick = () => null, onAvatarClick = () => null }: BannerProps) {
  const { t } = useTranslation(['settings']);

  return (
    <Container>
      <Banner
        style={ banner ? ({ background: `url(${ banner })`, backgroundSize: 'cover', backgroundPosition: 'center' }) : {} }
        className={ css`background: var(--accent-dark)` }
        onClick={ () => onBannerClick() }
      >
        <BannerInner>
          <StyledText className={ css`margin: 0; font-size: 24px; font-weight: 900` }>{ t('server_general.edit') }</StyledText>
        </BannerInner>
      </Banner>
      { avatar ? (
        <LetterAvatar onClick={ () => onAvatarClick() }>
          <Avatar src={ avatar } />
          <AvatarInner>
            <StyledText className={ css`margin: 0; font-size: 14px; font-weight: 900` }>{ t('server_general.edit') }</StyledText>
          </AvatarInner>
        </LetterAvatar>
      ) : (
        <LetterAvatar onClick={ () => onAvatarClick() }>
          { getIconString(letters) }
          <AvatarInner className={ css`top: -110px` }>
            <StyledText className={ css`margin: 0; font-size: 14px; font-weight: 900` }>{ t('server_general.edit') }</StyledText>
          </AvatarInner>
        </LetterAvatar>
      ) }
    </Container>
  )
}

export default BannerRenderer;
