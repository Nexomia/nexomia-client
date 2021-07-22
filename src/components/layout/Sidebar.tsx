import { styled } from 'linaria/react';

import SidebarHeader from './SidebarHeader';

const SidebarContainer = styled.div`
  display: flex;
  width: 240px;
  align-self: stretch;
  background: var(--background-secondary-alt)
`

function Sidebar() {
  return (
    <SidebarContainer>
      <SidebarHeader />
    </SidebarContainer>
  );
}

export default Sidebar;
