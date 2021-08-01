import { useStore } from 'effector-react';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { useHistory } from 'react-router-dom';
import $UserCacheStore from '../../store/UserCacheStore';
import StyledText from '../ui/StyledText';

const Container = styled.div`
  margin: 0 8px 8px 8px;
  padding: 6px 8px;
  border-radius: 4px;
  display: flex;
  alignSelf: stretch;
  flex-direction: row;
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

interface MemberProps {
  id: string
}

function Member({ id }: MemberProps) {
  const UserCache = useStore($UserCacheStore);
  const history = useHistory();

  return (
    <Container onClick={ openProfile }>
      <Avatar src={ UserCache[id].avatar } />
      <div className={ css`display: flex; flex-direction: column; justify-content: center;` }>
        <StyledText className={ css`margin: 0` }>{ UserCache[id].username }</StyledText>
      </div>
    </Container>
  )

  function openProfile() {
    history.push(`/profiles/${id}`);
  }
}

export default Member;
