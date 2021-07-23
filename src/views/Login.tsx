import { css } from 'linaria';

import { useState, useRef, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setToken } from '../store/auth/token';
import { setRefreshToken } from '../store/auth/refreshToken';

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
  width: 440px;
`

const negativeColorCss = css`
  color: var(--text-negative);
`

function Login() {
  const token = useAppSelector((state) => state.token.value);
  const dispatch = useAppDispatch();
  const history = useHistory();

  useEffect(() => {
    console.log(token)
    if (token && token !== '') {
      history.push('/channels/@home');
    }
  }, []);

  const { t } = useTranslation(['reg']);

  const [loginLoading, setLoginLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const emailInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log(emailInput);
  }, []);

  return (
    <div className="Login dark-theme">
      <Layer>
        <Modal className={ modalCss }>
          <LoadingPlaceholder title={ t('reg:logging_in') } active={ loginLoading } />
          <ModalHeader>{ t('reg:log_in') }<br /><StyledText>{ t('reg:welcomer_log_in') }</StyledText></ModalHeader>
          <InputField placeholder="Email" ref={ emailInput } />
          { (emailError && <StyledText className={ negativeColorCss }>{ t('reg:errors.required_field') }</StyledText>) }
          <InputField placeholder={ t('reg:fields.password') } type="password" hidden={ true } ref={ passwordInput } />
          { (passwordError && <StyledText className={ negativeColorCss }>{ t('reg:errors.required_field') }</StyledText>) }
          { (loginError && <StyledText className={ negativeColorCss }>{ t('reg:errors.invalid_credentials') }</StyledText>) }
          <StyledText>{ t('reg:no_account') } <Link to="/register">{ t('reg:register') }</Link></StyledText>
          <FilledButton onClick={ login }>{ t('reg:continue') }</FilledButton>
        </Modal>
      </Layer>
    </div>
  );

  async function login() {
    setLoginError(false);
    setEmailError(!emailInput.current?.value);
    setPasswordError(!passwordInput.current?.value);

    if (!emailInput.current?.value || !passwordInput.current?.value) return;

    setLoginLoading(true);

    const response = await AuthService.login(emailInput.current?.value, passwordInput.current?.value);

    setLoginLoading(false);

    if (!response) {
      setLoginError(true);
      return;
    }

    dispatch(setToken(response.access_token));
    dispatch(setRefreshToken(response.refresh_token));

    history.push('/channels/@home');
  }
}

export default Login;
