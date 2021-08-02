import { styled } from 'linaria/lib/react';
import { useParams } from 'react-router-dom';
import CenteredContainer from '../layout/CenteredContainer';
import RolesView from './guild/RolesView';

const Wrapper = styled.div`
  max-width: 700px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin: 0 16px;
`

interface RouteParams {
  channelId: string
}

function SettingsView() {
  const { channelId } = useParams<RouteParams>();

  return (
    <CenteredContainer>
      <Wrapper>
        { channelId === 'roles' && (
          <RolesView />
        ) }
      </Wrapper>
    </CenteredContainer>
  ) 
}

export default SettingsView;
