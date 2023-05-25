import classNames from 'classnames';
import { css } from 'linaria';
import FilledButton from '../components/ui/FilledButton';
import ModalHeader from '../components/ui/ModalHeader';
import StyledText from '../components/ui/StyledText';

function Crash({ error, componentStack, resetErrorBoundary }: any) {
  return (
    <div
      className={
        classNames(
          'App',
          'dark-theme',
          css`
            align-items: center;
            justify-content: center;
            flex-direction: column;
          `
        )
      }
    >
      <ModalHeader>Uh Oh.</ModalHeader>
      <StyledText>An unexpected crash has occured.</StyledText>
      <StyledText>You can reload this app using the button below.</StyledText>
      <FilledButton onClick={ reload } className={ css`margin-top: 32px;` }>Reload</FilledButton>
      <br />
      <StyledText>Error details:<br />{ error.message }</StyledText>
    </div>
  )

  function reload() {
    window.location.pathname = '/app';
  }
}

export default Crash;
