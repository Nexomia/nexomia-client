import { useStore } from 'effector-react';
import { styled } from 'linaria/react';
import { Fragment } from 'react';
import { useHistory } from 'react-router';
import $ContextMenuStore from '../../store/ContextMenuStore';
import ContextTab from './ContextTab';


const Base = styled.div`
  position: fixed;
  background: var(--background-light);
  border-radius: 4px;
  padding: 8px 8px;
  box-shadow: 0px 5px 15px 0 rgba(0, 0, 0, 0.2);
  z-index: 10;
`

function ContextMenu() {
  const { top, left, visible, type, id } = useStore($ContextMenuStore);
  const history = useHistory();

  return (
    <Fragment>
      { visible && (
        <Base style={{ top, left }}>
          { type === 'guild' && (
            <Fragment>
              <ContextTab title='Settings' onClick={ () => history.push(`/guildsettings/${id}/general`) } />
              <ContextTab title='Leave Server' />
              <ContextTab title='Copy ID' />
            </Fragment>
          ) }

          { type === 'message' && (
            <Fragment>
              <ContextTab title='Add Reaction' />
              <ContextTab title='Edit' />
              <ContextTab title='Delete' />
              <ContextTab title='Copy ID' />
            </Fragment>
          ) }
        </Base>
      ) }
    </Fragment>
  )
}

export default ContextMenu;
