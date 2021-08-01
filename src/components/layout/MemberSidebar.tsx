import { styled } from 'linaria/react';

const SidebarContainer = styled.div`
  display: flex;
  width: 240px;
  flex-shrink: 0;
  flex-direction: column;
  align-self: stretch;
  background: var(--background-secondary-alt)
`

function MemberSidebar() {
  return (
    <SidebarContainer>

    </SidebarContainer>
  )
}

export default MemberSidebar;
