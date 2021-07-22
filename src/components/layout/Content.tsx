import { styled } from 'linaria/react';

import ContentHeader from './ContentHeader';

const Container = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  alignSelf: stretch;
  background: var(--background-secondary-alt);
`

const ContentBody = styled.div`
  display: flex;
  align-self: stretch;
  flex-grow: 1;
  border-radius: 8px 8px 0 0;
  background: var(--background-primary);
`

function Content() {
  return (
    <Container>
      <ContentHeader />
      <ContentBody></ContentBody>
    </Container>
  );
}

export default Content;