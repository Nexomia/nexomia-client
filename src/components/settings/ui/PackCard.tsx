import classNames from 'classnames';
import { useStore } from 'effector-react';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { useEffect, useState } from 'react';
import { RiDeleteBinFill, RiPencilFill } from 'react-icons/ri';
import UsersService from '../../../services/api/users/users.service';
import $UserCacheStore, { cacheUsers } from '../../../store/UserCacheStore';
import getIconString from '../../../utils/getIconString';
import StyledIconCss from '../../css/StyledIconCss';
import StyledText from '../../ui/StyledText';

const ButtonsContainer = styled.div`
  position: relative;
  top: -12px;
  right: -12px;
  height: 0px;
  opacity: 0;
  transition: .2s;
`

const Card = styled.div`
  display: flex;
  width: 280px;
  flex-grow: 0;
  flex-shrink: 0;
  background: var(--background-secondary-alt);
  border-radius: 8px;
  margin: 8px;
  flex-direction: column;
  cursor: pointer;
  transition: .2s;

  &:hover {
    transform: translateY(-5px);

    & > ${ButtonsContainer} {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(-3px) scale(0.98);
  }
`

const PreviewContainer = styled.div`
  width: 100%;
  height: 200px;
  background: var(--background-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 8px 8px 0 0;
`

const Preview = styled.img`
  max-height: calc(95% - 50px);
  max-width: 80%;
  user-select: none;
  user-drag: none;
`

const AuthorContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0 16px 16px 16px;
  align-items: center;
`

const AvatarCss = `
  width: 34px;
  height: 34px;
  border-radius: 50%;
  user-select: none;
  margin-right: 8px;
  line-height: 34px;
  text-align: center;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--background-light);
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
`

const Avatar = styled.img`${AvatarCss}`
const LetterAvatar = styled.div`${AvatarCss}`

interface PackProps {
  picture: string,
  name: string,
  description?: string,
  author?: string,
  onClick?: any,
  mini?: boolean,
  buttons?: boolean,
  hideEdit?: boolean,
  onEditClicked?: any,
  onDeleteClicked?: any
}

function PackCard({
  picture,
  name,
  description,
  author = '',
  onClick = () => null,
  mini = false,
  buttons = false,
  hideEdit = false,
  onEditClicked = () => null,
  onDeleteClicked = () => null
}: PackProps) {
  const UserCache = useStore($UserCacheStore);
  const [authorUser, setAuthorUser] = useState(UserCache[author]);

  useEffect(() => {
    if (!authorUser) {
      if (!UserCache[author]) loadUserInfo();
      else setAuthorUser(UserCache[author]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UserCache]);

  return (
    <Card onClick={ onClick } className={ classNames(mini && css`width: 150px`) }>
      {
        buttons && (
          <ButtonsContainer>
            <WrapContainer>
              { !hideEdit && (
                <MiniButton className={ css`background: var(--accent)` } onClick={ onEditClicked }>
                  <RiPencilFill className={ classNames(StyledIconCss, css`width: 16px; height: 16px; margin: 4px`) } />
                </MiniButton>
              ) }
              <MiniButton className={ css`background: var(--text-negative)` } onClick={ onDeleteClicked }>
                <RiDeleteBinFill className={ classNames(StyledIconCss, css`width: 20px; height: 20px; margin: 2px`) } />
              </MiniButton>
            </WrapContainer>
          </ButtonsContainer>
        )
      }
      <PreviewContainer className={ classNames(mini && css`height: 140px`) }>
        <Preview src={ picture } />
      </PreviewContainer>
      <StyledText
        className={ classNames(css`margin: 16px; font-weight: 900`, mini && css`text-align: center`) }
      >{ name }</StyledText>
      { description && <StyledText className={ css`margin: 0 16px 16px 16px; color: var(--text-secondary)` }>{ description }</StyledText> }
      {
        authorUser && (
          <AuthorContainer>
            {
              authorUser.avatar ? (
                <Avatar src={ authorUser.avatar } className={ css`background: transparent` } />
              ) : (
                <LetterAvatar>{ getIconString(authorUser.username || '') }</LetterAvatar>
              )
            }
            <StyledText className={ css`margin: 0 0 0 8px; font-weight: 900; font-size: 14px` }>{ authorUser?.username }</StyledText>
          </AuthorContainer>
        )
      }
    </Card>
  )

  async function loadUserInfo() {
    const user = await UsersService.getUser(author);
    console.log(user);
    cacheUsers([user]);
    setAuthorUser(user);
  }
}

export default PackCard;
