import { css } from '@linaria/core';

import { useState, Fragment } from 'react';
import { Link, useHistory } from 'react-router-dom';

import '../styles/App.css';

import Layer from '../components/ui/Layer';
import Modal from '../components/ui/Modal';
import ModalHeader from '../components/ui/ModalHeader';
import InputField from '../components/ui/InputField';
import FilledButton from '../components/ui/FilledButton';
import StyledText from '../components/ui/StyledText';
import LoadingPlaceholder from '../components/ui/LoadingPlaceholder';

const modalCss = css`
  width: 440px
`

function Register() {
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerState, setRegisterState] = useState(0);
  const [placeholderText, setPlaceholderText] = useState(0);

  const history = useHistory()

  return (
    <div className="Login dark-theme">
      <Layer>
        <Modal className={ modalCss }>
          <LoadingPlaceholder title={ (placeholderText === 0 && 'Creating your account...') || 'Almost there...' } active={ registerLoading } />

          { registerState === 0 && (
            <Fragment>
              <ModalHeader>Register<br /><StyledText>Only one step is required to enter the world of Nexomia!</StyledText></ModalHeader>
              <InputField placeholder="Email" />
              <InputField placeholder="Username" />
              <InputField placeholder="Password" type="password" hidden={ true } />
              <StyledText>Already registered? <Link to="/login">Log in</Link></StyledText>
              <FilledButton onClick={ register }>Continue</FilledButton>
            </Fragment>
          ) }

          { registerState === 1 && (
            <Fragment>
              <ModalHeader>Confirm Yourself!<br /><StyledText>Check your EMail inbox and click the provided link to finish registration.</StyledText></ModalHeader>
            </Fragment>
          ) }
        </Modal>
      </Layer>
    </div>
  );

  function register() {
    setRegisterLoading(true);

    setTimeout(() => {
      setRegisterLoading(false);
      setRegisterState(1);
    }, 2000);

    setTimeout(() => {
      setPlaceholderText(1);
      setRegisterLoading(true);
    }, 5000);

    setTimeout(() => {
      history.push('/channels/1');
    }, 7000);
  }
}

export default Register;
