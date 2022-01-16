import classNames from 'classnames';
import { useStore } from 'effector-react';
import { css } from 'linaria';
import { styled } from 'linaria/lib/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import guildsService from '../../services/api/guilds/guilds.service';
import usersService from '../../services/api/users/users.service';
import $ContextMenuStore, { setContextMenu } from '../../store/ContextMenuStore';
import { setModalState } from '../../store/ModalStore';
import $UserCacheStore, { cacheUsers } from '../../store/UserCacheStore';
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

const Container = styled.div`
  width: 100%;
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
  const [reasonValue, setReasonValue] = useState('');
  const [selected, setSelected]: [DropdownKey | null, any] = useState(null);

  useEffect(() => {
    if (active) {
      setSelected(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userValue && userValue.length > 6 && !UserCache[userValue || data?.user_id]) {
      const timeOutId = setTimeout(() => { loadUserInfo(userValue);}, 300);
      return () => clearTimeout(timeOutId);
    }
  }, [userValue]);

  const messageDeletionInterval: DropdownKey[] = [
    {id: "0", text: t('modals.guildBan.nothing')},
    {id: "3600", text: t('modals.guildBan.hour')},
    {id: "86400", text: t('modals.guildBan.day')},
    {id: "604800", text: t('modals.guildBan.week')},
    {id: "-1", text: t('modals.guildBan.all')},
  ];

  return (
    <Layer className={ classNames({ [LayerBackgroundShadeCss]: true, [InactiveLayerCss]: !active }) } onClick={ (event) => { closeModal(event) } } ref={ layerRef }>
      <Modal className={ css`width: 440px` }>
          <Fragment>
            <ModalHeader>{ t('modals.guildBan_header') }<br />
            { (UserCache[userValue || data?.user_id] || data?.user_id) && (
              <Container>
                { UserCache[userValue || data?.user_id].avatar
                  ? <Avatar src={ UserCache[userValue || data?.user_id].avatar.replace('/avatar.webp', '/avatar_40.webp') }/>
                  : <LetterAvatar>{ getIconString(UserCache[userValue || data?.user_id].username || '') }</LetterAvatar>
                }
                <StyledText className={ css`transform: translateY(-4px);` }>{ UserCache[userValue || data?.user_id].username }#{UserCache[userValue || data?.user_id].discriminator}</StyledText>
              </Container>
            )}
              </ModalHeader>
            
            { !data?.user_id && (
              <InputField placeholder={ t('modals.guildBan_user') } onChange={ (event) => { setUserValue(event.target.value) } } />
            )}
            <InputField placeholder={ t('modals.guildBan_reason') } onChange={ (event) => { setReasonValue(event.target.value) } } />
            <DropdownInput
              keys={ messageDeletionInterval }
              defaultKey={ 0 }
              onChange={ setSelected }
            />
            { UserCache[userValue || data?.user_id] && <FilledButton onClick={ banUser }>{ t('modals.guildBan_ban') }</FilledButton> }
          </Fragment>
      </Modal>
    </Layer>
  )

  function closeModal(event: any) {
    if (event.target !== layerRef.current) return;
    setModalState({ guildBanUser: false });
  }

  async function banUser() {
    if (id) {
      const res = await guildsService.addGuildBan(id, userValue || data?.user_id, reasonValue && reasonValue !== '' ? { reason: reasonValue } : {});
      if (res) {
        if (data?.update)
          data.update();
        setContextMenu({});
        setModalState({ guildBanUser: false });
      }
    }
  }
  
  async function loadUserInfo(uid: string) {
    const userInfo = await usersService.getUser(uid);
      cacheUsers([userInfo]);
  }

}

export default GuildBanUserModal;
