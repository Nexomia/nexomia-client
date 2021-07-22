import { styled } from '@linaria/react';

import PanelButton from './PanelButton';

const Container = styled.div`
  width: 48px;
  align-self: center;
  overflow: hidden;
  background: var(--background-primary);
  margin-top: 8px;
  border-radius: 50%;
  transition: .2s;
  &:not(:hover) {
    height: 48px;
  }
  &:hover {
    border-radius: 12px;
  }
`

function UserMenu() {
  return (
    <Container>
      <PanelButton />
    </Container>
  );
}

export default UserMenu;
