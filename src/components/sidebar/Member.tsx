import { useStore } from 'effector-react';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { useHistory } from 'react-router-dom';
import $UserCacheStore from '../../store/UserCacheStore';
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

const Avatar = styled.img`
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
`

const Presence = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
`

interface MemberProps {
  id: string,
  guild?: string
}

function Member({ id, guild }: MemberProps) {
  const UserCache = useStore($UserCacheStore);
  const history = useHistory();

  return (
    <Container onClick={ openProfile }>
      <Avatar src={ UserCache[id].avatar } />
      <div className={ css`display: flex; flex-direction: column; justify-content: center; width: 154px;` }>
        <StyledText className={ css`margin: 0; font-size: 16px` } style={{ color: getMemberColor(guild || '', id) }}>{ UserCache[id].username }</StyledText>
        { (UserCache[id].status && UserCache[id].presence !== 4 && UserCache[id].connected) && <StyledText className={ css`margin: 0; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;` }>
          { UserCache[id].status }
        </StyledText> }
      </div>
      { UserCache[id].connected && <Presence style={{ background: ['var(--accent-green)', 'var(--accent-yellow)', 'var(--text-negative)'][(UserCache[id].presence || 3) - 1] }} /> }
    </Container>
  )

  function openProfile() {
    history.push(`/profiles/${id}`);
  }
}

export default Member;
