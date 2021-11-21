import classNames from 'classnames';
import { useStore } from 'effector-react';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import UsersService from '../../services/api/users/users.service';
import $UserCacheStore, { cacheUsers } from '../../store/UserCacheStore';
import getIconString from '../../utils/getIconString';
import getMemberColor from '../../utils/getMemberColor';
import StyledText from '../ui/StyledText';

const Container = styled.div`
  margin: 0 8px 8px 8px;
  padding: 6px 8px;
  border-radius: 4px;
  display: flex;
  height: 46px;
  flex-direction: row;
  flex-grow: 0;
  align-items: center;
  cursor: pointer;
  transition: .2s;
  &:hover {
    background: var(--background-primary);
  }
  &:active {
    transform: scale(0.98);
  }
`

const OfflineCss = css`
  opacity: .5;

  &:hover {
    opacity: 1;
  }
`

const AvatarCss = `
  width: 34px;
  height: 34px;
  border-radius: 50%;
  user-select: none;
  margin-right: 8px;
  cursor: pointer;
  transition: .2s;
  &:active {
    transform: translateY(2px);
  }
  line-height: 34px;
  height: 34px;
  text-align: center;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--background-light);
`

const ActiveCss = css`
  &, &:hover {
    background: var(--accent);
  }
`

const Avatar = styled.img`${AvatarCss}`
const LetterAvatar = styled.div`${AvatarCss}`

const Presence = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
`

interface MemberProps {
  id: string,
  guild?: string,
  offline?: boolean,
  tab?: boolean,
  active?: boolean,
  onClick?: any
}

function Member({ id, guild, offline = false, tab = false, onClick = () => null, active = false }: MemberProps) {
  const UserCache = useStore($UserCacheStore);
  const history = useHistory();

  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!UserCache[id]) loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // trash workaround for React/Chrome bug
  // it can potentially lower the performance
  useEffect(() => {
    if (textRef.current) textRef.current.style.webkitBackgroundClip = 'text';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  return (
    UserCache[id] ? (
      <Container onClick={ openProfile } className={ classNames(offline && OfflineCss, active && ActiveCss) }>
        {
          UserCache[id].avatar ? (
            <Avatar src={ UserCache[id].avatar } className={ css`background: transparent` } />
          ) : (
            <LetterAvatar>{ getIconString(UserCache[id].username || '') }</LetterAvatar>
          )
        }
        <div className={ css`display: flex; flex-direction: column; justify-content: center; width: 154px;` }>
          <div>
            <StyledText
              className={ css`
                margin: 0;
                font-size: 16px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                display: inline;
              ` }
              ref={ textRef }
              style={{
                background: getMemberColor(guild || '', id) || 'var(--text-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              { UserCache[id].username }
            </StyledText>
          </div>
          { (UserCache[id].status && UserCache[id].presence !== 4 && UserCache[id].connected) && 
            <StyledText className={ css`margin: 0; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; font-weight: 400` }>
            { UserCache[id].status }
          </StyledText> }
        </div>
        { UserCache[id].connected && <Presence style={{ background: ['var(--accent-green)', 'var(--accent-yellow)', 'var(--text-negative)'][(UserCache[id].presence || 3) - 1] }} /> }
      </Container>
    ) : null
  )

  function openProfile() {
    if (tab) onClick();
    else history.push(`/profiles/${id}`);
  }

  async function loadUser() {
    const response = await UsersService.getUser(id);

    if (response) cacheUsers([response]);
  }
}

export default Member;
