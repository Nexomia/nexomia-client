import { css } from 'linaria';

import { useState, Fragment, useRef, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../store/hooks';

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
  const token = useAppSelector((state) => state.token.value);
  const history = useHistory();

  useEffect(() => {
    if (token) {
      history.push('/channels/me');
    }
  }, []);

  const { t } = useTranslation(['reg']);

  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerState, setRegisterState] = useState(0);
  const [placeholderText, setPlaceholderText] = useState(0);
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
              <ModalHeader>{ t('reg:register') }<br /><StyledText>{ t('reg:welcomer_register') }</StyledText></ModalHeader>
              <InputField placeholder="Email" ref={ emailInput } />
              { (emailError && <StyledText className={ negativeColorCss }>{ t('reg:errors.required_field') }</StyledText>) }
              <InputField placeholder={ t('reg:fields.username') } ref={ usernameInput } />
              { (usernameError && <StyledText className={ negativeColorCss }>{ t('reg:errors.required_field') }</StyledText>) }
              <InputField placeholder={ t('reg:fields.password') } type="password" ref={ passwordInput } hidden={ true } />
              { (passwordError && <StyledText className={ negativeColorCss }>{ t('reg:errors.required_field') }</StyledText>) }
              <StyledText>{ t('reg:has_account') } <Link to="/login">{ t('reg:log_in') }</Link></StyledText>
              <FilledButton onClick={ register }>{ t('reg:continue') }</FilledButton>
            </Fragment>
          ) }

          { registerState === 1 && (
            <Fragment>
              <ModalHeader>{ t('reg:account_created') }<br /><StyledText>{ t('reg:account_log_in') }</StyledText></ModalHeader>
              <FilledButton onClick={ login }>{ t('reg:continue') }</FilledButton>
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
    history.push('/login');
  }
}

export default Register;
