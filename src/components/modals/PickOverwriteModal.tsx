import classNames from 'classnames';
import { useStore } from 'effector-react';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import guildsService from '../../services/api/guilds/guilds.service';
import usersService from '../../services/api/users/users.service';
import $ContextMenuStore from '../../store/ContextMenuStore';
import { setModalState } from '../../store/ModalStore';
import User from '../../store/models/User';
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
import $GuildCacheStore from '../../store/GuildCacheStore';
import $RoleCacheStore from '../../store/RolesCacheStore';
import { useParams } from 'react-router-dom';
import $ChannelCacheStore, { cacheChannels } from '../../store/ChannelCacheStore';
import { OverwriteType } from '../../store/models/Channel';

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

interface RouteParams {
  guildId: string
}

function PickOverwriteModal({ active }: ModalProps) {
  const layerRef = useRef(null);

  const { t } = useTranslation(['settings']);
  const { guildId } = useParams<RouteParams>();
  const { id } = useStore($ContextMenuStore);
  const GuildCache = useStore($GuildCacheStore);
  const RoleCache = useStore($RoleCacheStore);
  const ChannelCache = useStore($ChannelCacheStore);

  const [userValue, setUserValue] = useState('');
  const [user, setUser] = useState<User>();
  const [isUserLoading, setUserLoading] = useState(false);
  const [isUserBanning, setUserBanning] = useState(false);
  const [selected, setSelected]: [DropdownKey | null, any] = useState(null);

  const [roleList, setRoleList] = useState<DropdownKey[]>([]);
  
  useEffect(() => {
    const guild = ChannelCache[guildId]?.guild_id!;
    const roles: DropdownKey[] = [];

    GuildCache[guild!]?.roles!.forEach((role) => {
      roles.push({ id: RoleCache[role].id, text: `@${ RoleCache[role].name }`, color: RoleCache[role].color });
    });

    setRoleList(roles);
    
  }, [id, active, ChannelCache[guildId]]);

  useEffect(() => {
    if (active) {
      setSelected(null);
    }
    
  }, []);

  useEffect(() => {
    if (userValue && /(\d){15,}\b/.test(userValue)) {
      const timeOutId = setTimeout(() => { setUserLoading(true); loadUserInfo({ ids: userValue}); }, 300);
      return () => clearTimeout(timeOutId);
    } else if (userValue && /(\S){1,}(#)(\S){4,7}\b/.test(userValue) && userValue !== `${user?.username}#${user?.discriminator}`) {
      const timeOutId = setTimeout(() => { setUserLoading(true); loadUserInfo({ tags: encodeURIComponent(userValue) }); }, 300);
      return () => clearTimeout(timeOutId);
    } else {
      setUserLoading(false);
      setUser(undefined);
    }
    
  }, [userValue]);

  return (
    <Layer className={ classNames({ [LayerBackgroundShadeCss]: true, [InactiveLayerCss]: !active }) } onClick={ (event) => { closeModal(event) } } ref={ layerRef }>
      <Modal className={ css`width: 440px` }>
        <Fragment>
          <ModalHeader>
            { t('modals.overwrite.title') }<br />

            { user && !isUserLoading && (
              <Container>
                { user?.avatar
                  ? <Avatar src={ user?.avatar.replace('/avatar.webp', '/avatar_40.webp') }/>
                  : <LetterAvatar>{ getIconString(user?.username || '') }</LetterAvatar>
                }
                <StyledText className={ css`transform: translateY(-4px);` }>{ user?.username }#{user?.discriminator}</StyledText>
              </Container>
            )}

            { isUserLoading && (
              <Container>
                <Dots />
              </Container>
            )}

            { !user && !isUserLoading && (
              <Container>
              </Container>
            )}
          </ModalHeader>
          
          <InputField placeholder={ t('modals.overwrite.user')! } onChange={ (event) => { setUserValue(event.target.value) } } />

          { !user && (
            <DropdownInput
              keys={ roleList }
              defaultKey={ 0 }
              onChange={ setSelected }
            />
          ) }

          { (!user || setSelected) && <FilledButton onClick={ banUser }>{ !isUserBanning ? t('channel.add_overwrite') : <Dots /> }</FilledButton> }
        </Fragment>
      </Modal>
    </Layer>
  )

  function closeModal(event?: any) {
    if (event.target !== layerRef.current) return;
    setUserLoading(false);
    setUserBanning(false);
    setUser(undefined);
    setModalState({ pickOverwrite: false });
  }

  async function banUser() {
    if (selected || user) {
      const response = await guildsService.patchChannelOverwrite(ChannelCache[guildId].guild_id!, guildId, {
        id: user ? user.id : selected!.id,
        type: !user ? OverwriteType.ROLE : OverwriteType.MEMBER,
        allow: 0,
        deny: 0,
      });

      if (response) {
        const index = ChannelCache[guildId].permission_overwrites.findIndex(ow => ow.id === response.id);

        if (index + 1) {
          ChannelCache[guildId].permission_overwrites[index] = response;
          cacheChannels([ChannelCache[guildId]]);
        } else {
          ChannelCache[guildId].permission_overwrites.push(response);
          cacheChannels([ChannelCache[guildId]]);
        }

        setUserLoading(false);
        setUserBanning(false);
        setUser(undefined);

        return setModalState({ pickOverwrite: false });
      }
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

export default PickOverwriteModal;
