import { styled } from 'linaria/react';

import UserMenu from '../guilds/UserMenu';

const GuildsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 64px;
  align-self: stretch;
  background: var(--background-secondary);
`

function Guilds() {
  return (
    <GuildsContainer>
      <UserMenu />
    </GuildsContainer>
  );
}

export default Guilds;
