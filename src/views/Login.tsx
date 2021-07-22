import { css } from '@linaria/core';

import { useState, useRef, MutableRefObject, useEffect } from 'react';
import { Link } from 'react-router-dom';

import '../styles/App.css';

import Layer from '../components/ui/Layer';
import Modal from '../components/ui/Modal';
import ModalHeader from '../components/ui/ModalHeader';
import InputField from '../components/ui/InputField';
import FilledButton from '../components/ui/FilledButton';
import StyledText from '../components/ui/StyledText';
import LoadingPlaceholder from '../components/ui/LoadingPlaceholder';

const modalCss = css`
  width: 440px;
`

const negativeColorCss = css`
  color: var(--text-negative);
`

function Login() {
  const [loginLoading, setLoginLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const emailInput: MutableRefObject<null> = useRef(null);
  const passwordInput: MutableRefObject<null> = useRef(null);

  useEffect(() => {
    console.log(emailInput);
  }, []);

  return (
    <div className="Login dark-theme">
      <Layer>
        <Modal className={ modalCss }>
          <LoadingPlaceholder title="Logging in..." active={ loginLoading } />
          <ModalHeader>Log In<br /><StyledText>We're glad to see you again!</StyledText></ModalHeader>
          <InputField placeholder="Email" ref={ emailInput } />
          { (emailError && <StyledText className={ negativeColorCss }>This field is required.</StyledText>) }
          <InputField placeholder="Password" type="password" hidden={ true } ref={ passwordInput } />
          { (passwordError && <StyledText className={ negativeColorCss }>This field is required.</StyledText>) }
          <StyledText>Don't have an account? <Link to="/register">Register</Link></StyledText>
          <FilledButton onClick={ login }>Continue</FilledButton>
        </Modal>
      </Layer>
    </div>
  );

  function login() {
    console.log(emailInput);
    /* if (!emailInput.current?.value) setEmailError(true);
    if (!passwordInput.current?.value) setPasswordError(true);

    if (!emailInput.current?.value || !passwordInput.current?.value) return; */

    setLoginLoading(true);

    setTimeout(() => setLoginLoading(false), 2000);
  }
}

export default Login;
