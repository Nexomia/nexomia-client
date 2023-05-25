import { css } from 'linaria';

import { useState, Fragment, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { useStore } from 'effector-react';
import $AuthStore from '../store/AuthStore';

import AuthService from '../services/api/auth/auth.service';

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

const negativeColorCss = css`
  color: var(--text-negative);
`

function Register() {
  const { token } = useStore($AuthStore);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate('/app/channels/@me');
    }
    
  }, []);

  const { t } = useTranslation(['reg']);

  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerState, setRegisterState] = useState(0);
  const [placeholderText] = useState(0);
  const [emailError, setEmailError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const emailInput = useRef<HTMLInputElement>(null);
  const usernameInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);

  return (
    <div className="Login dark-theme">
      <Layer>
        <Modal className={ modalCss }>
          <LoadingPlaceholder title={ (placeholderText === 0 && 'Creating your account...') || 'Almost there...' } active={ registerLoading } />

          { registerState === 0 && (
            <Fragment>
              <ModalHeader>{ t('register') }<br /><StyledText>{ t('welcomer_register') }</StyledText></ModalHeader>
              <InputField placeholder={ t('fields.email')! } ref={ emailInput } />
              { (emailError && <StyledText className={ negativeColorCss }>{ t('errors.required_field') }</StyledText>) }
              <InputField placeholder={ t('fields.username')! } ref={ usernameInput } />
              { (usernameError && <StyledText className={ negativeColorCss }>{ t('errors.required_field') }</StyledText>) }
              <InputField placeholder={ t('fields.password')! } type="password" ref={ passwordInput } hidden={ true } />
              { (passwordError && <StyledText className={ negativeColorCss }>{ t('errors.required_field') }</StyledText>) }
              <StyledText>{ t('has_account') } <Link to="/login">{ t('log_in') }</Link></StyledText>
              <FilledButton onClick={ register }>{ t('continue') }</FilledButton>
            </Fragment>
          ) }

          { registerState === 1 && (
            <Fragment>
              <ModalHeader>{ t('account_created') }<br /><StyledText>{ t('account_log_in') }</StyledText></ModalHeader>
              <FilledButton onClick={ login }>{ t('continue') }</FilledButton>
            </Fragment>
          ) }
        </Modal>
      </Layer>
    </div>
  );

  async function register() {
    setEmailError(!emailInput.current?.value);
    setUsernameError(!usernameInput.current?.value);
    setPasswordError(!passwordInput.current?.value);

    if (!emailInput.current?.value || !usernameInput.current?.value || !passwordInput.current?.value) return;

    setRegisterLoading(true);

    const response = await AuthService.register(
      emailInput.current?.value,
      usernameInput.current?.value,
      passwordInput.current?.value
    );

    if (!response) return;

    setRegisterLoading(false);
    setRegisterState(1);
  }

  function login() {
    navigate('/app/login');
  }
}

export default Register;
