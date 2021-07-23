import { styled } from 'linaria/react';

const Header = styled.div`
  height: 48px;
  display: flex;
  alignSelf: stretch;
`

const Content = styled.div`
  display: flex;
  align-self: center;
  color: var(--text-primary);
  font-weight: 900;
  font-size: 18px;
  padding: 0 16px;
  user-select: none;
`

function ContentHeader() {
  return (
    <Header>
      <Content>чаннел титле</Content>
    </Header>
  );
}

export default ContentHeader;