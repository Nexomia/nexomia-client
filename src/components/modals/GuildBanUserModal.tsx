import classNames from 'classnames';
import { useStore } from 'effector-react';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import guildsService from '../../services/api/guilds/guilds.service';
import usersService from '../../services/api/users/users.service';
import $ContextMenuStore, { setContextMenu } from '../../store/ContextMenuStore';
import { setModalState } from '../../store/ModalStore';
import User from '../../store/models/User';
import $UserCacheStore from '../../store/UserCacheStore';
import getIconString from '../../utils/getIconString';
import InactiveLayerCss from '../css/InactiveLayerCss';
import LayerBackgroundShadeCss from '../css/LayerBackgroundShadeCss';
import DropdownKey from '../interfaces/DropdownKey';
import DropdownInput from '../ui/DropdownInput';
import FilledButton from '../ui/FilledButton';
import InputField from '../ui/InputField';
import Layer from '../ui/Layer';
import Modal from '../ui/Modal';
import ModalHeader from '../ui/ModalHeader';
import StyledText from '../ui/StyledText';
import Dots from '../animations/Dots';

const Container = styled.div`
  width: 100%;
  height: 32px;
  display: flex;
  flex-grow: 1;
  flex-direction: row;  
  align-items: center;
  justify-content: center;
  margin-top: 8px;
`

const AvatarCss = `
  width: 32px;
  height: 32px;
  border-radius: 50%;
  line-height: 32px;
  font-size: 12px;
  user-select: none;
  margin-right: 8px;
  text-align: center;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--background-light);
  `
const Avatar = styled.img`${AvatarCss}`
const LetterAvatar = styled.div`${AvatarCss}`

interface ModalProps {
  active: boolean
}

function GuildBanUserModal({ active }: ModalProps) {
  const layerRef = useRef(null);

  const { t } = useTranslation(['settings']);
  const { id, data } = useStore($ContextMenuStore);
  const UserCache = useStore($UserCacheStore);

  const [userValue, setUserValue] = useState('');
  const [user, setUser] = useState<User>();
  const [reasonValue, setReasonValue] = useState('');
  const [isUserLoading, setUserLoading] = useState(false);
  const [isUserBanning, setUserBanning] = useState(false);
  const [isError, setError] = useState(false);
   // eslint-disable-next-line
  const [selected, setSelected]: [DropdownKey | null, any] = useState(null);

  useEffect(() => {
    if (data?.user_id) setUser(UserCache[data?.user_id]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    setError(false);

    if (userValue && /(\d){15,}\b/.test(userValue)) {
      if (UserCache[userValue || data?.user_id]) setUser(UserCache[userValue]);
      else {
        const timeOutId = setTimeout(() => { setUserLoading(true); loadUserInfo({ ids: userValue || data?.user_id }); }, 300);
        return () => clearTimeout(timeOutId);
      }
    } else if (userValue && /(\S){1,}(#)(\S){4,7}\b/.test(userValue) && userValue !== `${user?.username}#${user?.discriminator}`) {
      const timeOutId = setTimeout(() => { setUserLoading(true); loadUserInfo({ tags: encodeURIComponent(userValue) }); }, 300);
      return () => clearTimeout(timeOutId);
    } else {
      setUserLoading(false);
      setUser(undefined);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userValue]);

  const messageDeletionInterval: DropdownKey[] = [
    { id: "0",      text: t('modals.guildBan.nothing')! },
    { id: "3600",   text: t('modals.guildBan.hour')! },
    { id: "86400",  text: t('modals.guildBan.day')! },
    { id: "604800", text: t('modals.guildBan.week')! },
    { id: "-1",     text: t('modals.guildBan.all')! },
  ];

  return (
    <Layer
      className={ classNames({ [LayerBackgroundShadeCss]: true, [InactiveLayerCss]: !active }) }
      onClick={ (event) => { closeModal(event) } }
      ref={ layerRef }
    >
      <Modal className={ css`width: 440px` }>
        <Fragment>
          <ModalHeader>
            { t('modals.guildBan_header') }<br />

            { user && !isUserLoading && (
              <Container>
                {
                  user?.avatar
                  ? <Avatar src={ user?.avatar.replace('/avatar.webp', '/avatar_40.webp') }/>
                  : <LetterAvatar>{ getIconString(user?.username || '') }</LetterAvatar>
                }
                <StyledText className={ css`transform: translateY(-4px);` }>{ user?.username }#{user?.discriminator}</StyledText>
              </Container>
            ) }

            { isUserLoading && (
              <Container>
                <Dots />
              </Container>
            ) }

            { !user && !isUserLoading && (
              <Container>
              </Container>
            ) }
          </ModalHeader>
          
          { !data?.user_id && (
            <InputField placeholder={ t('modals.guildBan_user')! } onChange={ (event) => { setUserValue(event.target.value) } } />
          ) }

          <InputField placeholder={ t('modals.guildBan_reason')! } onChange={ (event) => { setReasonValue(event.target.value) } } />

          <DropdownInput
            keys={ messageDeletionInterval }
            defaultKey={ 0 }
            onChange={ setSelected }
          />

          { user && <FilledButton onClick={ banUser }>{ !isUserBanning ? t('modals.guildBan_ban') : <Dots /> }</FilledButton> }
          { isError && <StyledText className={css`color: var(--text-negative); padding-top: 8px;`}>{ t('modals.guildBan_error') }</StyledText> }
        </Fragment>
      </Modal>
    </Layer>
  )

  function closeModal(event: any) {
    if (event.target !== layerRef.current) return;

    setError(false);
    setUserLoading(false);
    setUserBanning(false);
    setUser(undefined);
    setModalState({ guildBanUser: false });
  }

  async function banUser() {
    if (!id || !user) return;

    setUserBanning(true);
    const res = await guildsService.addGuildBan(id, user.id, reasonValue && reasonValue !== '' ? { reason: reasonValue } : {});

    if (res) {
      if (data?.update) data.update();
      setUserBanning(false);
      setContextMenu({});
      setModalState({ guildBanUser: false });
    } else {
      setError(true);
      setUserBanning(false);
    }
  }
  
  async function loadUserInfo(data: { ids?: string, tags?: string }) {
    const userInfo = await usersService.getUsers(data);

    setUserLoading(false);

    if (userInfo) {
      setUser(userInfo[0]);
    } else {
      setUser(undefined);
    }
  }
}

export default GuildBanUserModal;
