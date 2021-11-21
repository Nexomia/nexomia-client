import classNames from 'classnames';
import { useStore } from 'effector-react';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { useEffect, useState } from 'react';
import UsersService from '../../../services/api/users/users.service';
import $UserCacheStore, { cacheUsers } from '../../../store/UserCacheStore';
import getIconString from '../../../utils/getIconString';
import StyledText from '../../ui/StyledText';

const Card = styled.div`
  display: flex;
  width: 280px;
  flex-grow: 0;
  flex-shrink: 0;
  background: var(--background-secondary-alt);
  border-radius: 8px;
  margin: 8px;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;
  transition: .2s;

  &:hover {
    transform: translateY(-5px);
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

const Avatar = styled.img`${AvatarCss}`
const LetterAvatar = styled.div`${AvatarCss}`

interface PackProps {
  picture: string,
  name: string,
  description?: string,
  author?: string,
  onClick?: any,
  mini?: boolean
}

function PackCard({ picture, name, description, author = '', onClick = () => null, mini = false }: PackProps) {
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
